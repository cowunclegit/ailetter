// This file is run once before all test suites.
const db = require('../src/db');
const fs = require('fs');
const path = require('path');

const schemaPath = path.resolve(__dirname, '../src/db/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// We can't close the in-memory DB until all tests are done.
// Jest runs test suites in parallel, so closing the DB in one suite's afterAll
// will cause others to fail. We'll rely on Jest to terminate the process,
// which will destroy the in-memory database.

beforeAll(done => {
    db.exec(schema, done);
});

afterAll(done => {
    const timeout = setTimeout(() => {
        console.warn('Database closing timed out. Forcing exit.');
        done();
    }, 2000);

    db.close((err) => {
        clearTimeout(timeout);
        if (err) {
            console.error('Error closing database:', err);
        }
        done();
    });
});