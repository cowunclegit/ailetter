const cron = require('node-cron');
const CollectionService = require('../services/collectionService');
const AiService = require('../services/aiService');

const collectionService = new CollectionService();
const aiService = new AiService();

async function runCollection(startDate = null, endDate = null) {
  console.log('Starting collection job...');
  try {
    const savedItems = await collectionService.collectAll(startDate, endDate);
    if (!savedItems) return; // Skipped due to locking

    console.log(`Collected ${savedItems.length} items. Starting AI curation...`);
    
    if (savedItems.length > 0) {
        const selectedIds = await aiService.processTrends(savedItems);
        console.log(`AI curation complete. Selected ${selectedIds.length} items.`);
    } else {
        console.log('No new items to curate.');
    }
  } catch (error) {
    console.error('Collection Job Failed:', error);
  }
}

// Schedule: Every Monday at 9:00 AM
let job;
if (process.env.NODE_ENV !== 'test') {
  job = cron.schedule('0 9 * * 1', runCollection, {
    scheduled: false 
  });
} else {
  // Mock job object for tests to avoid open handles from node-cron
  job = { 
    start: () => console.log('Mock job started'), 
    stop: () => console.log('Mock job stopped') 
  };
}

module.exports = { job, runCollection, collectionService };
