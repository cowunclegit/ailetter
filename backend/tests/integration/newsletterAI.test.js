const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');
const NewsletterModel = require('../../src/models/newsletterModel');
const AiService = require('../../src/services/aiService');

jest.mock('../../src/services/aiService');

describe('Newsletter AI Subject Recommendation', () => {
  let newsletterId;
  let presetId;

  beforeEach(async () => {
    // Clean tables
    await new Promise(res => db.run("DELETE FROM newsletters", res));
    await new Promise(res => db.run("DELETE FROM ai_subject_presets", res));

    // Mock AI Service response
    AiService.prototype.generateSubject.mockResolvedValue('AI Suggested Subject');

    // Seed preset
    await new Promise((res) => db.run("INSERT INTO ai_subject_presets (name, prompt_template) VALUES ('Test', 'Suggest subject for: {{items}}')", function(err) {
      presetId = this.lastID;
      res();
    }));

    const draft = await NewsletterModel.createDraft([]);
    newsletterId = draft.id;
  });

  it('POST /api/newsletters/:id/ai-recommend-subject should return suggested subject', async () => {
    const res = await request(app)
      .post(`/api/newsletters/${newsletterId}/ai-recommend-subject`)
      .send({ preset_id: presetId });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.suggested_subject).toBe('AI Suggested Subject');
  });
});
