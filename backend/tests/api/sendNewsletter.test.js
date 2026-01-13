const request = require('supertest');
const app = require('../../src/server');

describe('POST /newsletters/:id/send', () => {
    it('should return a success message', async () => {
        const res = await request(app).post('/api/newsletters/1/send');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toContain('Newsletter sent to');
    });
});