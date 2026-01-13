const CollectionService = require('../../src/services/collectionService');
const SourceModel = require('../../src/models/sourceModel');
const TrendItemModel = require('../../src/models/trendItemModel');

jest.mock('../../src/models/sourceModel');
jest.mock('../../src/models/trendItemModel');

describe('CollectionService Locking', () => {
  let service;

  beforeEach(() => {
    service = new CollectionService();
    SourceModel.getAll.mockResolvedValue([]);
    TrendItemModel.create.mockResolvedValue({ id: 1 });
  });

  it('should allow concurrent collection for different weeks', async () => {
    const week1Start = '2026-01-05T00:00:00Z';
    const week2Start = '2026-01-12T00:00:00Z';

    // Mock fetchRss to take some time
    service.fetchRss = jest.fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return [];
    });

    const promise1 = service.collectAll(week1Start, '2026-01-11T23:59:59Z');
    const promise2 = service.collectAll(week2Start, '2026-01-18T23:59:59Z');

    expect(service.activeCollections.has(week1Start)).toBeTruthy();
    expect(service.activeCollections.has(week2Start)).toBeTruthy();

    await Promise.all([promise1, promise2]);

    expect(service.activeCollections.has(week1Start)).toBeFalsy();
    expect(service.activeCollections.has(week2Start)).toBeFalsy();
  });

  it('should prevent concurrent collection for the same week', async () => {
    const weekStart = '2026-01-05T00:00:00Z';

    service.fetchRss = jest.fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return [];
    });

    const promise1 = service.collectAll(weekStart, '2026-01-11T23:59:59Z');
    const promise2 = service.collectAll(weekStart, '2026-01-11T23:59:59Z');

    const result2 = await promise2;
    expect(result2).toBeNull(); // Should be skipped

    await promise1;
  });
});
