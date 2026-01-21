const axios = require('axios');
const { getProxyAgent } = require('../../src/utils/proxy');
const http = require('http');

describe('Proxy Flow Integration', () => {
  let mockProxyServer;
  let proxyRequests = [];

  beforeAll((done) => {
    mockProxyServer = http.createServer((req, res) => {
      proxyRequests.push({
        url: req.url,
        method: req.method,
        headers: req.headers
      });
      res.writeHead(200);
      res.end('Mocked response from proxy');
    });
    mockProxyServer.listen(0, '127.0.0.1', () => {
      const port = mockProxyServer.address().port;
      process.env.PROXY_URL = `http://127.0.0.1:${port}`;
      done();
    });
  });

  afterAll((done) => {
    mockProxyServer.close(done);
  });

  beforeEach(() => {
    proxyRequests = [];
  });

  test('should route requests through the configured proxy', async () => {
    const targetUrl = 'http://example.com/rss';
    const agent = getProxyAgent(targetUrl);
    
    // In this integration test, we use axios directly with the agent
    // to simulate how collector.js will use it.
    try {
      await axios.get(targetUrl, {
        httpAgent: agent,
        httpsAgent: agent,
        // Disable internal proxy handling to use our agent
        proxy: false
      });
    } catch (e) {
      // We expect it might fail if the mock proxy doesn't handle CONNECT for HTTPS
      // or if it's just a simple HTTP proxy.
      // Since target is http, it should be fine.
    }

    expect(proxyRequests.length).toBeGreaterThan(0);
    expect(proxyRequests[0].url).toContain('http://example.com/rss');
  });

  test('should use direct connection when no proxy is configured', async () => {
    delete process.env.PROXY_URL;
    delete process.env.HTTPS_PROXY;
    delete process.env.HTTP_PROXY;

    const targetUrl = 'http://127.0.0.1:12345/direct'; // Unreachable but we want to see if it bypasses proxy
    const agent = getProxyAgent(targetUrl);
    
    expect(agent).toBeNull();

    try {
      await axios.get(targetUrl, {
        httpAgent: agent,
        httpsAgent: agent,
        proxy: false,
        timeout: 100 // Short timeout
      });
    } catch (e) {
      // Ignore connection error, we just want to verify proxy wasn't used
    }

    expect(proxyRequests.length).toBe(0);
  });

  test('should handle authenticated proxy', async () => {
    const user = 'testuser';
    const pass = 'testpass';
    const auth = Buffer.from(`${user}:${pass}`).toString('base64');
    
    const port = mockProxyServer.address().port;
    process.env.PROXY_URL = `http://${user}:${pass}@127.0.0.1:${port}`;

    const targetUrl = 'http://example.com/auth';
    const agent = getProxyAgent(targetUrl);

    await axios.get(targetUrl, {
      httpAgent: agent,
      httpsAgent: agent,
      proxy: false
    });

    expect(proxyRequests.length).toBe(1);
    expect(proxyRequests[0].headers['proxy-authorization']).toBe(`Basic ${auth}`);
  });

  test('should bypass proxy for NO_PROXY hosts', async () => {
    const port = mockProxyServer.address().port;
    process.env.PROXY_URL = `http://127.0.0.1:${port}`;
    process.env.NO_PROXY = 'example.internal';

    const targetUrl = 'http://example.internal/bypass';
    const agent = getProxyAgent(targetUrl);

    expect(agent).toBeNull();

    try {
      await axios.get(targetUrl, {
        httpAgent: agent,
        httpsAgent: agent,
        proxy: false,
        timeout: 100
      });
    } catch (e) {
      // Ignore
    }

    expect(proxyRequests.length).toBe(0);
  });
});