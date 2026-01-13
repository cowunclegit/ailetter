const fs = require('fs');
const path = require('path');
const db = require('./index');

const schemaPath = path.resolve(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error('Could not run schema migration', err);
  } else {
    console.log('Schema migration completed successfully');
  }
  db.close();
});