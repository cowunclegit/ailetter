const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');
const NewsletterModel = require('../../src/models/newsletterModel');

describe('Newsletter Content Management (Intro/Outro)', () => {
  let newsletterId;

  beforeEach(async () => {
    // Clean tables
    await new Promise(res => db.run("DELETE FROM newsletters", res));
    const draft = await NewsletterModel.createDraft([]);
    newsletterId = draft.id;
  });

  it('PUT /api/newsletters/:id should save introduction and conclusion HTML', async () => {
    const content = {
      introduction_html: '<section><h2>Welcome</h2><p>This is the intro</p></section>',
      conclusion_html: '<footer><p>Goodbye</p></footer>'
    };

    const res = await request(app)
      .put(`/api/newsletters/${newsletterId}`)
      .send(content);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const newsletter = await NewsletterModel.getById(newsletterId);
    expect(newsletter.introduction_html).toBe(content.introduction_html);
    expect(newsletter.conclusion_html).toBe(content.conclusion_html);
  });
});
