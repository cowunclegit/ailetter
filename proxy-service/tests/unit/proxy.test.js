const { getProxyAgent } = require('../../src/utils/proxy');
const { HttpsProxyAgent } = require('https-proxy-agent');

describe('ProxyAgent Factory', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('should return null when no proxy is configured', () => {
    delete process.env.PROXY_URL;
    delete process.env.HTTPS_PROXY;
    delete process.env.HTTP_PROXY;
    
    const agent = getProxyAgent('https://google.com');
    expect(agent).toBeNull();
  });

  test('should return HttpsProxyAgent when PROXY_URL is configured', () => {
    process.env.PROXY_URL = 'http://proxy.example.com:8080';
    delete process.env.HTTPS_PROXY;
    delete process.env.HTTP_PROXY;
    
    const agent = getProxyAgent('https://google.com');
    expect(agent).toBeInstanceOf(HttpsProxyAgent);
    expect(agent.proxy.href).toBe('http://proxy.example.com:8080/');
  });

  test('should return HttpsProxyAgent when HTTPS_PROXY is configured', () => {
    process.env.HTTPS_PROXY = 'http://proxy.example.com:8443';
    
    const agent = getProxyAgent('https://google.com');
    expect(agent).toBeInstanceOf(HttpsProxyAgent);
    expect(agent.proxy.href).toBe('http://proxy.example.com:8443/');
  });

  test('should return null for hosts in NO_PROXY', () => {
    process.env.PROXY_URL = 'http://proxy.example.com:8080';
    process.env.NO_PROXY = 'localhost,127.0.0.1,.internal.corp.com';
    
    expect(getProxyAgent('http://localhost:3000')).toBeNull();
    expect(getProxyAgent('http://127.0.0.1:8080')).toBeNull();
    expect(getProxyAgent('https://api.internal.corp.com')).toBeNull();
    expect(getProxyAgent('https://google.com')).toBeInstanceOf(HttpsProxyAgent);
  });

  test('should support authenticated proxy URLs', () => {
    process.env.PROXY_URL = 'http://user:pass@proxy.example.com:8080';
    
    const agent = getProxyAgent('https://google.com');
    expect(agent).toBeInstanceOf(HttpsProxyAgent);
    expect(agent.proxy.href).toBe('http://user:pass@proxy.example.com:8080/');
    expect(agent.proxy.username).toBe('user');
    expect(agent.proxy.password).toBe('pass');
  });
});