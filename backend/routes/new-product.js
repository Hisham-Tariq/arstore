const express = require('express');
const router = express.Router();
const RatingModel = require('../models/rating');
const ProductModel = require('../models/product');
const subCategoryModel = require('../models/sub-category');
const multer = require("multer");
const limiter = require('../helpers/rate-limit'); 
const roleAuth = require('../helpers/role-auth');

const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error("Invalid Image Type");
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, "public/uploads");
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split("").join("-");
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const upload = multer({storage: storage});

// Create a new product
router.post('/', roleAuth(['admin']), async (req, res) => {
    try {
        const {name, subCategory, genders, description, isActive, variants} = req.body;

        //  find the mainCategory from sub category
        const subCategoryDoc = await subCategoryModel.findById(subCategory);
        const mainCategory = subCategoryDoc.mainCategoryId;

        const newProduct = new ProductModel({
            name,
            mainCategory,
            subCategory,
            description,
            isActive,
            variants,
            genders
        });

        // check if the no 2 variants have the same name
        const variantNames = variants.map((variant) => variant.name);
        const uniqueVariantNames = [...new Set(variantNames)];
        if (variantNames.length !== uniqueVariantNames.length) {
            return res.status(400).json({message: 'Variant names must be unique'});
        }

        const savedProduct = await newProduct.save();
        // create the rating for the product
        const newRating = new RatingModel({
            productId: savedProduct._id,
            reviews: [],
        });
        // save the rating
        const savedRating = await newRating.save();
        // update the rating field in the product
        savedProduct.rating = savedRating._id;
        await savedProduct.save();
        // fetch the product with the rating
        const product = await ProductModel.findById(savedProduct._id).populate('rating').populate('mainCategory').populate('subCategory');
        res.json(product);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// add variant to product
router.post('/:productId/variants', async (req, res) => {
    try {
        const productId = req.params.productId;
        const {name, price, stock, colorCode} = req.body;

        // Find the product by ID
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        // check if the variant name already exists
        const variant = product.variants.find((variant) => variant.name === name);
        if (variant) {
            return res.status(400).json({message: 'Variant name already exists'});
        }

        // add the new variant to the product
        product.variants.push({
            name,
            price,
            stock,
            colorCode,
            images: {},
        });

        await product.save();

        res.json({message: 'Variant added successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// update product images by ID thumbnail, left, right
router.post('/:productId/variants/:variantName/images/:imageType', upload.single('image'), async (req, res) => {
    try {
        const productId = req.params.productId;
        const imageType = req.params.imageType;
        const variantName = req.params.variantName;

        // Find the product by ID
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        const variant = product.variants.find((variant) => variant.name === variantName);
        if (!variant) {
            return res.status(404).json({message: 'Variant not found'});
        }
        // Validate image type
        const validImageTypes = ['thumbnail', 'left', 'right', 'model'];
        if (!validImageTypes.includes(imageType)) {
            return res.status(400).json({message: 'Invalid image type'});
        }

        const file = req.file;
        if (!file) return res.status(400).send("No image in the request");

        // Extract uploaded image filename
        const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
        const imagePath = `${basePath}/${file.filename}`;
        // Update the specified image type in the product
        product.variants.forEach((variant) => {
            if (variant.name === variantName) {
                variant.images[imageType] = imagePath;
            }
        });

        await product.save();

        res.json({message: `Product ${imageType} image updated successfully`});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get all products
router.get('/', limiter(100, 1),async (req, res) => {
    console.log(req.ip)
    console.log(req.currentUser)
    try {
        const products = await ProductModel.find().populate('mainCategory').populate('subCategory').populate('rating');
        res.json(products);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get a specific product by ID
router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await ProductModel.findById(productId).populate('mainCategory').populate('subCategory').populate('rating');

        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Update a product by ID
router.put('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const {name, subCategory, description, variants, genders} = req.body;

        const subCategoryDoc = await subCategoryModel.findById(subCategory);
        const mainCategory = subCategoryDoc.mainCategoryId;

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        product.name = name;
        product.mainCategory = mainCategory;
        product.subCategory = subCategory;
        product.description = description;
        product.genders = genders;
        product.variants = variants;

        const updatedProduct = await product.save();
        const p = await ProductModel.findById(updatedProduct._id).populate('mainCategory').populate('subCategory').populate('rating');
        res.json(p);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Delete a product by ID
router.delete('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        await product.remove();
        // remove the rating for the product
        await RatingModel.findByIdAndRemove(product.rating);

        res.json({message: 'Product deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
