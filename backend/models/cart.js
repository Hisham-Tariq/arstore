const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Assuming you have a Product model
                required: true,
            },
            variantName: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
//
// cartSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });
//
// cartSchema.set('toJSON', {
//     virtuals: true,
// });

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = CartModel;