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
});