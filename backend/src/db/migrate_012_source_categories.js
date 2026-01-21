const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.startsWith('file:')) {
  dbUrl = dbUrl.replace('file:', '');
}

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : (dbUrl || path.resolve(__dirname, '../../dev.db'));

const db = new sqlite3.Database(dbPath);

const serialize = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      resolve();
    });
  });
};

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
    console.log('Starting migration: 012_source_categories');

    await serialize();

    // 1. Create source_categories table
    await run(`
      CREATE TABLE IF NOT EXISTS source_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created table: source_categories');

    // 2. Add category_id to sources table
    // SQLite doesn't support ADD COLUMN with FOREIGN KEY directly in the same statement efficiently in all versions,
    // but newer versions do. However, for adding a column that is a FK, we typically just add the column.
    // Enforcing FKs requires PRAGMA foreign_keys = ON;
    
    // Check if column exists first to avoid error on re-run
    try {
        await run(`ALTER TABLE sources ADD COLUMN category_id INTEGER REFERENCES source_categories(id) ON DELETE SET NULL`);
        console.log('Added column: category_id to sources');
    } catch (err) {
        if (err.message && err.message.includes('duplicate column name')) {
            console.log('Column category_id already exists in sources');
        } else {
            throw err;
        }
    }

    console.log('Migration 012_source_categories completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    db.close();
  }
};

migrate();
