const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserModel = require('../models/user');
const {check, validationResult} = require('express-validator');
const limiter = require('../helpers/rate-limit');


registerValidation = [
    check('firstName', 'First name is required')
        .matches(/^[a-zA-Z]+$/).withMessage('First name must be alphabetic').trim().escape(),
    check('lastName', 'Last name is required')
        .matches(/^[a-zA-Z]+$/).withMessage('Last name must be alphabetic').trim().escape(),
    check('email', 'Valid Email is required').isEmail().trim().escape().normalizeEmail(),
    check('password', 'Password is required')
        .isLength({min: 6}).withMessage('Password Must Be at Least 8 Characters')
        .matches('[0-9]').withMessage('Password Must Contain a Number')
        .matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter')
        .matches('[a-z]').withMessage('Password Must Contain a Lowercase Letter')
        .trim().escape(),
    ];


// Route for user registration
router.post('/register',limiter(3, 1), registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
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
            firstName, lastName, email, passwordHash, type: 'user', // Assuming all registered users are of type 'user'
        });

        const savedUser = await newUser.save();

        // Generate and return a JWT token upon successful registration
        const token = jwt.sign({userId: savedUser.id}, secret, {
            expiresIn: '1d',
        });

        // fetch the current user without the password hash
        const user = await UserModel.findById(savedUser.id).select('-passwordHash');

        res.json({
            user: user, token,
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


loginValidation = [
    check('email', 'Valid Email is required').isEmail().trim().escape().normalizeEmail(),
    check('password', 'Password is required').trim().escape(),
    ];

// Route for user login
// limit added to tackle brute force attacks
// 3 requests per minute from a single ip
router.post('/login',limiter(3, 1), loginValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
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
        res.cookie('token', token, {httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 2});
        req.session.token = token;

        console.log("Session", req.session)

        // fetch the current user without the password hash
        const loggedInUser = await UserModel.findById(user.id).select('-passwordHash');

        res.json({
            user: loggedInUser,
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
