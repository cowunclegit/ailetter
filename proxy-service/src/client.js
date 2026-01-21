const { collectFromRSS, collectFromYoutube, extractThumbnail, fetchAndBase64 } = require('./collector');
require('dotenv').config();

const BACKEND_URL = process.env.MAIN_BACKEND_URL || 'http://localhost:3080';
const POLLING_INTERVAL = parseInt(process.env.POLLING_INTERVAL, 10) || 5000;
const TOKEN = process.env.PROXY_SHARED_SECRET;

let isProcessing = false;

/**
 * Native fetch based polling to avoid axios-specific socket issues on Windows
 */
const pollForTasks = async () => {
  if (isProcessing) return;

  try {
    const response = await fetch(`${BACKEND_URL}/api/proxy/tasks`, {
      method: 'GET',
      headers: { 
        'x-proxy-token': TOKEN,
        'Connection': 'close' // Explicitly disable keep-alive at protocol level
      }
    });

    if (response.status === 200) {
      const data = await response.json();
      if (data && data.task) {
        console.log(`Received task: ${data.task.id}`);
        isProcessing = true;
        try {
          await runCollection(data.task);
        } finally {
          isProcessing = false;
        }
      }
    } else if (response.status === 401) {
      console.error('Authentication failed with backend. Check PROXY_SHARED_SECRET.');
    }
  } catch (error) {
    console.error('Error polling backend:', error.message);
  }
};

const sendUpdate = async (type, payload) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/proxy/update`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-proxy-token': TOKEN,
        'Connection': 'close'
      },
      body: JSON.stringify({ type, payload })
    });

    if (!response.ok) {
      console.error(`Failed to send ${type} update: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Failed to send ${type} update error:`, error.message);
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
  console.log(`Starting HTTP Polling (fetch) to ${BACKEND_URL} every ${POLLING_INTERVAL}ms...`);
  setInterval(pollForTasks, POLLING_INTERVAL);
};

module.exports = {
  connectProxy
};