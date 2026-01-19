const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/wipe', async (req, res, next) => {
  try {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION;");
      db.run("DELETE FROM newsletter_items;");
      db.run("DELETE FROM newsletters;");
      db.run("DELETE FROM trend_item_tags;");
      db.run("DELETE FROM trend_items;");
      db.run("COMMIT;", (err) => {
        if (err) {
          db.run("ROLLBACK;");
          return res.status(500).json({ error: 'Failed to wipe database' });
        }
        res.json({ message: 'Database wiped successfully' });
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
