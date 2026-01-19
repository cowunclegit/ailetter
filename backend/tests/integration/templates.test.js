const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');
const NewsletterModel = require('../../src/models/newsletterModel');

describe('Template API Integration', () => {
  let newsletterId;

  beforeEach(async () => {
    // Clean tables
    await new Promise(res => db.run("DELETE FROM newsletter_items", res));
    await new Promise(res => db.run("DELETE FROM newsletters", res));
    
    const draft = await NewsletterModel.createDraft([]);
    newsletterId = draft.id;
  });

  it('GET /api/templates should return all 11 templates', async () => {
    const res = await request(app).get('/api/templates');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(11);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('thumbnail_url');
  });

  it('PUT /api/newsletters/:id should update template_id', async () => {
    const res = await request(app)
      .put(`/api/newsletters/${newsletterId}`)
      .send({ template_id: 'modern-grid' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const newsletter = await NewsletterModel.getById(newsletterId);
    expect(newsletter.template_id).toBe('modern-grid');
  });

  it('PUT /api/newsletters/:id should default to classic-list for invalid template_id', async () => {
    // This depends on implementation, but let's assume we validate it
    await request(app)
      .put(`/api/newsletters/${newsletterId}`)
      .send({ template_id: 'invalid-id' });
    
    const newsletter = await NewsletterModel.getById(newsletterId);
    // If our model or service handles fallback
    expect(newsletter.template_id).toBe('classic-list');
  });
});
