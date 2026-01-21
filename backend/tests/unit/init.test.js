const fs = require('fs');
const path = require('path');

// Mock db/index.js to test initialization logic
// Since we want to test the REAL logic in a controlled way, 
// we'll point to a temporary test database.

describe('Database Auto-Initialization', () => {
  const testDbPath = path.resolve(__dirname, '../../test-init.db');

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  afterAll(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  test('should create database and tables if not exists', (done) => {
    process.env.DATABASE_URL = `file:${testDbPath}`;
    process.env.NODE_ENV = 'development'; // Force file creation
    
    // Clear cache to re-require and trigger init
    jest.resetModules();
    const db = require('../../src/db/index');

    // Wait for async init (if any) or check after a short delay
    // In current SQLite setup, Database constructor is sync but schema execution might be async.
    // We will improve src/db/index.js to support a promise or callback for init completion.
    
    setTimeout(() => {
      expect(fs.existsSync(testDbPath)).toBe(true);
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='proxy_tasks'", (err, row) => {
        expect(err).toBeNull();
        expect(row).toBeDefined();
        done();
      });
    }, 500);
  });
});
