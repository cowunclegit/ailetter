const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');
const NewsletterModel = require('../../src/models/newsletterModel');

describe('Newsletter Confirmation Workflow', () => {
  let newsletterId;
  const testUuid = 'test-uuid-016';

  beforeEach(async () => {
    // Clean tables
    await new Promise(res => db.run("DELETE FROM newsletter_items", res));
    await new Promise(res => db.run("DELETE FROM newsletters", res));
    await new Promise(res => db.run("DELETE FROM trend_item_tags", res));
    await new Promise(res => db.run("DELETE FROM trend_items", res));
    await new Promise(res => db.run("DELETE FROM subscribers", res));

    // Seed data
    await new Promise(res => db.run("INSERT INTO sources (id, name, type, url) VALUES (1, 'Test', 'rss', 'u1')", res));
    await new Promise(res => db.run("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (1, 1, 'T1', 'u1/1', '2026-01-19')", res));
    
    const draft = await NewsletterModel.createDraft([1]);
    newsletterId = draft.id;
    await NewsletterModel.updateConfirmationUuid(newsletterId, testUuid);
  });

  it('GET /api/newsletters/confirm/:uuid redirects to success on valid UUID', async () => {
    const res = await request(app).get(`/api/newsletters/confirm/${testUuid}`);
    
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toContain('confirmation-success');

    // Status should be advanced
    const newsletter = await NewsletterModel.getById(newsletterId);
    // Note: status changes to 'sending' immediately in confirmAndSend, 
    // then 'sent' after processNewsletterSend completes.
    // Since it's async, it might be either depending on speed.
    expect(['sending', 'sent']).toContain(newsletter.status);
  });

  it('GET /api/newsletters/confirm/:uuid redirects to failure on invalid UUID', async () => {
    const res = await request(app).get(`/api/newsletters/confirm/invalid-uuid`);
    
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toContain('confirmation-failed?reason=invalid');
  });

  it('GET /api/newsletters/confirm/:uuid prevents double confirmation', async () => {
    // First confirmation
    await request(app).get(`/api/newsletters/confirm/${testUuid}`);
    
    // Second confirmation
    const res = await request(app).get(`/api/newsletters/confirm/${testUuid}`);
    
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toContain('confirmation-failed?reason=processed');
  });

  it('GET /api/newsletters/confirm/:uuid handles concurrent requests gracefully', async () => {
    // Send multiple requests simultaneously
    const results = await Promise.all([
      request(app).get(`/api/newsletters/confirm/${testUuid}`),
      request(app).get(`/api/newsletters/confirm/${testUuid}`),
      request(app).get(`/api/newsletters/confirm/${testUuid}`)
    ]);

    const successes = results.filter(r => r.statusCode === 302 && r.header.location.includes('confirmation-success'));
    const processedErrors = results.filter(r => r.statusCode === 302 && r.header.location.includes('reason=processed'));

    // Only ONE should succeed
    expect(successes).toHaveLength(1);
    // Others should fail with 'processed' (due to transaction and status check)
    expect(processedErrors).toHaveLength(2);
  });
});
