const { HttpsProxyAgent } = require('https-proxy-agent');
const { HttpProxyAgent } = require('http-proxy-agent');
const { getProxyForUrl } = require('proxy-from-env');
const { ProxyAgent } = require('undici');
const proxyConfig = require('../config/proxy-config');

// Agent cache to prevent socket leaks
const agentCache = new Map();
const undiciCache = new Map();

/**
 * Determines if a given URL should be proxied based on NO_PROXY rules.
 * @param {string} url - The target URL
 * @returns {boolean}
 */
function shouldProxy(url) {
  return !!getProxyForUrl(url);
}

/**
 * Returns an appropriate agent for the given URL based on proxy configuration.
 * @param {string} url - The target URL
 * @returns {object|null} An HttpsProxyAgent, HttpProxyAgent or null for direct connection
 */
function getProxyAgent(url) {
  // proxy-from-env's getProxyForUrl looks at http_proxy, https_proxy, and no_proxy
  // We should ensure that if our custom PROXY_URL is set, it's also considered if others are missing.
  if (process.env.PROXY_URL && !process.env.HTTPS_PROXY && !process.env.HTTP_PROXY) {
    process.env.HTTPS_PROXY = process.env.PROXY_URL;
    process.env.HTTP_PROXY = process.env.PROXY_URL;
  }

  const proxyUrl = getProxyForUrl(url);
  if (!proxyUrl) {
    return null;
  }

  const cacheKey = `${url.startsWith('https:') ? 'https' : 'http'}:${proxyUrl}`;
  if (agentCache.has(cacheKey)) {
    return agentCache.get(cacheKey);
  }

  // Mask credentials for logging
  let maskedProxyUrl = proxyUrl;
  try {
    const parsed = new URL(proxyUrl);
    if (parsed.password) {
      parsed.password = '****';
      maskedProxyUrl = parsed.toString();
    }
  } catch (e) {
    // Ignore parsing errors for masking
  }

  console.log(`Using proxy ${maskedProxyUrl} for ${url}`);

  let agent;
  if (url.startsWith('https:')) {
    agent = new HttpsProxyAgent(proxyUrl);
  } else {
    agent = new HttpProxyAgent(proxyUrl);
  }

  agentCache.set(cacheKey, agent);
  return agent;
}

/**
 * Returns an undici ProxyAgent for the given URL based on proxy configuration.
 * @param {string} url - The target URL
 * @returns {ProxyAgent|null}
 */
function getUndiciProxyAgent(url) {
  if (process.env.PROXY_URL && !process.env.HTTPS_PROXY && !process.env.HTTP_PROXY) {
    process.env.HTTPS_PROXY = process.env.PROXY_URL;
    process.env.HTTP_PROXY = process.env.PROXY_URL;
  }

  const proxyUrl = getProxyForUrl(url);
  if (!proxyUrl) {
    return null;
  }

  if (undiciCache.has(proxyUrl)) {
    return undiciCache.get(proxyUrl);
  }

  const agent = new ProxyAgent(proxyUrl);
  undiciCache.set(proxyUrl, agent);
  return agent;
}

module.exports = {
  getProxyAgent,
  getUndiciProxyAgent,
  shouldProxy,
};