const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Assuming you have a Product model
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
            pricePerQty: {
                type: Number,
                required: true,
            },
            variantName: {
                type: String,
                required: true,
            },
            reviewed: {
                type: Boolean,
                default: false
            },
            stars: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            }
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered'],
        default: 'pending',
    },
        statusChangedHistory: [
        {
            from: {
                type: String,
                enum: ['pending', 'processing', 'shipped', 'delivered'],
                required: true,
            },
            to: {
                type: String,
                enum: ['pending', 'processing', 'shipped', 'delivered'],
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deliveredDate: {
        type: Date,
    }
});

// Function to add status change history
orderSchema.methods.addStatusChangeHistory = function (fromStatus, toStatus) {
    this.statusChangedHistory.push({
        from: fromStatus,
        to: toStatus,
        date: new Date(),
    });
};

// Function to update delivery date
orderSchema.methods.updateDeliveryDate = function () {
    if (this.status === 'delivered') {
        this.deliveredDate = new Date();
    }
};

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;
