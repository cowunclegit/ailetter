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
    console.log('Starting migration: 015_add_is_deleted_to_categories');

    try {
        await run(`ALTER TABLE categories ADD COLUMN is_deleted BOOLEAN DEFAULT 0`);
        console.log('Added column: is_deleted to categories');
    } catch (err) {
        if (err.message && err.message.includes('duplicate column name')) {
            console.log('Column is_deleted already exists in categories');
        } else {
            throw err;
        }
    }

    console.log('Migration 015_add_is_deleted_to_categories completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    db.close();
  }
};

migrate();
