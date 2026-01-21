const request = require('supertest');
const app = require('../../src/server');
const TrendItemModel = require('../../src/models/trendItemModel');
const { collectionService } = require('../../src/jobs/collectionJob');
const { activeCollections } = require('../../src/services/collectionState');
const { runCollection } = require('../../src/jobs/collectionJob');

// Mock dependencies
jest.mock('../../src/models/trendItemModel');
jest.mock('../../src/jobs/collectionJob', () => {
  const originalModule = jest.requireActual('../../src/jobs/collectionJob');
  return {
    ...originalModule,
    runCollection: jest.fn().mockResolvedValue(),
  };
});

describe('Trends API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    activeCollections.clear();
  });

  describe('GET /api/trends', () => {
    it('should return paginated trends', async () => {
      TrendItemModel.getAll.mockResolvedValue([]);
      
      const res = await request(app).get('/api/trends?page=1&limit=10');
      
      expect(res.statusCode).toEqual(200);
      expect(TrendItemModel.getAll).toHaveBeenCalledWith(expect.objectContaining({
        limit: 10,
        offset: 0
      }));
    });

    it('should filter by date range', async () => {
      TrendItemModel.getAll.mockResolvedValue([]);
      
      const res = await request(app).get('/api/trends?startDate=2026-01-01&endDate=2026-01-31');
      
      expect(res.statusCode).toEqual(200);
      expect(TrendItemModel.getAll).toHaveBeenCalledWith(expect.objectContaining({
        startDate: '2026-01-01',
        endDate: '2026-01-31'
      }));
    });
  });

  describe('POST /api/trends/collect', () => {
    it('should trigger collection with dates and return 202', async () => {
      const payload = {
        startDate: '2026-01-12T00:00:00Z',
        endDate: '2026-01-18T23:59:59Z'
      };

      const res = await request(app)
        .post('/api/trends/collect')
        .send(payload);
      
      expect(res.statusCode).toEqual(202);
      expect(res.body.status).toEqual('started');
      expect(runCollection).toHaveBeenCalledWith(payload.startDate, payload.endDate);
    });

    it('should return 409 if collection for the week is in progress', async () => {
      const startDate = '2026-01-12T00:00:00Z';
      activeCollections.set(startDate, true);
      
      const res = await request(app)
        .post('/api/trends/collect')
        .send({ startDate });
      
      expect(res.statusCode).toEqual(409);
    });
  });
});