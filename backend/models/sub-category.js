const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainCategory',
        required: true,
    },
});

subCategorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

subCategorySchema.set('toJSON', {
    virtuals: true,
});

const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategoryModel;