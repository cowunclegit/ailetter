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
    console.log('Starting migration: 016_fix_newsletter_status_constraint');

    // SQLite doesn't support ALTER TABLE for constraints. 
    // We need to recreate the table.
    
    await run(`BEGIN TRANSACTION`);

    // 1. Create a temporary table with the correct schema
    await run(`
      CREATE TABLE newsletters_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        issue_date DATE NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('draft', 'sending', 'sent')),
        confirmation_uuid TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        sent_at DATETIME
      )
    `);

    // 2. Copy data from old table to new table
    await run(`
      INSERT INTO newsletters_new (id, issue_date, status, confirmation_uuid, created_at, sent_at)
      SELECT id, issue_date, status, confirmation_uuid, created_at, sent_at FROM newsletters
    `);

    // 3. Drop the old table
    await run(`DROP TABLE newsletters`);

    // 4. Rename the new table to the original name
    await run(`ALTER TABLE newsletters_new RENAME TO newsletters`);

    await run(`COMMIT`);

    console.log('Migration 016_fix_newsletter_status_constraint completed successfully.');
  } catch (err) {
    await run(`ROLLBACK`);
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    db.close();
  }
};

migrate();
