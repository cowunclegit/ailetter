const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateToken, updateLastActivity } = require('../services/websocket/proxy-server');

// Middleware to validate proxy token
const authProxy = (req, res, next) => {
  const token = req.headers['x-proxy-token'];
  if (!validateToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Track activity for status dashboard
  const io = req.app.get('io');
  updateLastActivity(io);
  
  next();
};

/**
 * GET /api/proxy/tasks
 * Retrieves the next pending collection task
 */
router.get('/tasks', authProxy, (req, res) => {
  const query = 'SELECT * FROM proxy_tasks WHERE status = ? ORDER BY created_at ASC LIMIT 1';
  db.get(query, ['pending'], (err, task) => {
    if (err) {
      console.error('Error fetching proxy task:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!task) {
      return res.status(204).send();
    }

    // Mark task as processing
    db.run('UPDATE proxy_tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['processing', task.id], (updateErr) => {
      if (updateErr) {
        console.error('Error updating proxy task status:', updateErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({
        task: {
          id: task.id,
          sources: JSON.parse(task.sources)
        }
      });
    });
  });
});

/**
 * POST /api/proxy/update
 * Handles progress, item collection, completion, and errors from proxy
 */
router.post('/update', authProxy, async (req, res) => {
  const { type, payload } = req.body;
  const { task_id } = payload;

  if (!task_id) {
    return res.status(400).json({ error: 'Missing task_id' });
  }

  // We'll reuse existing message handlers by mocking the 'io' object
  // Since we are moving to polling, we might need to adjust how frontend is notified
  const io = req.app.get('io');
  const { 
    handleItemCollected, 
    handleCollectionComplete, 
    handleProgressUpdate, 
    handleCollectionError 
  } = require('../services/websocket/message-handler');

  switch (type) {
    case 'ITEM_COLLECTED':
      await handleItemCollected(payload, io);
      break;
    case 'PROGRESS_UPDATE':
      handleProgressUpdate(payload, io);
      break;
    case 'COLLECTION_COMPLETE':
      db.run('UPDATE proxy_tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['completed', task_id]);
      handleCollectionComplete(payload, io);
      break;
    case 'COLLECTION_ERROR':
      db.run('UPDATE proxy_tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['failed', task_id]);
      handleCollectionError(payload, io);
      break;
    default:
      return res.status(400).json({ error: 'Unknown update type' });
  }

  res.json({ status: 'accepted' });
});

module.exports = router;
