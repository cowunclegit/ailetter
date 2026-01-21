const request = require('supertest');
const app = require('../../src/server');
const { collectionService } = require('../../src/jobs/collectionJob');
const { activeCollections } = require('../../src/services/collectionState');
const AiService = require('../../src/services/aiService');

jest.mock('../../src/services/aiService');

describe('Manual Collection API', () => {
    // Clear locks before each test
    beforeEach(() => {
        activeCollections.clear();
    });

    afterEach(() => {
        activeCollections.clear();
    });

    it('POST /api/trends/collect should start collection and return 202', async () => {
        // Mock success
        collectionService.collectAll = jest.fn().mockResolvedValue([]);
        
        const res = await request(app)
            .post('/api/trends/collect')
            .send();
            
        expect(res.status).toBe(202);
        expect(res.body).toHaveProperty('status', 'started');
    });

    it('POST /api/trends/collect should return 409 if already collecting', async () => {
        // Simulate lock
        activeCollections.set('auto', true);
        
        const res = await request(app)
            .post('/api/trends/collect')
            .send();
            
        expect(res.status).toBe(409);
    });

    it('GET /api/trends/collect/status should return current status', async () => {
        const res = await request(app).get('/api/trends/collect/status');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('isCollecting', false);
        
        activeCollections.set('auto', true);
        const res2 = await request(app).get('/api/trends/collect/status');
        expect(res2.body).toHaveProperty('isCollecting', true);
    });
});
