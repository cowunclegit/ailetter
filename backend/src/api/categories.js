const express = require('express');
const router = express.Router();
const categoryService = require('../services/categoryService');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:id
router.get('/:id', async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    if (error.message === 'Category not found') {
      res.status(404).json({ error: error.message });
    } else {
      console.error('Error fetching category:', error);
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Category name already exists' });
    } else if (error.message === 'Category name is required') {
        res.status(400).json({ error: error.message });
    } else {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    if (error.message === 'Category not found') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'Category name is required') {
        res.status(400).json({ error: error.message });
    } else if (error.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Category name already exists' });
    } else {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Category not found') {
      res.status(404).json({ error: error.message });
    } else {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }
});

module.exports = router;
