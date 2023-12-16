const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserModel = require('../models/user'); // Update the path accordingly

// Route for user registration
router.post('/register', async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        const secret = process.env.secret;

        // Check if the email is already registered
        const existingUser = await UserModel.findOne({email});

        if (existingUser) {
            return res.status(400).json({message: 'Email is already registered'});
        }

        // Hash the password before saving it to the database
        const passwordHash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            passwordHash,
            type: 'user', // Assuming all registered users are of type 'user'
        });

        const savedUser = await newUser.save();

        // Generate and return a JWT token upon successful registration
        const token = jwt.sign({userId: savedUser.id}, secret, {
            expiresIn: '1d',
        });

        // fetch the current user without the password hash
        const user = await UserModel.findById(savedUser.id).select('-passwordHash');

        res.json({
            user: user,
            token,
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Route for user login
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const secret = process.env.secret;

        // Find the user by email
        const user = await UserModel.findOne({email});

        // Check if the user exists
        if (!user) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        // Check if the provided password is correct
        const isPasswordValid = bcrypt.compareSync(req.body.password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(400).json({message: 'Invalid email or password'});
        }
        // Generate and return a JWT token upon successful login
        const token = jwt.sign({userId: user.id}, secret, {
            expiresIn: '1d',
        });

        // fetch the current user without the password hash
        const loggedInUser = await UserModel.findById(user.id).select('-passwordHash');

        res.json({
            user: loggedInUser,
            token,
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
