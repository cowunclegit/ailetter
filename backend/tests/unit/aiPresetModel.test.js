const AiPresetModel = require('../../src/models/aiPresetModel');
const db = require('../../src/db');

describe('AiPreset Model', () => {
  beforeEach(async () => {
    await new Promise(res => db.run("DELETE FROM ai_subject_presets", res));
  });

  it('should create and retrieve a preset', async () => {
    const data = { name: 'Test Preset', prompt_template: 'Prompt with ${contentList}', is_default: 0 };
    const created = await AiPresetModel.create(data);
    expect(created.id).toBeDefined();
    
    const fetched = await AiPresetModel.getById(created.id);
    expect(fetched.name).toBe(data.name);
    expect(fetched.prompt_template).toBe(data.prompt_template);
  });

  it('should update a preset', async () => {
    const created = await AiPresetModel.create({ name: 'Old Name', prompt_template: 'Old Prompt' });
    const updateData = { name: 'New Name', prompt_template: 'New Prompt' };
    const success = await AiPresetModel.update(created.id, updateData);
    expect(success).toBe(true);

    const fetched = await AiPresetModel.getById(created.id);
    expect(fetched.name).toBe(updateData.name);
    expect(fetched.prompt_template).toBe(updateData.prompt_template);
  });

  it('should delete a non-default preset', async () => {
    const created = await AiPresetModel.create({ name: 'Delete Me', prompt_template: '...', is_default: 0 });
    const success = await AiPresetModel.delete(created.id);
    expect(success).toBe(true);

    const fetched = await AiPresetModel.getById(created.id);
    expect(fetched).toBeUndefined();
  });

  it('should NOT delete a default preset', async () => {
    const created = await AiPresetModel.create({ name: 'System Default', prompt_template: '...', is_default: 1 });
    const success = await AiPresetModel.delete(created.id);
    expect(success).toBe(false);

    const fetched = await AiPresetModel.getById(created.id);
    expect(fetched).toBeDefined();
  });

  it('should list all presets ordered by date', async () => {
    await AiPresetModel.create({ name: 'Preset 1', prompt_template: '1' });
    await new Promise(res => setTimeout(res, 100)); // Ensure different timestamp if needed
    await AiPresetModel.create({ name: 'Preset 2', prompt_template: '2' });

    const all = await AiPresetModel.getAll();
    expect(all.length).toBe(2);
    expect(all[0].name).toBe('Preset 2'); // DESC order
  });
});
