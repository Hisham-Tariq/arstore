// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const router = express.Router();
//
// const User = require('../models/user');
//
// router.get('/', async (req, res) => {
//     const userList = await User.find().select('-passwordHash');
//     if (!userList) {
//         res.status(500).json({success: false})
//     }
//     res.send(userList);
// })
//
// router.get('/me', async (req, res) => {
//     try {
//         res.json(req.currentUser);
//     } catch (error) {
//         res.status(500).json({error: error.message});
//     }
// });
//
// router.get('/:id', async (req, res) => {
//     const user = await User.findById(req.params.id).select('-passwordHash');
//
//     if (!user) {
//         res.status(500).json({success: false, message: 'The user with the given ID not exists'})
//     }
//     res.status(200).send(user)
//
// })
//
//
// router.delete('/:id', (req, res) => {
//     User.findByIdAndRemove(req.params.id).then(user => {
//         if (user) {
//             return res.status(200).json({success: true, message: 'User deleted successfully'})
//         } else {
//             return res.status(404).json({success: false, message: 'User cannot find'})
//         }
//     }).catch(err => {
//         return res.status(400).json({success: false, error: err})
//     })
// })
//
//
// router.get('/get/count', async (req, res) => {
//     const userCount = await User.countDocuments((count) => count);
//     if (!userCount) {
//         res.status(500), json({success: false})
//     }
//     res.status(200).send({
//         userCount: userCount
//     });
// })
//
// module.exports = router;

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
