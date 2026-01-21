const CollectionService = require('../../src/services/collectionService');
const SourceModel = require('../../src/models/sourceModel');
const TrendItemModel = require('../../src/models/trendItemModel');
const db = require('../../src/db');

// We want to test the interaction between CollectionService and Models with real DB (in-memory)
describe('Source Deduplication Integration', () => {
  let service;

  beforeEach(async () => {
    service = new CollectionService();
    // Clean DB
    await new Promise(res => db.run("DELETE FROM trend_item_tags", res));
    await new Promise(res => db.run("DELETE FROM trend_items", res));
    await new Promise(res => db.run("DELETE FROM source_categories", res));
    await new Promise(res => db.run("DELETE FROM sources", res));
    await new Promise(res => db.run("DELETE FROM categories", res));

    // Setup categories
    await new Promise(res => db.run("INSERT INTO categories (id, name) VALUES (1, 'AI'), (2, 'Tech')", res));
    
    // Setup two sources with SAME URL
    await SourceModel.create({ name: 'S1', type: 'rss', url: 'http://duplicate.com/rss', categoryIds: [1] });
    await SourceModel.create({ name: 'S2', type: 'rss', url: 'http://duplicate.com/rss', categoryIds: [2] });
  });

  it('should fetch once for duplicate URLs and apply all categories', async () => {
    // Mock fetchRss to return one item and track calls
    const spy = jest.spyOn(service, 'fetchRss').mockResolvedValue([
      { title: 'Duplicate Item', original_url: 'http://duplicate.com/item1', published_at: new Date().toISOString() }
    ]);

    await service.collectAll();

    // Verify fetchRss called only ONCE
    expect(spy).toHaveBeenCalledTimes(1);

    // Verify only ONE trend item created
    const items = await TrendItemModel.getAll();
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Duplicate Item');

    // Verify it has BOTH tags
    expect(items[0].category_ids).toContain(1);
    expect(items[0].category_ids).toContain(2);
    
    spy.mockRestore();
  });
});
