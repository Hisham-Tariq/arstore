const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // type: {
    //     type: String,
    //     enum: ['glasses', 'lenses'],
    //     required: true,
    // },
    mainCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainCategory',
        required: true,
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating',
    },
    genders: {
        type: String,
        enum: ['Male', 'Female', 'Both'],
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'dependent inactive'],
        default: 'active',
    },
    variants: [
        {
            name: {
                type: String,
                required: true,
            },
            colorCode: {
                type: String,
                required: true,
            },
            stock: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            images: {
                thumbnail: {
                    type: String, // URL or file path
                },
                left: {
                    type: String, // URL or file path
                },
                right: {
                    type: String, // URL or file path
                },
                model: {
                    type: String, // URL or file path
                },
            },
        },
    ],
}, {
    minimize: false,
});
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.virtual('colors').get(function () {
    return this.variants.map((variant) => variant.colorCode);
});

productSchema.virtual('images').get(function () {
    let images = {}
    for (const variant of this.variants) {
        images[variant.colorCode] = variant.images
    }
    return images;
});

productSchema.set('toJSON', {
    virtuals: true,
});

const ProductModel = mongoose.model('Product', productSchema);


module.exports = ProductModel
