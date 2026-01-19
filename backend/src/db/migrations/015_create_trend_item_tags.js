const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.startsWith('file:')) {
  dbUrl = dbUrl.replace('file:', '');
}

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : (dbUrl || path.resolve(__dirname, '../../../dev.db'));

const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error('Error running sql ' + sql);
        console.error(err);
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const migrate = async () => {
  try {
    console.log('Starting migration: 015_create_trend_item_tags');

    await run(`
      CREATE TABLE IF NOT EXISTS trend_item_tags (
        trend_item_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        PRIMARY KEY (trend_item_id, category_id),
        FOREIGN KEY (trend_item_id) REFERENCES trend_items (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      )
    `);
    console.log('Created junction table: trend_item_tags');

    console.log('Migration 015_create_trend_item_tags completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    db.close();
  }
};

migrate();
