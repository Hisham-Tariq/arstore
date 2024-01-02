const express = require('express');
const router = express.Router();
const OrderModel = require('../models/order');
const roleAuth = require("../helpers/role-auth");

// Create a new order
router.post('/', async (req, res) => {
    try {
        const {userId, products} = req.body;

        if (products.length === 0) {
            return res.status(400).json({message: 'Products cannot be empty'});
        }
        let totalAmount = 0;
        for (const product of products) {
            totalAmount += product.pricePerQty * product.quantity;
        }
        const newOrder = new OrderModel({
            user: userId,
            products,
            totalAmount
        });
        const savedOrder = await newOrder.save();
        res.json(savedOrder);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get all orders
router.get('/', roleAuth(['admin']), async (req, res) => {
    try {
        const orders = await OrderModel.find().populate('user').populate('products.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get a specific order by ID
router.get('/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await OrderModel.findById(orderId).populate('user').populate('products.product');

        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Update an order by ID
router.put('/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const {products, totalAmount, status} = req.body;

        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }

        order.products = products;
        order.totalAmount = totalAmount;
        order.status = status;

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Update a order Status
router.put('/:orderId/status', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const {status} = req.body;
        if (!status) {
            return res.status(404).json({message: 'Status not found'});
        }
        const validStatus = ['pending', 'processing', 'shipped', 'delivered'];
        if (!validStatus.includes(status)) {
            return res.status(404).json({message: 'Invalid Status'});
        }

        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }
        order.addStatusChangeHistory(order.status, status);
        order.status = status;
        order.updateDeliveryDate();
        await order.save();
        const updatedOrder = await OrderModel.findById(orderId).populate('user').populate('products.product');
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Delete an order by ID
router.delete('/:orderId', roleAuth(['admin']), async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }

        await order.remove();

        res.json({message: 'Order deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get all orders of a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await OrderModel.find({user: userId}).populate('user').populate('products.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
