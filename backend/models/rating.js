const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    avgRating: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Assuming you have a User model
                required: true,
            },
            userName: {
                type: String,
                required: true,
            },
            stars: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order',
                required: true,
            },
            comment: {
                type: String,
                default: '',
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});
ratingSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
ratingSchema.set('toJSON', {
    virtuals: true,
});

// virtual for totalReviews
ratingSchema.virtual('totalReviews').get(function () {
    return this.reviews.length;
});

// Middleware to update avgRating when a new rating is added
ratingSchema.pre('save', function (next) {
    const sum = this.reviews.reduce((acc, review) => acc + review.stars, 0);
    this.avgRating = this.reviews.length > 0 ? sum / this.reviews.length : 0;
    next();
});



const RatingModel = mongoose.model('Rating', ratingSchema);

module.exports = RatingModel;
