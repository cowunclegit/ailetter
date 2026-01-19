const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');
const NewsletterModel = require('../../src/models/newsletterModel');

describe('Newsletter AI Subject Recommendation', () => {
  let newsletterId;

  beforeEach(async () => {
    // Clean tables
    await new Promise(res => db.run("DELETE FROM newsletters", res));
    const draft = await NewsletterModel.createDraft([]);
    newsletterId = draft.id;
  });

  it('POST /api/newsletters/:id/ai-recommend-subject should return suggested subject', async () => {
    const res = await request(app)
      .post(`/api/newsletters/${newsletterId}/ai-recommend-subject`)
      .send({ current_subject: 'Original Subject' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.suggested_subject).toBe('Original Subject (AI 추천 제목)');
  });

  it('POST /api/newsletters/:id/ai-recommend-subject should handle missing current_subject', async () => {
    const res = await request(app)
      .post(`/api/newsletters/${newsletterId}/ai-recommend-subject`)
      .send({});
    
    expect(res.statusCode).toBe(200);
    expect(res.body.suggested_subject).toBe('(AI 추천 제목)');
  });
});
