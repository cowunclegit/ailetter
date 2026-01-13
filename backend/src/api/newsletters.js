const express = require('express');
const router = express.Router();
const NewsletterService = require('../services/newsletterService');
const EmailService = require('../services/emailService');
const SubscriberModel = require('../models/subscriberModel');
const { generateNewsletterHtml } = require('../utils/emailTemplate');

const newsletterService = new NewsletterService();
const emailService = new EmailService();

router.get('/', async (req, res, next) => {
  try {
    const newsletters = await newsletterService.getAll();
    res.json(newsletters);
  } catch (error) {
    next(error);
  }
});

router.get('/active-draft', async (req, res, next) => {
  try {
    const draft = await newsletterService.getActiveDraft();
    res.json(draft); // Will be null if none found
  } catch (error) {
    next(error);
  }
});

router.post('/active-draft/toggle-item', async (req, res, next) => {
  const { item_id } = req.body || {};
  if (!item_id) return res.status(400).json({ message: 'item_id is required' });

  try {
    const draft = await newsletterService.getActiveDraft();
    if (!draft) return res.status(404).json({ message: 'No active draft found' });

    const result = await newsletterService.toggleItem(draft.id, item_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { item_ids } = req.body || {};
  if (!item_ids || !Array.isArray(item_ids) || item_ids.length === 0) {
    return res.status(400).json({ message: 'item_ids are required' });
  }

  try {
    const draft = await newsletterService.createDraft(item_ids);
    res.status(201).json(draft);
  } catch (error) {
    if (error.message.includes('One or more item_ids are invalid')) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const newsletter = await newsletterService.getById(req.params.id);
    if (!newsletter) return res.status(404).json({ message: 'Newsletter not found' });
    res.json(newsletter);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/reorder', async (req, res, next) => {
  const { item_orders } = req.body || {};
  if (!item_orders || !Array.isArray(item_orders)) {
    return res.status(400).json({ message: 'item_orders are required' });
  }

  try {
    await newsletterService.updateItemOrder(req.params.id, item_orders);
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/send-test', async (req, res, next) => {
  try {
    const result = await emailService.sendTestNewsletter(req.params.id);
    res.json({ message: `Test mail sent successfully to ${result.recipient}.` });
  } catch (error) {
    next(error);
  }
});

router.get('/confirm/:uuid', async (req, res, next) => {
  try {
    const result = await newsletterService.confirmAndSendNewsletter(req.params.uuid, emailService);
    
    if (result.error) {
      if (result.error === 'not_found') return res.status(404).redirect('http://localhost:5173/confirmation-failed?reason=invalid');
      if (result.error === 'already_processed') return res.status(409).redirect('http://localhost:5173/confirmation-failed?reason=processed');
      if (result.error === 'expired') return res.status(410).redirect('http://localhost:5173/confirmation-failed?reason=expired');
    }

    res.redirect('http://localhost:5173/confirmation-success');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/send', async (req, res, next) => {
    try {
        // In a real app, we'd get items from the newsletter ID
        const items = [{title: 'Test', original_url: 'http://test.com'}]; 
        const subscribers = await SubscriberModel.getAllActive();
        
        for(const sub of subscribers) {
            const html = generateNewsletterHtml(items, sub.token);
            await emailService.sendNewsletter(sub.email, html);
        }
        
        res.status(200).json({ message: `Newsletter sent to ${subscribers.length} subscribers.` });
    } catch(error) {
        next(error);
    }
});
module.exports = router;
