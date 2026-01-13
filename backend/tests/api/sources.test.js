const request = require('supertest');
const app = require('../../src/server');

describe('Sources API', () => {
    it('should get all sources', async () => {
        const res = await request(app).get('/api/sources');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create a new source', async () => {
        const res = await request(app)
            .post('/api/sources')
            .send({ name: 'Test Source', url: 'http://test.com/rss', type: 'rss' });
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toBe('Test Source');
    });

    it('should delete a source', async () => {
        const postRes = await request(app)
            .post('/api/sources')
            .send({ name: 'To Delete', url: 'http://delete.com/rss', type: 'rss' });
        
        const delRes = await request(app).delete(`/api/sources/${postRes.body.id}`);
        expect(delRes.statusCode).toEqual(204);
    });
});
