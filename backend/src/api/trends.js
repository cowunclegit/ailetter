const express = require('express');
const router = express.Router();
const TrendItemModel = require('../models/trendItemModel');
const { collectionService, runCollection } = require('../jobs/collectionJob');

router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const aiSelectedOnly = req.query.ai_selected_only === 'true';
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    
    let categoryIds = req.query.categoryIds;
    if (categoryIds) {
      if (!Array.isArray(categoryIds)) categoryIds = [categoryIds];
      categoryIds = categoryIds.map(Number);
    }
    
    const trends = await TrendItemModel.getAll({ limit, offset, aiSelectedOnly, startDate, endDate, categoryIds });
    res.json(trends);
  } catch (error) {
    next(error);
  }
});

router.post('/collect', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body || {};
    const lockKey = startDate || 'auto';

    if (collectionService.activeCollections.get(lockKey)) {
      return res.status(409).json({ error: 'Collection already in progress for this week' });
    }

    // Trigger collection asynchronously
    runCollection(startDate, endDate).catch(err => console.error('Manual collection error:', err));
    
    res.status(202).json({ status: 'started' });
  } catch (error) {
    next(error);
  }
});

router.get('/collect/status', (req, res) => {
  const { startDate } = req.query;
  const lockKey = startDate || 'auto';
  res.json({ isCollecting: !!collectionService.activeCollections.get(lockKey) });
});

module.exports = router;