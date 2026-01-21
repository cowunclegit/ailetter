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
    console.log('Starting migration: 016_add_newsletter_approval_fields');

    // 1. Add confirmation_uuid to newsletters
    try {
        await run(`ALTER TABLE newsletters ADD COLUMN confirmation_uuid TEXT UNIQUE`);
        console.log('Added column: confirmation_uuid to newsletters');
    } catch (err) {
        if (err.message && err.message.includes('duplicate column name')) {
            console.log('Column confirmation_uuid already exists in newsletters');
        } else {
            throw err;
        }
    }

    // 2. Add sent_at to newsletters
    try {
        await run(`ALTER TABLE newsletters ADD COLUMN sent_at DATETIME`);
        console.log('Added column: sent_at to newsletters');
    } catch (err) {
        if (err.message && err.message.includes('duplicate column name')) {
            console.log('Column sent_at already exists in newsletters');
        } else {
            throw err;
        }
    }

    console.log('Migration 016_add_newsletter_approval_fields completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    db.close();
  }
};

migrate();
