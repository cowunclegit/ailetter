const express = require('express');
const router = express.Router();
const SubscriberModel = require('../models/subscriberModel');

router.post('/', async (req, res, next) => {
    const { email } = req.body || {};
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const existing = await SubscriberModel.findByEmail(email);
        if (existing) {
            return res.status(409).json({ message: 'Email already subscribed.' });
        }
        const subscriber = await SubscriberModel.create(email);
        res.status(201).json(subscriber);
    } catch (error) {
        next(error);
    }
});

router.post('/unsubscribe', async (req, res, next) => {
    const { token } = req.body || {};
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
    try {
        const result = await SubscriberModel.unsubscribeByToken(token);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Token not found.'});
        }
        res.status(200).json({ message: 'Unsubscribed successfully.' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;