const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');

function runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

describe('POST /newsletters', () => {
    beforeEach(async () => {
        // Seed some trend items
        await runAsync("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (101, 1, 'Test Trend', 'http://test.com/101', '2026-01-10')");
    });

    afterEach(async () => {
        await runAsync("DELETE FROM newsletter_items");
        await runAsync("DELETE FROM newsletters");
        await runAsync("DELETE FROM trend_items");
    });

  it('should create a newsletter draft successfully', async () => {
    const res = await request(app)
      .post('/api/newsletters')
      .send({ item_ids: [101] });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe('draft');
  });

  it('should overwrite existing draft when creating a new one', async () => {
    // 1. Create first draft
    await request(app)
      .post('/api/newsletters')
      .send({ item_ids: [101] });
    
    // 2. Create second draft
    await request(app)
      .post('/api/newsletters')
      .send({ item_ids: [101] });
    
    // 3. Verify only one draft exists
    const rows = await new Promise((resolve) => {
      db.all("SELECT id FROM newsletters WHERE status = 'draft'", (err, rows) => resolve(rows));
    });
    expect(rows.length).toBe(1);
  });

  it('should fail with invalid item IDs', async () => {
    const res = await request(app)
      .post('/api/newsletters')
      .send({ item_ids: [999] }); // Non-existent ID
      
    expect(res.statusCode).toEqual(400);
  });
});

describe('PUT /newsletters/:id/reorder', () => {
  beforeEach(async () => {
    await runAsync("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (1, 1, 'T1', 'http://t1.com', '2026-01-10'), (2, 1, 'T2', 'http://t2.com', '2026-01-11')");
  });

  afterEach(async () => {
    await runAsync("DELETE FROM newsletter_items");
    await runAsync("DELETE FROM newsletters");
    await runAsync("DELETE FROM trend_items");
  });

  it('should update item order successfully', async () => {
    const createRes = await request(app)
      .post('/api/newsletters')
      .send({ item_ids: [1, 2] });
    
    const newsletterId = createRes.body.id;
    
    const reorderRes = await request(app)
      .put(`/api/newsletters/${newsletterId}/reorder`)
      .send({
        item_orders: [
          { trend_item_id: 2, display_order: 0 },
          { trend_item_id: 1, display_order: 1 }
        ]
      });
    
    expect(reorderRes.statusCode).toEqual(200);
    
    // Verify via GET
    const getRes = await request(app).get(`/api/newsletters/${newsletterId}`);
    expect(getRes.body.items[0].id).toBe(2);
    expect(getRes.body.items[1].id).toBe(1);
  });
});

