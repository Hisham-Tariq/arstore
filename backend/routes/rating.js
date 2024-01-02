const express = require('express');
const router = express.Router();
const RatingModel = require('../models/rating');
const OrderModel = require('../models/order');
const roleAuth = require('../helpers/role-auth');

// Create a new rating
router.post('/',roleAuth(['admin']),async (req, res) => {
    try {
        const { productId, userId, userName, stars, comment, orderId, variantName } = req.body;

        const newReview = {
            userId,
            userName,
            stars,
            comment,
            orderId,
        };

        const rating = await RatingModel.findOne({ productId });

        if (!rating) {
            // If there is no rating for the product, create a new one
            const newRatingModel = new RatingModel({
                productId,
                reviews: [newReview],
            });

            await newRatingModel.save();
        } else {
            // If there is an existing rating, update it
            rating.reviews.push(newReview);
            await rating.save();
        }

        const order = await OrderModel.findOne(orderId)
        if (order) {
            order.products.forEach(product => {
                if (product.productId === productId && product.variantName === variantName) {
                    product.reviewed = true;
                    product.stars = stars;
                }
            })
            await order.save();
        }

        res.json({ message: 'Rating added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all ratings for a product
router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const rating = await RatingModel.findOne({ productId });

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        res.json(rating);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a rating (if needed)
router.put('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const { userId, stars, comment } = req.body;

        const rating = await RatingModel.findOne({ productId });

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        const userRating = rating.reviews.find((r) => r.userId.equals(userId));

        if (!userRating) {
            return res.status(404).json({ message: 'User rating not found' });
        }

        // Update the user's rating
        userRating.stars = stars;
        userRating.comment = comment;

        await rating.save();

        res.json({ message: 'Rating updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a rating (if needed)
router.delete('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const { userId } = req.body;

        const rating = await RatingModel.findOne({ productId });

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Remove the user's rating
        rating.reviews = rating.reviews.filter((r) => !r.userId.equals(userId));

        await rating.save();

        res.json({ message: 'Rating deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get reviews by order id

// Get all ratings for a specific order
router.get('/order/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Find all ratings that have reviews associated with the specified orderId
        const ratings = await RatingModel.find({ 'reviews.orderId': orderId });

        // Filter and structure the response to include ratings for each product in the order
        const orderRatings = ratings.map((rating) => {
            // Filter the reviews for the specified orderId
            const orderReviews = rating.reviews.filter((review) => review.orderId.equals(orderId));

            // Return a new object for each product in the order
            return {
                productId: rating.productId,
                avgRating: rating.avgRating,
                createdAt: rating.createdAt,
                reviews: orderReviews,
                totalReviews: orderReviews.length,
            };
        });

        res.json(orderRatings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
