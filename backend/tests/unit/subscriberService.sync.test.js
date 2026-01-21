const SubscriberService = require('../../src/services/subscriberService');
const Subscriber = require('../../src/models/Subscriber');

jest.mock('../../src/models/Subscriber');

describe('SubscriberService Sync', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('syncSubscribers', () => {
    it('should sync subscribers (simulate external source)', async () => {
      // Mock findByEmail to return null for first user (create) and object for second (update)
      Subscriber.findByEmail.mockImplementation((email) => {
        if (email === 'alice@example.com') return Promise.resolve({ id: 1, email });
        return Promise.resolve(null); // bob
      });

      Subscriber.create.mockResolvedValue({ id: 2 });
      Subscriber.update.mockResolvedValue({ changes: 1 });

      const result = await SubscriberService.syncSubscribers();

      expect(Subscriber.findByEmail).toHaveBeenCalledTimes(2);
      expect(Subscriber.update).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Alice Organization' }));
      expect(Subscriber.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'bob@example.com' }));
      
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('processed', 2);
    });
  });
});
