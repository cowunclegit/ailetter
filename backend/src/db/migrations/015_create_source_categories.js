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
    console.log('Starting migration: 015_create_source_categories');

    // 1. Rename existing source_categories to categories
    await run(`ALTER TABLE source_categories RENAME TO categories`);
    console.log('Renamed table: source_categories to categories');

    // 2. Create the junction table source_categories
    // Note: It's named source_categories as per task, which now refers to the junction.
    await run(`
      CREATE TABLE source_categories (
        source_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        PRIMARY KEY (source_id, category_id),
        FOREIGN KEY (source_id) REFERENCES sources (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      )
    `);
    console.log('Created junction table: source_categories');

    // 3. Migrate existing data from sources.category_id to source_categories (junction)
    await run(`
      INSERT INTO source_categories (source_id, category_id)
      SELECT id, category_id FROM sources WHERE category_id IS NOT NULL
    `);
    console.log('Migrated existing category assignments');

    console.log('Migration 015_create_source_categories completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    db.close();
  }
};

migrate();
