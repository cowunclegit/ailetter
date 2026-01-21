const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.startsWith('file:')) {
  dbUrl = dbUrl.replace('file:', '');
}

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : (dbUrl || path.resolve(__dirname, '../../dev.db'));

const resolvedPath = path.resolve(dbPath);

// Ensure the directory exists
const dir = path.dirname(resolvedPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
    db.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) {
        console.error('Failed to enable foreign keys', err);
      }
    });

    // Auto-initialize schema
    initializeSchema(db);
  }
});

function initializeSchema(db) {
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error('Schema file not found:', schemaPath);
    return;
  }

  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Split schema into individual statements if needed, or use db.exec
  // exec can run multiple statements
  db.exec(schema, (err) => {
    if (err) {
      console.error('Error initializing schema:', err.message);
    } else {
      console.log('Database schema initialized/verified successfully');
    }
  });
}

module.exports = db;