const mongoose = require('mongoose');

const mainCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

mainCategorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

mainCategorySchema.set('toJSON', {
    virtuals: true,
});
const MainCategoryModel = mongoose.model('MainCategory', mainCategorySchema);

module.exports = MainCategoryModel;