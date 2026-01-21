const express = require('express');
const router = express.Router();
const SubscriberService = require('../services/subscriberService');

// GET /api/subscribers
router.get('/', async (req, res) => {
  try {
    const subscribers = await SubscriberService.getAllSubscribers();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/subscribers/:id
router.get('/:id', async (req, res) => {
  try {
    const subscriber = await SubscriberService.getSubscriber(req.params.id);
    if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });
    res.json(subscriber);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/subscribers
router.post('/', async (req, res) => {
  try {
    const subscriber = await SubscriberService.createSubscriber(req.body);
    res.status(201).json(subscriber);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/subscribers/:id
router.put('/:id', async (req, res) => {
  try {
    const subscriber = await SubscriberService.updateSubscriber(req.params.id, req.body);
    res.json(subscriber);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/subscribers/unsubscribe/:uuid
router.post('/unsubscribe/:uuid', async (req, res) => {
  try {
    const subscriber = await SubscriberService.unsubscribe(req.params.uuid);
    res.json({ message: 'Unsubscribed successfully', subscriber });
  } catch (err) {
    const status = err.message === 'Subscriber not found' ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
});

// POST /api/subscribers/sync
router.post('/sync', async (req, res) => {
  try {
    const result = await SubscriberService.syncSubscribers();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;