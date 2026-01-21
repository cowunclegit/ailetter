const express = require('express');
const router = express.Router();
const SourceModel = require('../models/sourceModel');

router.get('/', async (req, res, next) => {
    try {
        const { category_id } = req.query;
        const sources = await SourceModel.getAll(category_id);
        res.json(sources);
    } catch(err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const source = await SourceModel.create(req.body || {});
        res.status(201).json(source);
    } catch(err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { type, ...updateData } = req.body; // Explicitly exclude type from update data
        const result = await SourceModel.update(req.params.id, updateData);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Source not found' });
        }
        const updatedSource = await SourceModel.getById(req.params.id);
        res.json(updatedSource);
    } catch(err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const result = await SourceModel.delete(req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Source not found' });
        }
        res.status(204).send();
    } catch(err) {
        next(err);
    }
});

module.exports = router;
