const { connectProxy } = require('./client');
const proxyConfig = require('./config/proxy-config');

console.log('Starting Collect Proxy Service...');
if (proxyConfig.proxyUrl) {
  console.log(`Proxy configured: ${proxyConfig.proxyUrl}`);
} else {
  console.log('No proxy configured. Using direct connections.');
}

connectProxy();
