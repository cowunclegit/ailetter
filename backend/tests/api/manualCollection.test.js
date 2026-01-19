const request = require('supertest');
const app = require('../../src/server');
const { collectionService } = require('../../src/jobs/collectionJob');

describe('Manual Collection API', () => {
    
    // Clear locks before each test
    beforeEach(() => {
        collectionService.activeCollections.clear();
    });

    afterEach(() => {
        collectionService.activeCollections.clear();
    });

    it('POST /api/trends/collect should start collection and return 202', async () => {
        // Mock collectionService.collectAll to resolve immediately but we want to check the lock logic
        // The real runCollection is called, which calls collectAll.
        // We can spy on collectAll or just let it run (it might fail if DB/network not mocked, but here we just check the start response)
        // Better to mock collectAll to avoid side effects and make it predictable
        const originalCollectAll = collectionService.collectAll;
        collectionService.collectAll = jest.fn().mockImplementation(async () => {
            // Simulate work
            await new Promise(resolve => setTimeout(resolve, 100));
            return [];
        });

        const res = await request(app).post('/api/trends/collect');
        expect(res.statusCode).toEqual(202);
        expect(res.body.status).toBe('started');
        
        // Restore
        collectionService.collectAll = originalCollectAll;
    });

    it('POST /api/trends/collect should return 409 if already collecting', async () => {
        // Manually set lock
        collectionService.activeCollections.set('auto', true);

        const res = await request(app).post('/api/trends/collect');
        expect(res.statusCode).toEqual(409);
        expect(res.body.error).toContain('already in progress');
    });

    it('GET /api/trends/collect/status should return current status', async () => {
        // 1. Not collecting
        let res = await request(app).get('/api/trends/collect/status');
        expect(res.statusCode).toEqual(200);
        expect(res.body.isCollecting).toBe(false);

        // 2. Collecting
        collectionService.activeCollections.set('auto', true);
        res = await request(app).get('/api/trends/collect/status');
        expect(res.statusCode).toEqual(200);
        expect(res.body.isCollecting).toBe(true);
    });
});
