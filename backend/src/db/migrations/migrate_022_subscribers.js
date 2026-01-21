const db = require('../index');

db.serialize(() => {
  // Create subscribers table
  db.run(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      is_subscribed BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("Error creating subscribers table:", err.message);
    } else {
      console.log("Table subscribers created or already exists.");
    }
  });

  // Create subscriber_categories join table with CASCADE delete
  db.run("DROP TABLE IF EXISTS subscriber_categories");
  db.run(`
    CREATE TABLE IF NOT EXISTS subscriber_categories (
      subscriber_id INTEGER NOT NULL,
      preset_id INTEGER NOT NULL,
      PRIMARY KEY (subscriber_id, preset_id),
      FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE,
      FOREIGN KEY (preset_id) REFERENCES ai_subject_presets(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error("Error creating subscriber_categories table:", err.message);
    } else {
      console.log("Table subscriber_categories created with CASCADE.");
    }
  });
});
