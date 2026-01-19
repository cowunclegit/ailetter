const express = require('express');
const router = express.Router();
const AiPresetModel = require('../models/aiPresetModel');

router.get('/', async (req, res, next) => {
  try {
    const presets = await AiPresetModel.getAll();
    res.json(presets);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const preset = await AiPresetModel.create(req.body);
    res.status(201).json(preset);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const success = await AiPresetModel.update(req.params.id, req.body);
    if (!success) return res.status(404).json({ message: 'Preset not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const preset = await AiPresetModel.getById(req.params.id);
    if (!preset) return res.status(404).json({ message: 'Preset not found' });
    if (preset.is_default) {
      return res.status(403).json({ message: 'Cannot delete default presets' });
    }

    const success = await AiPresetModel.delete(req.params.id);
    res.json({ success: !!success });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
