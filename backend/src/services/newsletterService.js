const NewsletterModel = require('../models/newsletterModel');
const AiPresetModel = require('../models/aiPresetModel');
const AiService = require('./aiService');

const aiService = new AiService();

class NewsletterService {
  async createDraft(itemIds) {
    // In a real app, you'd validate the item IDs exist first
    return NewsletterModel.createDraft(itemIds);
  }

  async getAll() {
    return NewsletterModel.getAll();
  }

  async getById(id) {
    return NewsletterModel.getById(id);
  }

  async getActiveDraft() {
    return NewsletterModel.getActiveDraft();
  }

  async updateItemOrder(id, itemOrders) {
    return NewsletterModel.updateItemOrder(id, itemOrders);
  }

  async removeItem(id, trendItemId) {
    return NewsletterModel.removeItem(id, trendItemId);
  }

  async updateDraftContent(id, content) {
    return NewsletterModel.updateDraftContent(id, content);
  }

  async toggleItem(newsletterId, trendItemId) {
    return NewsletterModel.toggleItem(newsletterId, trendItemId);
  }

  async generateAiSubject(newsletterId, presetId) {
    const newsletter = await this.getById(newsletterId);
    if (!newsletter) throw new Error('Newsletter not found');

    const preset = await AiPresetModel.getById(presetId);
    if (!preset) throw new Error('Preset not found');

    return aiService.generateSubject(preset.prompt_template, newsletter.items);
  }

  async clearDraftItems() {
    const draft = await NewsletterModel.getActiveDraft();
    if (!draft) {
      throw new Error('No active draft found');
    }
    await NewsletterModel.clearItems(draft.id);
    return { success: true, message: 'Draft cleared' };
  }

  async confirmAndSendNewsletter(uuid, emailService) {
    const result = await NewsletterModel.confirmAndSend(uuid);
    if (result.error) return result;

    const newsletterId = result.id;
    const newsletter = await NewsletterModel.getById(newsletterId);
    
    // Trigger sending process (async)
    this.processNewsletterSend(newsletter, emailService).catch(err => console.error('Processing error:', err));

    return { id: newsletterId };
  }

  async processNewsletterSend(newsletter, emailService) {
    const { generateNewsletterHtml } = require('../utils/emailTemplate');
    const SubscriberModel = require('../models/subscriberModel');
    
    const subscribers = await SubscriberModel.getAllActive();
    for (const sub of subscribers) {
      const html = generateNewsletterHtml(newsletter, sub.token);
      await emailService.sendNewsletter(sub.email, html);
    }

    await NewsletterModel.updateStatus(newsletter.id, 'sent');
  }
}

module.exports = NewsletterService;
