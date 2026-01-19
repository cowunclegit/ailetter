const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');

describe('AI Presets API', () => {
  beforeEach(async () => {
    await new Promise(res => db.run("DELETE FROM ai_subject_presets", res));
  });

  it('GET /api/ai-presets should return list of presets', async () => {
    await new Promise(res => db.run("INSERT INTO ai_subject_presets (name, prompt_template) VALUES ('Test', '...')", res));
    const res = await request(app).get('/api/ai-presets');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('POST /api/ai-presets should create a new preset', async () => {
    const data = { name: 'New Preset', prompt_template: '...' };
    const res = await request(app).post('/api/ai-presets').send(data);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(data.name);
  });

  it('PUT /api/ai-presets/:id should update a preset', async () => {
    await new Promise(res => db.run("INSERT INTO ai_subject_presets (id, name, prompt_template) VALUES (1, 'Old', '...')", res));
    const res = await request(app).put('/api/ai-presets/1').send({ name: 'New', prompt_template: 'Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('DELETE /api/ai-presets/:id should delete a non-default preset', async () => {
    await new Promise(res => db.run("INSERT INTO ai_subject_presets (id, name, prompt_template, is_default) VALUES (1, 'Non-Default', '...', 0)", res));
    const res = await request(app).delete('/api/ai-presets/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('DELETE /api/ai-presets/:id should NOT delete a default preset', async () => {
    await new Promise(res => db.run("INSERT INTO ai_subject_presets (id, name, prompt_template, is_default) VALUES (1, 'Default', '...', 1)", res));
    const res = await request(app).delete('/api/ai-presets/1');
    expect(res.statusCode).toBe(403);
  });
});
