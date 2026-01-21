const db = require('../../src/db');
const fs = require('fs');
const path = require('path');

describe('Database Schema Validation', () => {
  test('proxy_tasks table should exist', (done) => {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='proxy_tasks'", (err, row) => {
      expect(err).toBeNull();
      expect(row).toBeDefined();
      expect(row.name).toBe('proxy_tasks');
      done();
    });
  });

  test('ai_subject_presets should have default entries', (done) => {
    db.all("SELECT name FROM ai_subject_presets", (err, rows) => {
      expect(err).toBeNull();
      const names = rows.map(r => r.name);
      expect(names).toContain('Standard Trend Summary');
      expect(names).toContain('SW Developer Focus');
      done();
    });
  });

  test('proxy_tasks should have required columns', (done) => {
    db.all("PRAGMA table_info(proxy_tasks)", (err, rows) => {
      expect(err).toBeNull();
      const columnNames = rows.map(r => r.name);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('status');
      expect(columnNames).toContain('sources');
      expect(columnNames).toContain('created_at');
      expect(columnNames).toContain('updated_at');
      done();
    });
  });
});
