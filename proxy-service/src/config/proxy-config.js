require('dotenv').config();

const proxyUrl = process.env.PROXY_URL || process.env.HTTPS_PROXY || process.env.HTTP_PROXY || null;

if (proxyUrl) {
  try {
    new URL(proxyUrl);
  } catch (e) {
    console.error(`Invalid PROXY_URL configured: ${proxyUrl}`);
    process.exit(1);
  }
}

const proxyConfig = {
  proxyUrl,
  noProxy: process.env.NO_PROXY ? process.env.NO_PROXY.split(',').map(h => h.trim()) : [],
};

module.exports = proxyConfig;