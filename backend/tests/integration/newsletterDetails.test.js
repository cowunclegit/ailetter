const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');
const NewsletterModel = require('../../src/models/newsletterModel');

describe('Newsletter Details API', () => {
  let newsletterId;

  beforeEach(async () => {
    // Clean tables
    await new Promise(res => db.run("DELETE FROM newsletter_items", res));
    await new Promise(res => db.run("DELETE FROM newsletters", res));
    await new Promise(res => db.run("DELETE FROM trend_items", res));

    // Seed data
    await new Promise(res => db.run("INSERT OR IGNORE INTO sources (id, name, type, url) VALUES (1, 'Test Source', 'rss', 'http://test.com/rss')", res));
    await new Promise(res => db.run("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (1, 1, 'Article 1', 'http://test.com/1', '2026-01-19')", res));
    
    // Create draft with fields
    await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO newsletters (id, issue_date, status, subject, introduction_html, conclusion_html, template_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [1, '2026-01-19', 'draft', 'Integration Test Subject', '<p>Intro</p>', '<p>Outro</p>', 'classic-list'],
          function(err) {
            if (err) reject(err);
            else {
                newsletterId = this.lastID;
                resolve();
            }
          }
        );
    });
    await new Promise(res => db.run("INSERT INTO newsletter_items (newsletter_id, trend_item_id, display_order) VALUES (1, 1, 0)", res));
  });

  it('GET /api/newsletters/:id returns full details', async () => {
    const res = await request(app).get(`/api/newsletters/${newsletterId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(newsletterId);
    expect(res.body.subject).toBe('Integration Test Subject');
    expect(res.body.status).toBe('draft');
    expect(res.body.introduction_html).toBe('<p>Intro</p>');
    expect(res.body.conclusion_html).toBe('<p>Outro</p>');
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].title).toBe('Article 1');
  });

  it('GET /api/newsletters/:id returns 404 for missing newsletter', async () => {
    const res = await request(app).get('/api/newsletters/999');
    expect(res.statusCode).toBe(404);
  });
});