describe('POST /newsletters/:id/send-test', () => {
  it('should send a test email and return success', async () => {
    // 1. Create a draft
    await runAsync("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (501, 1, 'T501', 'http://t501.com', '2026-01-10')");
    const createRes = await request(app)
      .post('/api/newsletters')
      .send({ item_ids: [501] });
    
    const newsletterId = createRes.body.id;
    
    // 2. Send test mail
    const res = await request(app)
      .post(`/api/newsletters/${newsletterId}/send-test`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('Test mail sent successfully');
    
    // 3. Verify UUID was generated in DB
    const newsletter = await new Promise((res) => {
      db.get("SELECT confirmation_uuid FROM newsletters WHERE id = ?", [newsletterId], (err, row) => res(row));
    });
    expect(newsletter.confirmation_uuid).toBeDefined();
    expect(newsletter.confirmation_uuid.length).toBeGreaterThan(0);
  });
});

describe('GET /newsletters/confirm/:uuid', () => {
  it('should trigger send and redirect on success', async () => {
    // 1. Create a draft with UUID
    const trend = await runAsync("INSERT INTO trend_items (source_id, title, original_url, published_at) VALUES (1, 'T-CONFIRM', 'http://t-confirm.com', '2026-01-10')");
    const trendId = trend.lastID;
    
    await runAsync("INSERT INTO newsletters (id, issue_date, status, confirmation_uuid) VALUES (10, '2026-01-13', 'draft', 'test-uuid-123')");
    await runAsync("INSERT INTO newsletter_items (newsletter_id, trend_item_id, display_order) VALUES (10, ?, 0)", [trendId]);

    // 2. Call confirm
    const res = await request(app).get('/api/newsletters/confirm/test-uuid-123');
    
    expect(res.statusCode).toEqual(302);
    expect(res.header.location).toContain('confirmation-success');
    
    // 3. Verify status changed to sending
    const newsletter = await new Promise((res) => {
      db.get("SELECT status FROM newsletters WHERE id = 10", (err, row) => res(row));
    });
    expect(newsletter.status).toBe('sending');
  });

  it('should fail if UUID is invalid', async () => {
    const res = await request(app).get('/api/newsletters/confirm/invalid-uuid');
    expect(res.statusCode).toEqual(302);
    expect(res.header.location).toContain('confirmation-failed?reason=invalid');
  });
});

describe('GET /newsletters/active-draft', () => {
  it('should return the active draft if it exists', async () => {
    // 1. Create a draft
    await runAsync("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (201, 1, 'T201', 'http://t201.com', '2026-01-10')");
    await request(app)
      .post('/api/newsletters')
      .send({ item_ids: [201] });
    
    // 2. Get active draft
    const res = await request(app).get('/api/newsletters/active-draft');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('draft');
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].id).toBe(201);
  });

  it('should return null if no active draft exists', async () => {
    // Ensure no draft exists
    await runAsync("DELETE FROM newsletter_items");
    await runAsync("DELETE FROM newsletters WHERE status = 'draft'");
    
    const res = await request(app).get('/api/newsletters/active-draft');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeNull();
  });
});

describe('POST /newsletters/active-draft/toggle-item', () => {
  beforeEach(async () => {
    await runAsync("DELETE FROM trend_items");
    await runAsync("DELETE FROM newsletters");
    await runAsync("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (301, 1, 'T301', 'http://t301.com', '2026-01-10')");
    await runAsync("INSERT INTO newsletters (id, issue_date, status) VALUES (30, '2026-01-13', 'draft')");
  });

  it('should add item to draft if not present', async () => {
    const res = await request(app)
      .post('/api/newsletters/active-draft/toggle-item')
      .send({ item_id: 301 });
    
    expect(res.statusCode).toEqual(200);
    
    // Verify in DB
    const row = await new Promise((res) => {
      db.get("SELECT * FROM newsletter_items WHERE newsletter_id = 30 AND trend_item_id = 301", (err, row) => res(row));
    });
    expect(row).toBeDefined();
  });

  it('should remove item from draft if already present', async () => {
    await runAsync("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (302, 1, 'T302', 'http://t302.com', '2026-01-10')");
    // 1. Add item first
    await runAsync("INSERT INTO newsletter_items (newsletter_id, trend_item_id, display_order) VALUES (30, 302, 0)");
    
    // 2. Toggle (should remove)
    const res = await request(app)
      .post('/api/newsletters/active-draft/toggle-item')
      .send({ item_id: 302 });
    
    expect(res.statusCode).toEqual(200);
    
    // Verify gone from DB
    const row = await new Promise((res) => {
      db.get("SELECT * FROM newsletter_items WHERE newsletter_id = 30 AND trend_item_id = 302", (err, row) => res(row));
    });
    expect(row).toBeUndefined();
  });

  it('should return 404 if no active draft exists', async () => {
    await runAsync("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (303, 1, 'T303', 'http://t303.com', '2026-01-10')");
    await runAsync("DELETE FROM newsletters WHERE status = 'draft'");
    const res = await request(app)
      .post('/api/newsletters/active-draft/toggle-item')
      .send({ item_id: 303 });
    expect(res.statusCode).toEqual(404);
  });
});