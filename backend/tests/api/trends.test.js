const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');
const { runCollection, collectionService } = require('../../src/jobs/collectionJob');

jest.mock('../../src/jobs/collectionJob', () => {
  const originalModule = jest.requireActual('../../src/jobs/collectionJob');
  return {
    ...originalModule,
    runCollection: jest.fn().mockResolvedValue(),
  };
});

describe('GET /trends', () => {
  it('should return a list of trends', async () => {
    const res = await request(app).get('/api/trends');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should support date filtering', async () => {
    const res = await request(app).get('/api/trends?startDate=2026-01-01&endDate=2026-01-31');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should only return trends within the specific week range', async () => {
    // Insert source and test data
    await new Promise((resolve) => {
      db.run('INSERT INTO sources (name, type, url) VALUES (?, ?, ?)', ['Test Source', 'rss', 'http://test.com'], function() {
        const sourceId = this.lastID;
        db.run('INSERT INTO trend_items (source_id, title, published_at, original_url) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
          [sourceId, 'In Range', '2026-01-15T12:00:00Z', 'http://ok.com', sourceId, 'Out of Range', '2026-02-15T12:00:00Z', 'http://bad.com'],
          resolve
        );
      });
    });

    const res = await request(app).get('/api/trends?startDate=2026-01-12T00:00:00Z&endDate=2026-01-18T23:59:59Z');
    expect(res.statusCode).toEqual(200);
    const titles = res.body.map(t => t.title);
    expect(titles).toContain('In Range');
    expect(titles).not.toContain('Out of Range');
  });

  it('should return 28-day trends with status by default', async () => {
    // Insert source and test data
    await new Promise((resolve) => {
      db.run('INSERT INTO sources (name, type, url) VALUES (?, ?, ?)', ['Test Source', 'rss', 'http://test2.com'], function() {
        const sourceId = this.lastID;
        const now = new Date();
        const recent = new Date(now.setDate(now.getDate() - 1)).toISOString();
        const old = '2020-01-01T00:00:00Z';
        db.run('INSERT INTO trend_items (source_id, title, published_at, original_url) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
          [sourceId, 'Recent Trend', recent, 'http://recent.com', sourceId, 'Old Trend', old, 'http://old.com'],
          resolve
        );
      });
    });

    const res = await request(app).get('/api/trends');
    expect(res.statusCode).toEqual(200);
    const titles = res.body.map(t => t.title);
    expect(titles).toContain('Recent Trend');
    expect(titles).not.toContain('Old Trend');
    expect(res.body[0]).toHaveProperty('status');
    // Expect thumbnail_url to be present (even if null)
    expect(res.body[0]).toHaveProperty('thumbnail_url');
  });
});

describe('POST /api/trends/collect', () => {
  it('should trigger collection with dates and return 202', async () => {
    const payload = {
      startDate: '2026-01-12T00:00:00Z',
      endDate: '2026-01-18T23:59:59Z'
    };
    const res = await request(app)
      .post('/api/trends/collect')
      .send(payload);
    expect(res.statusCode).toEqual(202);
    expect(res.body.status).toEqual('started');
    expect(runCollection).toHaveBeenCalledWith(payload.startDate, payload.endDate);
  });

  it('should return 409 if collection for the week is in progress', async () => {
    const startDate = '2026-01-12T00:00:00Z';
    collectionService.activeCollections.set(startDate, true);
    
    const res = await request(app)
      .post('/api/trends/collect')
      .send({ startDate });
    
    expect(res.statusCode).toEqual(409);
    
    collectionService.activeCollections.delete(startDate);
  });
});