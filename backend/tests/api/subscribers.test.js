const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock dependencies
const SubscriberService = require('../../src/services/subscriberService');
const subscribersRouter = require('../../src/api/subscribers');

jest.mock('../../src/services/subscriberService');

const app = express();
app.use(bodyParser.json());
app.use('/api/subscribers', subscribersRouter);

describe('Subscriber API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/subscribers', () => {
    it('should return list of subscribers', async () => {
      const mockSubscribers = [{ id: 1, email: 'test@example.com' }];
      SubscriberService.getAllSubscribers.mockResolvedValue(mockSubscribers);

      const res = await request(app).get('/api/subscribers');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockSubscribers);
    });

    it('should handle errors', async () => {
      SubscriberService.getAllSubscribers.mockRejectedValue(new Error('DB Error'));
      
      const res = await request(app).get('/api/subscribers');
      
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'DB Error');
    });
  });

  describe('POST /api/subscribers', () => {
    it('should create a subscriber', async () => {
      const newSub = { name: 'Test', email: 'new@example.com' };
      SubscriberService.createSubscriber.mockResolvedValue({ id: 2, ...newSub });

      const res = await request(app).post('/api/subscribers').send(newSub);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id', 2);
    });

    it('should return 400 if validation fails', async () => {
      SubscriberService.createSubscriber.mockRejectedValue(new Error('Email exists'));
      
      const res = await request(app).post('/api/subscribers').send({ email: 'bad' });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Email exists');
    });
  });
});
