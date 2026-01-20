const WebSocket = require('ws');
const { collectFromRSS, collectFromYoutube, extractThumbnail, fetchAndBase64 } = require('./collector');
require('dotenv').config();

let ws = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_DELAY = 30000; // 30 seconds

const connectProxy = () => {
  let url = process.env.MAIN_BACKEND_WS_URL;
  const token = process.env.PROXY_SHARED_SECRET;
  const clientId = process.env.PROXY_CLIENT_ID;

  // Auto-upgrade to wss:// if connecting to the HTTPS backend on port 3080
  if (url && url.startsWith('ws://') && url.includes(':3080')) {
    console.log('Auto-upgrading connection to wss:// for HTTPS backend...');
    url = url.replace('ws://', 'wss://');
  }

  console.log(`Attempting to connect to Main Backend at ${url}...`);

  ws = new WebSocket(url, {
    headers: {
      'x-proxy-token': token
    },
    rejectUnauthorized: false // Allow self-signed certs for local development
  });

  ws.on('open', () => {
    console.log('Connected to Main Backend');
    reconnectAttempts = 0;
    
    ws.send(JSON.stringify({
      type: 'IDENTIFY',
      payload: { client_id: clientId }
    }));
  });

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);
      await handleMessage(message);
    } catch (err) {
      console.error('Failed to handle message:', err.message);
    }
  });

  ws.on('close', () => {
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
    console.log(`Disconnected from Main Backend. Reconnecting in ${delay/1000}s...`);
    reconnectAttempts++;
    setTimeout(connectProxy, delay);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
  });

  return ws;
};

const handleMessage = async (message) => {
  const { type, payload } = message;
  console.log('Received message:', type);

  switch (type) {
    case 'START_COLLECTION':
      await runCollection(payload);
      break;
    case 'HEARTBEAT':
      ws.send(JSON.stringify({ type: 'HEARTBEAT_ACK' }));
      break;
    default:
      console.log('Unhandled message type:', type);
  }
};

const runCollection = async (payload) => {
  const { task_id, sources } = payload;
  console.log(`Starting collection for task: ${task_id}`);

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    try {
      ws.send(JSON.stringify({
        type: 'PROGRESS_UPDATE',
        payload: {
          task_id,
          message: `Scraping ${source.url}...`,
          current: i + 1,
          total: sources.length
        }
      }));

      let items = [];
      if (source.type === 'rss') {
        items = await collectFromRSS(source.url);
      } else if (source.type === 'youtube') {
        items = await collectFromYoutube(source.url);
      }

      for (const item of items) {
        if (!item.thumbnail_url && source.type === 'rss') {
          item.thumbnail_url = await extractThumbnail(item.source_url);
        }

        if (item.thumbnail_url) {
          item.thumbnail_data = await fetchAndBase64(item.thumbnail_url);
        }

        ws.send(JSON.stringify({
          type: 'ITEM_COLLECTED',
          payload: {
            task_id,
            item: {
              ...item,
              source_id: source.id,
              category_ids: source.category_ids
            }
          }
        }));
      }
    } catch (error) {
      console.error(`Error collecting from ${source.url}:`, error.message);
      ws.send(JSON.stringify({
        type: 'COLLECTION_ERROR',
        payload: {
          task_id,
          error: error.message,
          source_url: source.url
        }
      }));
    }
  }

  ws.send(JSON.stringify({
    type: 'COLLECTION_COMPLETE',
    payload: { task_id }
  }));
};

module.exports = {
  connectProxy
};
