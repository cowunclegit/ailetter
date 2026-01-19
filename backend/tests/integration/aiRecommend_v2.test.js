const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');
const AiService = require('../../src/services/aiService');

jest.mock('../../src/services/aiService');

describe('AI Recommendation v2 (Presets)', () => {
  let newsletterId;
  let presetId;

  beforeEach(async () => {
    jest.clearAllMocks();
    AiService.prototype.generateSubject.mockResolvedValue('Suggested Subject');

    await new Promise(res => db.run("DELETE FROM newsletters", res));
    await new Promise(res => db.run("DELETE FROM ai_subject_presets", res));
    await new Promise(res => db.run("DELETE FROM newsletter_items", res));
    await new Promise(res => db.run("DELETE FROM trend_items", res));

    // Seed preset
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO ai_subject_presets (name, prompt_template) VALUES (?, ?)",
        ['For Developers', 'Suggest a title for: ${contentList}'],
        function(err) {
          if (err) reject(err);
          else {
            presetId = this.lastID;
            resolve();
          }
        }
      );
    });

    // Seed newsletter and items
    await new Promise(res => db.run("INSERT INTO trend_items (id, source_id, title, original_url, published_at) VALUES (1, 1, 'AI Tech', '...', '...')", res));
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO newsletters (id, issue_date, status) VALUES (1, '2026-01-19', 'draft')",
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

  it('POST /api/newsletters/:id/ai-recommend-subject should use preset and content', async () => {
    const res = await request(app)
      .post(`/api/newsletters/${newsletterId}/ai-recommend-subject`)
      .send({ preset_id: presetId });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.suggested_subject).toBe('Suggested Subject');
    expect(AiService.prototype.generateSubject).toHaveBeenCalled();
  });

  it('should return 400 if preset_id is missing', async () => {
    const res = await request(app)
      .post(`/api/newsletters/${newsletterId}/ai-recommend-subject`)
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
