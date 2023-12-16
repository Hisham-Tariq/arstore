const express = require('express');
const router = express.Router();
const UserModel = require('../models/user'); // Update the path accordingly

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await UserModel.find().select('-passwordHash');
        console.log(req.currentUser)
        res.json(users);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get the details of the current authenticated user
router.get('/me', async (req, res) => {
    try {
        res.json(req.currentUser);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Get a specific user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const {firstName, lastName, email, type, phone, address, city, state, zip} = req.body;

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.type = type;
        user.phone = phone;
        user.address = address;
        user.city = city;
        user.state = state;
        user.zip = zip;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        await user.remove();
        res.json({message: 'User deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
