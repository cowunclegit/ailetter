const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');
const NewsletterModel = require('../../src/models/newsletterModel');

describe('Newsletter Subject Management', () => {
  let newsletterId;

  beforeEach(async () => {
    // Clean tables
    await new Promise(res => db.run("DELETE FROM newsletter_items", res));
    await new Promise(res => db.run("DELETE FROM newsletters", res));
    
    const draft = await NewsletterModel.createDraft([]);
    newsletterId = draft.id;
  });

  it('PUT /api/newsletters/:id should update the subject', async () => {
    const res = await request(app)
      .put(`/api/newsletters/${newsletterId}`)
      .send({ subject: 'New Email Subject' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const newsletter = await NewsletterModel.getById(newsletterId);
    expect(newsletter.subject).toBe('New Email Subject');
  });

  it('PUT /api/newsletters/:id should update intro and outro too', async () => {
    const res = await request(app)
      .put(`/api/newsletters/${newsletterId}`)
      .send({ 
        introduction_html: '<h1>Intro</h1>',
        conclusion_html: '<p>Outro</p>'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const newsletter = await NewsletterModel.getById(newsletterId);
    expect(newsletter.introduction_html).toBe('<h1>Intro</h1>');
    expect(newsletter.conclusion_html).toBe('<p>Outro</p>');
  });
});
