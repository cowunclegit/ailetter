const { validateToken } = require('../../src/services/websocket/proxy-server');

describe('Proxy Authentication', () => {
  const originalSecret = process.env.PROXY_SHARED_SECRET;

  beforeAll(() => {
    process.env.PROXY_SHARED_SECRET = 'test-secret';
  });

  afterAll(() => {
    process.env.PROXY_SHARED_SECRET = originalSecret;
  });

  test('should validate correct token', () => {
    expect(validateToken('test-secret')).toBe(true);
  });

  test('should reject incorrect token', () => {
    expect(validateToken('wrong-secret')).toBe(false);
  });

  test('should reject empty token', () => {
    expect(validateToken('')).toBe(false);
    expect(validateToken(null)).toBe(false);
  });
});
