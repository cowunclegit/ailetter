const SubscriberService = require('../../src/services/subscriberService');
const Subscriber = require('../../src/models/Subscriber');
const db = require('../../src/db');

// Mock dependencies
jest.mock('../../src/models/Subscriber');
jest.mock('../../src/db');

describe('SubscriberService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSubscriber', () => {
    it('should create a subscriber successfully', async () => {
      Subscriber.findByEmail.mockResolvedValue(null);
      Subscriber.create.mockResolvedValue({ id: 1, name: 'Test', email: 'test@example.com' });
      Subscriber.getCategories.mockResolvedValue([]);
      
      const result = await SubscriberService.createSubscriber({ name: 'Test', email: 'test@example.com' });
      
      expect(Subscriber.create).toHaveBeenCalledWith({ name: 'Test', email: 'test@example.com' });
      expect(result).toEqual({ id: 1, name: 'Test', email: 'test@example.com', categories: [] });
    });

    it('should throw error if email exists', async () => {
      Subscriber.findByEmail.mockResolvedValue({ id: 1 });
      
      await expect(SubscriberService.createSubscriber({ email: 'exist@example.com' }))
        .rejects.toThrow('Subscriber with this email already exists');
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe user via uuid', async () => {
      Subscriber.findByUuid.mockResolvedValue({ id: 1, is_subscribed: true });
      Subscriber.update.mockResolvedValue({ changes: 1 });
      Subscriber.findById.mockResolvedValue({ id: 1, is_subscribed: false });
      Subscriber.getCategories.mockResolvedValue([]);
      
      const result = await SubscriberService.unsubscribe('some-uuid');
      
      expect(Subscriber.update).toHaveBeenCalledWith(1, { is_subscribed: false });
      expect(result.is_subscribed).toBe(false);
    });

    it('should throw error if uuid invalid', async () => {
      Subscriber.findByUuid.mockResolvedValue(null);
      
      await expect(SubscriberService.unsubscribe('invalid-uuid'))
        .rejects.toThrow('Subscriber not found');
    });
  });
});
