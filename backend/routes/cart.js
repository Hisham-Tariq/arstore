const express = require('express');
const router = express.Router();
const CartModel = require('../models/cart');
const UserModel = require('../models/user');
const ProductModel = require('../models/product');

// Get user's cart
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user's cart
        const cart = await CartModel.findOne({userId}).populate('items.product');

        if (!cart) {
            return res.status(404).json({message: 'Cart not found for the user'});
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Add item to the cart
router.post('/user/:userId/add', async (req, res) => {
    try {
        const userId = req.params.userId;
        const {productId, quantity, variantName} = req.body;

        // Validate the product and user
        const [user, product] = await Promise.all([
            UserModel.findById(userId),
            ProductModel.findById(productId),
        ]);


        if (!user || !product) {
            return res.status(404).json({message: 'User or Product not found'});
        }
        // Check if the user already has a cart
        let cart = await CartModel.findOne({userId});

        if (!cart) {
            // If the user doesn't have a cart, create one
            cart = new CartModel({userId, items: []});
        }

        // Check if the product is already in the cart
        const existingItem = cart.items.find(
            (item) => item.product.equals(productId) && item.variantName === variantName
        );

        if (existingItem) {
            // If the product is already in the cart, update the quantity
            existingItem.quantity += quantity || 1;
        } else {
            // If the product is not in the cart, add it
            cart.items.push({product: productId, quantity: quantity || 1, variantName});
        }

        // Save the cart
        await cart.save();

        // get the updated cart
        const updatedCart = await CartModel.findOne({userId}).populate('items.product');
        res.json(updatedCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
});

// Add item to the cart
router.post('/user/:userId/update', async (req, res) => {
    try {
        const userId = req.params.userId;
        const {productId, variantName, quantity} = req.body;

        const cart = await CartModel.findOne({userId}).populate('items.product');

        // Check if the product is already in the cart
        const existingItem = cart.items.find(
            (item) => item.product.equals(productId) && item.variantName === variantName
        );

        if (!existingItem) {
            return res.status(404).json({message: 'Item does not exist in cart'});
        }
        // if (action === 'decrement') {
        //     if (existingItem.quantity === 1) {
        //         // Remove the item from the cart
        //         cart.items = cart.items.filter(
        //             (item) => !(item.product.equals(productId) && item.variantName === variantName)
        //         );
        //     } else {
        //         existingItem.quantity -= 1;
        //     }
        // } else {
        //     existingItem.quantity += 1;
        // }

        existingItem.quantity = quantity;

        // Save the cart
        await cart.save();

        // get the updated cart
        const updatedCart = await CartModel.findOne({userId}).populate('items.product');
        res.json(updatedCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
});

// Remove item from the cart
router.post('/user/:userId/remove', async (req, res) => {
    try {
        const userId = req.params.userId;
        const {productId, variantName} = req.body;

        // Find the user's cart
        const cart = await CartModel.findOne({userId});

        if (!cart) {
            return res.status(404).json({message: 'Cart not found for the user'});
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(
            (item) => !(item.product.equals(productId) && item.variantName === variantName)
        );

        // Save the updated cart
        await cart.save();
        const updatedCart = await CartModel.findOne({userId}).populate('items.product');
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Clear the entire cart
router.post('/user/:userId/clear', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user's cart
        const cart = await CartModel.findOne({userId});

        if (!cart) {
            return res.status(404).json({message: 'Cart not found for the user'});
        }

        // Clear all items from the cart
        cart.items = [];

        // Save the updated cart
        await cart.save();

        const updatedCart = await CartModel.findOne({userId}).populate('items.product');
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
