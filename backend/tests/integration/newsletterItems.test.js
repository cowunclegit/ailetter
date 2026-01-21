const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');
const NewsletterModel = require('../../src/models/newsletterModel');

describe('Newsletter Item Management', () => {
  let newsletterId;

  beforeEach(async () => {
    // Clean tables
    await new Promise(res => db.run("DELETE FROM newsletter_items", res));
    await new Promise(res => db.run("DELETE FROM newsletters", res));
    await new Promise(res => db.run("DELETE FROM trend_items", res));

    // Seed data
    await new Promise(res => db.run("INSERT OR IGNORE INTO sources (id, name, type, url) VALUES (1, 'Test', 'rss', 'u1')", res));
    await new Promise(res => db.run("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (1, 1, 'T1', 'u1/1', '2026-01-19')", res));
    await new Promise(res => db.run("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (2, 1, 'T2', 'u1/2', '2026-01-19')", res));
    
    const draft = await NewsletterModel.createDraft([1, 2]);
    newsletterId = draft.id;
  });

  it('DELETE /api/newsletters/:id/items/:trendItemId should remove an item from the draft', async () => {
    const res = await request(app).delete(`/api/newsletters/${newsletterId}/items/1`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const newsletter = await NewsletterModel.getById(newsletterId);
    expect(newsletter.items.length).toBe(1);
    expect(newsletter.items[0].id).toBe(2);
  });

  it('DELETE /api/newsletters/:id/items/:trendItemId should return 404 for non-existent newsletter', async () => {
    const res = await request(app).delete(`/api/newsletters/999/items/1`);
    expect(res.statusCode).toBe(404);
  });
});
