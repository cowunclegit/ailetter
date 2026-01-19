const TrendItemModel = require('../../src/models/trendItemModel');
const db = require('../../src/db');

describe('TrendItem Model Status', () => {
    beforeEach(async () => {
        // Setup sources first due to FK
        await new Promise((res) => db.run("INSERT OR IGNORE INTO sources (id, name, type, url) VALUES (1, 'Test', 'rss', 'http://test.com')", res));
        await new Promise((res) => db.run("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (1, 1, 'Trend Sent', 'http://sent.com', '2026-01-10'), (2, 1, 'Trend Draft', 'http://draft.com', '2026-01-11'), (3, 1, 'Trend Both', 'http://both.com', '2026-01-12'), (4, 1, 'Trend Available', 'http://avail.com', '2026-01-13')", res));
    });

    afterEach(async () => {
        await new Promise((res) => db.run("DELETE FROM newsletter_items", res));
        await new Promise((res) => db.run("DELETE FROM newsletters", res));
        await new Promise((res) => db.run("DELETE FROM trend_item_tags", res));
        await new Promise((res) => db.run("DELETE FROM trend_items", res));
    });

    it('returns correct status for each trend item', async () => {
        // 1. Setup newsletters
        // Newsletter 1: Sent, contains Trend 1 and Trend 3
        // Newsletter 2: Draft, contains Trend 2 and Trend 3
        await new Promise((res) => db.run("INSERT INTO newsletters (id, issue_date, status) VALUES (1, '2026-01-12', 'sent'), (2, '2026-01-13', 'draft')", res));
        await new Promise((res) => db.run("INSERT INTO newsletter_items (newsletter_id, trend_item_id, display_order) VALUES (1, 1, 0), (1, 3, 1), (2, 2, 0), (2, 3, 1)", res));

        // 2. Fetch trends
        const trends = await TrendItemModel.getAll();
        
        const trendSent = trends.find(t => t.id === 1);
        const trendDraft = trends.find(t => t.id === 2);
        const trendBoth = trends.find(t => t.id === 3);
        const trendAvail = trends.find(t => t.id === 4);

        expect(trendSent.status).toBe('sent');
        expect(trendDraft.status).toBe('draft');
        expect(trendBoth.status).toBe('sent'); // Precedence: Sent over Draft
        expect(trendAvail.status).toBe('available');
    });

    it('filters by default 28-day range if no dates provided', async () => {
        // This is a bit tricky to test with static data unless we control the "now" in the model
        // For now, let's just check that it handles the startDate/endDate correctly as it did before
        // but verify the new 4-week default logic if we can mock Date.
        
        // Let's insert an old trend
        await new Promise((res) => db.run("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (99, 1, 'Old Trend', 'http://old.com', '2025-01-01')", res));
        
        const trends = await TrendItemModel.getAll();
        expect(trends.find(t => t.id === 99)).toBeUndefined(); // Should be filtered out by 28-day default
    });

    it('supports pagination with limit and offset', async () => {
        // Insert enough items to test pagination
        await new Promise((res) => db.run(`
            INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES 
            (101, 1, 'T1', 'u1', '2026-01-18T10:00:00Z'),
            (102, 1, 'T2', 'u2', '2026-01-18T09:00:00Z'),
            (103, 1, 'T3', 'u3', '2026-01-18T08:00:00Z'),
            (104, 1, 'T4', 'u4', '2026-01-18T07:00:00Z'),
            (105, 1, 'T5', 'u5', '2026-01-18T06:00:00Z')
        `, res));

        const page1 = await TrendItemModel.getAll({ limit: 2, offset: 0, startDate: '2026-01-15' });
        expect(page1).toHaveLength(2);
        expect(page1[0].id).toBe(101); // Most recent due to ORDER BY published_at DESC

        const page2 = await TrendItemModel.getAll({ limit: 2, offset: 2, startDate: '2026-01-15' });
        expect(page2).toHaveLength(2);
        expect(page2[0].id).toBe(103);
        
        const page3 = await TrendItemModel.getAll({ limit: 2, offset: 4, startDate: '2026-01-15' });
        expect(page3).toHaveLength(1);
        expect(page3[0].id).toBe(105);
    });

    describe('Tagging and Filtering', () => {
        beforeEach(async () => {
            await new Promise((res) => db.run("INSERT OR IGNORE INTO categories (id, name) VALUES (1, 'AI'), (2, 'Tech')", res));
        });

        it('creates a trend item with tags', async () => {
            const item = {
                source_id: 1,
                title: 'Tagged Trend',
                original_url: 'http://tagged.com',
                published_at: '2026-01-18T12:00:00Z',
                categoryIds: [1, 2]
            };
            const saved = await TrendItemModel.create(item);
            expect(saved.id).toBeDefined();

            const tags = await new Promise((res) => db.all("SELECT category_id FROM trend_item_tags WHERE trend_item_id = ?", [saved.id], (err, rows) => res(rows)));
            expect(tags.map(t => t.category_id)).toContain(1);
            expect(tags.map(t => t.category_id)).toContain(2);
        });

        it('filters trend items by categoryIds', async () => {
            await new Promise((res) => db.run("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (50, 1, 'AI Trend', 'u50', '2026-01-18'), (51, 1, 'Tech Trend', 'u51', '2026-01-18')", res));
            await new Promise((res) => db.run("INSERT INTO trend_item_tags (trend_item_id, category_id) VALUES (50, 1), (51, 2)", res));

            const aiTrends = await TrendItemModel.getAll({ categoryIds: [1] });
            expect(aiTrends.some(t => t.id === 50)).toBe(true);
            expect(aiTrends.some(t => t.id === 51)).toBe(false);

            const bothTrends = await TrendItemModel.getAll({ categoryIds: [1, 2] });
            expect(bothTrends.some(t => t.id === 50)).toBe(true);
            expect(bothTrends.some(t => t.id === 51)).toBe(true);
        });
    });
});