const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');
const { v4: uuidv4 } = require('uuid');

describe('Proxy Polling API', () => {
  const proxyToken = process.env.PROXY_SHARED_SECRET || 'test-secret';
  
  beforeAll(() => {
    process.env.PROXY_SHARED_SECRET = proxyToken;
  });

  beforeEach((done) => {
    db.run('DELETE FROM proxy_tasks', done);
  });

  test('GET /api/proxy/tasks should return 204 when no tasks', async () => {
    const res = await request(app)
      .get('/api/proxy/tasks')
      .set('x-proxy-token', proxyToken);
    
    expect(res.status).toBe(204);
  });

  test('GET /api/proxy/tasks should return task and mark as processing', async () => {
    const taskId = uuidv4();
    const sources = JSON.stringify([{ id: 1, type: 'rss', url: 'http://test.com' }]);
    
    await new Promise((resolve) => {
      db.run('INSERT INTO proxy_tasks (id, status, sources) VALUES (?, ?, ?)', 
        [taskId, 'pending', sources], resolve);
    });

    const res = await request(app)
      .get('/api/proxy/tasks')
      .set('x-proxy-token', proxyToken);
    
    expect(res.status).toBe(200);
    expect(res.body.task.id).toBe(taskId);
    expect(res.body.task.sources).toHaveLength(1);

    // Verify status updated in DB
    const task = await new Promise((resolve) => {
      db.get('SELECT status FROM proxy_tasks WHERE id = ?', [taskId], (err, row) => resolve(row));
    });
    expect(task.status).toBe('processing');
  });

  test('POST /api/proxy/update should handle completion', async () => {
    const taskId = uuidv4();
    await new Promise((resolve) => {
      db.run('INSERT INTO proxy_tasks (id, status) VALUES (?, ?)', [taskId, 'processing'], resolve);
    });

    const res = await request(app)
      .post('/api/proxy/update')
      .set('x-proxy-token', proxyToken)
      .send({
        type: 'COLLECTION_COMPLETE',
        payload: { task_id: taskId }
      });
    
    expect(res.status).toBe(200);

    const task = await new Promise((resolve) => {
      db.get('SELECT status FROM proxy_tasks WHERE id = ?', [taskId], (err, row) => resolve(row));
    });
    expect(task.status).toBe('completed');
  });
});
