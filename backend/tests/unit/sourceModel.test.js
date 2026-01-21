const SourceModel = require('../../src/models/sourceModel');
const db = require('../../src/db');

describe('SourceModel', () => {
  beforeEach(async () => {
    await new Promise((resolve) => db.run('DELETE FROM source_categories', resolve));
    await new Promise((resolve) => db.run('DELETE FROM sources', resolve));
    await new Promise((resolve) => db.run('DELETE FROM categories', resolve));
    
    // Setup some categories
    await new Promise((resolve) => db.run("INSERT INTO categories (id, name) VALUES (1, 'AI'), (2, 'Tech')", resolve));
  });

  it('creates a source with multiple categories', async () => {
    const sourceData = {
      name: 'Test Source',
      type: 'rss',
      url: 'http://test.com/rss',
      categoryIds: [1, 2]
    };
    
    const source = await SourceModel.create(sourceData);
    expect(source.id).toBeDefined();
    
    // Check junction table
    const mappings = await new Promise((resolve) => 
      db.all('SELECT category_id FROM source_categories WHERE source_id = ?', [source.id], (err, rows) => resolve(rows))
    );
    expect(mappings.map(m => m.category_id)).toContain(1);
    expect(mappings.map(m => m.category_id)).toContain(2);
  });

  it('retrieves sources with their categories', async () => {
    await new Promise((resolve) => 
      db.run("INSERT INTO sources (id, name, type, url) VALUES (10, 'S1', 'rss', 'u1')", resolve)
    );
    await new Promise((resolve) => 
      db.run("INSERT INTO source_categories (source_id, category_id) VALUES (10, 1), (10, 2)", resolve)
    );
    
    const sources = await SourceModel.getAll();
    const s1 = sources.find(s => s.id === 10);
    expect(s1.category_names).toContain('AI');
    expect(s1.category_names).toContain('Tech');
  });

  it('updates a source categories', async () => {
    await new Promise((resolve) => 
      db.run("INSERT INTO sources (id, name, type, url) VALUES (20, 'S2', 'rss', 'u2')", resolve)
    );
    await new Promise((resolve) => 
      db.run("INSERT INTO source_categories (source_id, category_id) VALUES (20, 1)", resolve)
    );
    
    await SourceModel.update(20, { categoryIds: [2] });
    
    const mappings = await new Promise((resolve) => 
      db.all('SELECT category_id FROM source_categories WHERE source_id = ?', [20], (err, rows) => resolve(rows))
    );
    expect(mappings).toHaveLength(1);
    expect(mappings[0].category_id).toBe(2);
  });
});
