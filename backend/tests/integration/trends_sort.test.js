const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');

describe('Trends Sorting Integration', () => {
    beforeEach(async () => {
        // Cleanup and Setup
        await new Promise((res) => db.run("DELETE FROM newsletter_items", res));
        await new Promise((res) => db.run("DELETE FROM newsletters", res));
        await new Promise((res) => db.run("DELETE FROM trend_item_tags", res));
        await new Promise((res) => db.run("DELETE FROM trend_items", res));
        await new Promise((res) => db.run("INSERT OR IGNORE INTO sources (id, name, type, url) VALUES (1, 'Test', 'rss', 'http://test.com')", res));
    });

    it('GET /api/trends returns items in descending chronological order', async () => {
        // Insert items with specific timestamps
        await new Promise((res) => db.run(`
            INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES 
            (301, 1, 'Older', 'u301', '2026-01-18T08:00:00Z'),
            (302, 1, 'Newer', 'u302', '2026-01-18T10:00:00Z'),
            (303, 1, 'Middle', 'u303', '2026-01-18T09:00:00Z')
        `, res));

        const res = await request(app).get('/api/trends?startDate=2026-01-18T00:00:00Z');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body[0].id).toBe(302); // 10:00
        expect(res.body[1].id).toBe(303); // 09:00
        expect(res.body[2].id).toBe(301); // 08:00
    });
});
