const TrendItemModel = require('../../src/models/trendItemModel');
const db = require('../../src/db');

describe('TrendItem Sorting Performance', () => {
    beforeAll(async () => {
        // Setup sources
        await new Promise((res) => db.run("INSERT OR IGNORE INTO sources (id, name, type, url) VALUES (1, 'Test', 'rss', 'http://test.com')", res));
        
        // Insert 1000 items
        console.log('Inserting 1000 items for performance test...');
        await new Promise((res) => db.run('BEGIN TRANSACTION', res));
        for (let i = 0; i < 1000; i++) {
            const date = new Date(Date.now() - i * 60000).toISOString();
            await new Promise((res) => db.run(
                'INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (?, ?, ?, ?, ?)',
                [1000 + i, 1, `Trend ${i}`, `http://perf.com/${i}`, date],
                res
            ));
        }
        await new Promise((res) => db.run('COMMIT', res));
    });

    afterAll(async () => {
        await new Promise((res) => db.run("DELETE FROM trend_items WHERE id >= 1000", res));
    });

    it('retrieves sorted trends in under 500ms', async () => {
        const start = Date.now();
        const trends = await TrendItemModel.getAll({ limit: 100, startDate: '2020-01-01' });
        const end = Date.now();
        
        const duration = end - start;
        console.log(`Retrieved 100 sorted items in ${duration}ms`);
        
        expect(duration).toBeLessThan(500);
        expect(trends).toHaveLength(100);
        // Verify order
        for (let i = 0; i < trends.length - 1; i++) {
            const dateA = new Date(trends[i].published_at);
            const dateB = new Date(trends[i+1].published_at);
            expect(dateA.getTime()).toBeGreaterThanOrEqual(dateB.getTime());
        }
    });
});
