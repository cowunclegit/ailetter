const { connectProxy } = require('../src/client');
const WebSocket = require('ws');

jest.mock('ws');

describe('Proxy Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should attempt to connect to the backend', () => {
    process.env.MAIN_BACKEND_WS_URL = 'ws://localhost:3080/ws/proxy';
    process.env.PROXY_SHARED_SECRET = 'test-secret';
    process.env.PROXY_CLIENT_ID = 'test-client';

    connectProxy();

    expect(WebSocket).toHaveBeenCalledWith(
      'ws://localhost:3080/ws/proxy',
      expect.objectContaining({
        headers: { 'x-proxy-token': 'test-secret' }
      })
    );
  });
});
