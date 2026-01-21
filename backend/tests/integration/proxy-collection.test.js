const { WebSocket } = require('ws');
const http = require('http');
const express = require('express');
const { initProxyServer } = require('../../src/services/websocket/proxy-server');
const TrendItemModel = require('../../src/models/trendItemModel');

// Mocking models to avoid real DB dependency in this integration test
jest.mock('../../src/models/trendItemModel');

describe('Proxy Collection Integration', () => {
  let server;
  let port;
  const secret = 'integration-test-secret';

  beforeAll((done) => {
    process.env.PROXY_SHARED_SECRET = secret;
    const app = express();
    app.set('io', { emit: jest.fn(), on: jest.fn() });
    
    server = http.createServer(app);
    initProxyServer(server);
    
    server.listen(0, () => {
      port = server.address().port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('should handle end-to-end collection flow', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}/ws/proxy`, {
      headers: { 'x-proxy-token': secret }
    });

    ws.on('open', () => {
      // 1. Identify
      ws.send(JSON.stringify({
        type: 'IDENTIFY',
        payload: { client_id: 'test-proxy' }
      }));

      // 2. Stream an item
      ws.send(JSON.stringify({
        type: 'ITEM_COLLECTED',
        payload: {
          task_id: 'test-task',
          item: {
            title: 'Integration Test Item',
            source_url: 'http://test.com',
            content: 'Test content'
          }
        }
      }));

      // 3. Complete
      ws.send(JSON.stringify({
        type: 'COLLECTION_COMPLETE',
        payload: { task_id: 'test-task' }
      }));

      // Allow some time for processing
      setTimeout(() => {
        expect(TrendItemModel.create).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Integration Test Item'
        }));
        ws.close();
        done();
      }, 500);
    });
  });
});
