const NewsletterModel = require('../../src/models/newsletterModel');
const db = require('../../src/db');

function runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

describe('Newsletter Model', () => {
    beforeEach(async () => {
        // Seed a source first
        await new Promise((res) => db.run("INSERT OR IGNORE INTO sources (id, name, type, url) VALUES (1, 'Test Source', 'rss', 'http://test.com/rss')", res));
        // Seed some trend items
        await new Promise((res) => db.run("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (1, 1, 'Test 1', 'http://test.com/1', '2026-01-10'), (2, 1, 'Test 2', 'http://test.com/2', '2026-01-11'), (3, 1, 'Test 3', 'http://test.com/3', '2026-01-12')", res));
    });

    afterEach(async () => {
        await new Promise((res) => db.run("DELETE FROM newsletter_items", res));
        await new Promise((res) => db.run("DELETE FROM newsletters", res));
        await new Promise((res) => db.run("DELETE FROM trend_item_tags", res));
        await new Promise((res) => db.run("DELETE FROM trend_items", res));
    });

  it('should create a draft', async () => {
    const itemIds = [1, 2, 3];
    const newsletter = await NewsletterModel.createDraft(itemIds);
    expect(newsletter).toBeDefined();
    expect(newsletter.id).toBeGreaterThan(0);
    expect(newsletter.status).toBe('draft');
  });

  it('should get all newsletters with item counts', async () => {
    // 1. Create a sent newsletter
    await runAsync("INSERT INTO newsletters (id, issue_date, status) VALUES (99, '2026-01-12', 'sent')");
    await runAsync("INSERT INTO newsletter_items (newsletter_id, trend_item_id, display_order) VALUES (99, 1, 0), (99, 2, 1)");

    // 2. Create a draft
    await NewsletterModel.createDraft([3]);
    
    const newsletters = await NewsletterModel.getAll();
    expect(newsletters.length).toBe(2);
    expect(newsletters[0].status).toBe('draft');
    expect(newsletters[0].item_count).toBe(1);
    expect(newsletters[1].status).toBe('sent');
    expect(newsletters[1].item_count).toBe(2);
  });

  it('should update item order', async () => {
    const draft = await NewsletterModel.createDraft([1, 2, 3]);
    // Current order: 1 (0), 2 (1), 3 (2)
    
    const newOrder = [
      { trend_item_id: 3, display_order: 0 },
      { trend_item_id: 1, display_order: 1 },
      { trend_item_id: 2, display_order: 2 }
    ];
    
    await NewsletterModel.updateItemOrder(draft.id, newOrder);
    
    // Check order in DB
    const items = await new Promise((res) => {
      db.all("SELECT trend_item_id, display_order FROM newsletter_items WHERE newsletter_id = ? ORDER BY display_order", [draft.id], (err, rows) => res(rows));
    });
    
    expect(items[0].trend_item_id).toBe(3);
    expect(items[1].trend_item_id).toBe(1);
    expect(items[2].trend_item_id).toBe(2);
  });

  it('should get newsletter by id with new fields', async () => {
    // 1. Manually insert a newsletter with new fields
    await runAsync(
      "INSERT INTO newsletters (id, issue_date, status, subject, introduction_html, conclusion_html) VALUES (?, ?, ?, ?, ?, ?)",
      [101, '2026-01-19', 'draft', 'Test Subject', '<p>Intro</p>', '<p>Outro</p>']
    );
    await runAsync("INSERT INTO newsletter_items (newsletter_id, trend_item_id, display_order) VALUES (101, 1, 0)");

    // 2. Retrieve via model
    const newsletter = await NewsletterModel.getById(101);
    
    expect(newsletter).toBeDefined();
    expect(newsletter.subject).toBe('Test Subject');
    expect(newsletter.introduction_html).toBe('<p>Intro</p>');
    expect(newsletter.conclusion_html).toBe('<p>Outro</p>');
    expect(newsletter.items.length).toBe(1);
  });

  it('should overwrite existing draft when creating a new one', async () => {
    // 1. Create first draft
    const draft1 = await NewsletterModel.createDraft([1, 2]);
    
    // 2. Create second draft
    const draft2 = await NewsletterModel.createDraft([3]);
    
    // 3. Verify only one draft exists and it's the second one
    const newsletters = await new Promise((res) => {
      db.all("SELECT id, status FROM newsletters WHERE status = 'draft'", (err, rows) => res(rows));
    });
    
    expect(newsletters.length).toBe(1);
    expect(newsletters[0].id).toBe(draft2.id);
    
    // 4. Verify items of first draft are gone
    const items1 = await new Promise((res) => {
      db.all("SELECT * FROM newsletter_items WHERE newsletter_id = ?", [draft1.id], (err, rows) => res(rows));
    });
    expect(items1.length).toBe(0);
  });
});