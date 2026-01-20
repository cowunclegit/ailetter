const TrendItemModel = require('../../models/trendItemModel');
const { saveThumbnail } = require('../../utils/image-storage');
const { collectionService } = require('../../jobs/collectionJob');

const handleItemCollected = async (payload, io) => {
  const { task_id, item } = payload;
  console.log(`Processing item for task ${task_id}: ${item.title}`);

  try {
    if (item.thumbnail_data) {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
      item.local_thumbnail_path = await saveThumbnail(item.thumbnail_data, filename);
      delete item.thumbnail_data;
    }

    if (!item.title || !item.source_url) {
      console.warn('Skipping invalid item:', item);
      return;
    }

    await TrendItemModel.create({
      ...item,
      original_url: item.source_url || item.original_url,
      summary: item.content || item.summary,
      thumbnail_url: item.local_thumbnail_path || item.thumbnail_url
    });
    
  } catch (error) {
    console.error('Error handling item collected:', error.message);
  }
};

const handleCollectionComplete = (payload, io) => {
  const { task_id } = payload;
  console.log(`Collection task ${task_id} completed`);
  collectionService.activeCollections.delete(task_id);
  
  if (io) {
    io.emit('collection_progress', {
      task_id,
      status: 'complete',
      message: 'Collection complete'
    });
  }
};

const handleProgressUpdate = (payload, io) => {
  const { task_id, message, current, total } = payload;
  console.log(`Progress [${task_id}]: ${message} (${current}/${total})`);
  
  if (io) {
    io.emit('collection_progress', {
      task_id,
      status: 'in_progress',
      message,
      current,
      total
    });
  }
};

const handleCollectionError = (payload, io) => {
  const { task_id, error, source_url } = payload;
  console.error(`Collection error [${task_id}] at ${source_url}: ${error}`);
  
  if (io) {
    io.emit('collection_progress', {
      task_id,
      status: 'error',
      message: `Error at ${source_url}: ${error}`,
      error
    });
  }
};

module.exports = {
  handleItemCollected,
  handleCollectionComplete,
  handleProgressUpdate,
  handleCollectionError
};