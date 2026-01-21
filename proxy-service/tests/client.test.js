describe('Proxy Client', () => {
  const originalEnv = process.env;
  let connectProxy;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    jest.resetModules();
    
    // Set env before require
    process.env.MAIN_BACKEND_URL = 'http://localhost:3080';
    process.env.PROXY_SHARED_SECRET = 'test-secret';
    process.env.POLLING_INTERVAL = '5000';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
    connectProxy = require('../src/client').connectProxy;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.useRealTimers();
    process.env = originalEnv;
  });

  test('should initialize polling', () => {
    process.env.MAIN_BACKEND_URL = 'http://localhost:3080';
    process.env.PROXY_SHARED_SECRET = 'test-secret';

    connectProxy();

    // Verify setInterval was called
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 5000);
  });

  test('should attempt to poll when timers advance', async () => {
    process.env.MAIN_BACKEND_URL = 'http://localhost:3080';
    process.env.PROXY_SHARED_SECRET = 'test-secret';

    connectProxy();
    
    // Clear initial logs if any
    jest.advanceTimersByTime(5000);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/proxy/tasks'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-proxy-token': 'test-secret'
        })
      })
    );
  });
});