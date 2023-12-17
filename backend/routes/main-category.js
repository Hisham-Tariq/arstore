const express = require('express');
const router = express.Router();
const MainCategoryModel = require('../models/main-category');
const roleAuth = require('../helpers/role-auth'); // Adjust the path

// Get all main categories
router.get('/', async (req, res) => {
    try {
        const mainCategories = await MainCategoryModel.find();
        res.json(mainCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific main category by ID
router.get('/:id', async (req, res) => {
    try {
        const mainCategory = await MainCategoryModel.findById(req.params.id);

        if (!mainCategory) {
            return res.status(404).json({ message: 'Main category not found' });
        }

        res.json(mainCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new main category
router.post('/', roleAuth(['admin']), async (req, res) => {
    try {
        const { name, description } = req.body;
        const newMainCategory = new MainCategoryModel({ name, description });
        const savedMainCategory = await newMainCategory.save();
        res.json(savedMainCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a main category by ID
router.put('/:id', roleAuth(['admin']), async (req, res) => {
    try {
        const mainCategory = await MainCategoryModel.findById(req.params.id);

        if (!mainCategory) {
            return res.status(404).json({ message: 'Main category not found' });
        }

        const { name, description } = req.body;

        mainCategory.name = name;
        mainCategory.description = description;

        const updatedMainCategory = await mainCategory.save();
        res.json(updatedMainCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a main category by ID
router.delete('/:id', roleAuth(['admin']), async (req, res) => {
    try {
        const mainCategory = await MainCategoryModel.findById(req.params.id);

        if (!mainCategory) {
            return res.status(404).json({ message: 'Main category not found' });
        }

        await mainCategory.remove();
        res.json({ message: 'Main category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
