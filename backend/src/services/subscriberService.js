const Subscriber = require('../models/Subscriber');

class SubscriberService {
  static async getAllSubscribers() {
    const subscribers = await Subscriber.findAll();
    // Enhance with categories
    const results = await Promise.all(subscribers.map(async sub => {
      const categories = await Subscriber.getCategories(sub.id);
      return { ...sub, categories };
    }));
    return results;
  }

  static async getSubscriber(id) {
    const subscriber = await Subscriber.findById(id);
    if (!subscriber) return null;
    const categories = await Subscriber.getCategories(id);
    return { ...subscriber, categories };
  }

  static async createSubscriber({ name, email, categoryIds = [] }) {
    const existing = await Subscriber.findByEmail(email);
    if (existing) {
      throw new Error('Subscriber with this email already exists');
    }

    const subscriber = await Subscriber.create({ name, email });
    
    if (categoryIds.length > 0) {
      await Promise.all(categoryIds.map(presetId => 
        Subscriber.addCategory(subscriber.id, presetId)
      ));
    }

    const categories = await Subscriber.getCategories(subscriber.id);
    return { ...subscriber, categories };
  }

  static async updateSubscriber(id, { name, email, is_subscribed, categoryIds }) {
    const subscriber = await Subscriber.findById(id);
    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    // Check email uniqueness if changing email
    if (email && email !== subscriber.email) {
      const existing = await Subscriber.findByEmail(email);
      if (existing) {
        throw new Error('Email is already in use');
      }
    }

    await Subscriber.update(id, { name, email, is_subscribed });

    if (categoryIds !== undefined) {
      await Subscriber.clearCategories(id);
      await Promise.all(categoryIds.map(presetId => 
        Subscriber.addCategory(id, presetId)
      ));
    }

    return this.getSubscriber(id);
  }

  static async unsubscribe(uuid) {
    const subscriber = await Subscriber.findByUuid(uuid);
    if (!subscriber) {
      throw new Error('Subscriber not found');
    }
    
    await Subscriber.update(subscriber.id, { is_subscribed: false });
    return this.getSubscriber(subscriber.id);
  }

  static async syncSubscribers() {
    console.log('[Sync] Simulating sync with external organization directory...');
    
    // Mock data source simulating external API
    const externalUsers = [
      { email: 'alice@example.com', name: 'Alice Organization' },
      { email: 'bob@example.com', name: 'Bob Enterprise' }
    ];

    let processedCount = 0;

    for (const user of externalUsers) {
      const existing = await Subscriber.findByEmail(user.email);
      if (existing) {
        console.log(`[Sync] Updating existing user: ${user.email}`);
        await Subscriber.update(existing.id, { name: user.name });
      } else {
        console.log(`[Sync] Creating new user: ${user.email}`);
        await Subscriber.create({ name: user.name, email: user.email });
      }
      processedCount++;
    }

    return { message: 'Sync simulation completed', processed: processedCount };
  }
}

module.exports = SubscriberService;
