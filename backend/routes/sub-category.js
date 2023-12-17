const express = require('express');
const router = express.Router();
const SubCategoryModel = require('../models/sub-category');
const roleAuth = require('../helpers/role-auth'); // Adjust the path

// Get all subcategories
router.get('/', async (req, res) => {
    try {
        const subCategories = await SubCategoryModel.find();
        res.json(subCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific subcategory by ID
router.get('/:id', async (req, res) => {
    try {
        const subCategory = await SubCategoryModel.findById(req.params.id);

        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.json(subCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new subcategory
router.post('/', roleAuth(['admin']), async (req, res) => {
    try {
        const { name, description, mainCategoryId } = req.body;
        const newSubCategory = new SubCategoryModel({ name, description, mainCategoryId });
        const savedSubCategory = await newSubCategory.save();
        res.json(savedSubCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a subcategory by ID
router.put('/:id', roleAuth(['admin']), async (req, res) => {
    try {
        const subCategory = await SubCategoryModel.findById(req.params.id);

        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        const { name, description, mainCategoryId } = req.body;

        subCategory.name = name;
        subCategory.description = description;
        subCategory.mainCategoryId = mainCategoryId;

        const updatedSubCategory = await subCategory.save();
        res.json(updatedSubCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a subcategory by ID
router.delete('/:id', roleAuth(['admin']), async (req, res) => {
    try {
        const subCategory = await SubCategoryModel.findById(req.params.id);

        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        await subCategory.remove();
        res.json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
