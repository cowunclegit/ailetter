const axios = require('axios');
const http = require('http');
const https = require('https');
const { collectFromRSS, collectFromYoutube, extractThumbnail, fetchAndBase64 } = require('./collector');
require('dotenv').config();

const BACKEND_URL = process.env.MAIN_BACKEND_URL || 'http://localhost:3080';
const POLLING_INTERVAL = parseInt(process.env.POLLING_INTERVAL, 10) || 5000;
const TOKEN = process.env.PROXY_SHARED_SECRET;

// Create axios instance with disabled keepAlive for Windows stability
const client = axios.create({
  httpAgent: new http.Agent({ keepAlive: false }),
  httpsAgent: new https.Agent({ keepAlive: false }),
  timeout: 10000
});

let isProcessing = false;

const pollForTasks = async () => {
  if (isProcessing) return;

  try {
    const response = await client.get(`${BACKEND_URL}/api/proxy/tasks`, {
      headers: { 'x-proxy-token': TOKEN }
    });

    if (response.status === 200 && response.data && response.data.task) {
      const task = response.data.task;
      console.log(`Received task: ${task.id}`);
      isProcessing = true;
      try {
        await runCollection(task);
      } finally {
        isProcessing = false;
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Authentication failed with backend. Check PROXY_SHARED_SECRET.');
    } else if (error.response && error.response.status === 204) {
      // No tasks, do nothing
    } else {
      console.error('Error polling backend:', error.message);
    }
  }
};

const sendUpdate = async (type, payload) => {
  try {
    await client.post(`${BACKEND_URL}/api/proxy/update`, {
      type,
      payload
    }, {
      headers: { 'x-proxy-token': TOKEN }
    });
  } catch (error) {
    console.error(`Failed to send ${type} update:`, error.message);
  }
};

const runCollection = async (task) => {
  const { id: task_id, sources } = task;
  console.log(`Starting collection for task: ${task_id}`);

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    try {
      await sendUpdate('PROGRESS_UPDATE', {
        task_id,
        message: `Scraping ${source.url}...`,
        current: i + 1,
        total: sources.length
      });

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

        await sendUpdate('ITEM_COLLECTED', {
          task_id,
          item: {
            ...item,
            source_id: source.id,
            category_ids: source.category_ids
          }
        });
      }
    } catch (error) {
      console.error(`Error collecting from ${source.url}:`, error.message);
      await sendUpdate('COLLECTION_ERROR', {
        task_id,
        error: error.message,
        source_url: source.url
      });
    }
  }

  await sendUpdate('COLLECTION_COMPLETE', { task_id });
};

const connectProxy = () => {
  console.log(`Starting HTTP Polling to ${BACKEND_URL} every ${POLLING_INTERVAL}ms...`);
  setInterval(pollForTasks, POLLING_INTERVAL);
};

module.exports = {
  connectProxy
};
