const db = require('../db');
const { v4: uuidv4 } = require('uuid');

class Subscriber {
  static create({ name, email, is_subscribed = true }) {
    const uuid = uuidv4();
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO subscribers (uuid, name, email, is_subscribed)
        VALUES (?, ?, ?, ?)
      `;
      db.run(sql, [uuid, name, email, is_subscribed ? 1 : 0], function(err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, uuid, name, email, is_subscribed });
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM subscribers WHERE email = ?`;
      db.get(sql, [email], (err, row) => {
        if (err) return reject(err);
        resolve(row ? { ...row, is_subscribed: !!row.is_subscribed } : null);
      });
    });
  }

  static findByUuid(uuid) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM subscribers WHERE uuid = ?`;
      db.get(sql, [uuid], (err, row) => {
        if (err) return reject(err);
        resolve(row ? { ...row, is_subscribed: !!row.is_subscribed } : null);
      });
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM subscribers ORDER BY created_at DESC`;
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.map(row => ({ ...row, is_subscribed: !!row.is_subscribed })));
      });
    });
  }

  static update(id, { name, email, is_subscribed }) {
    return new Promise((resolve, reject) => {
      let fields = [];
      let params = [];

      if (name !== undefined) {
        fields.push('name = ?');
        params.push(name);
      }
      if (email !== undefined) {
        fields.push('email = ?');
        params.push(email);
      }
      if (is_subscribed !== undefined) {
        fields.push('is_subscribed = ?');
        params.push(is_subscribed ? 1 : 0);
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');

      if (fields.length === 1) { // Only updated_at
        return resolve(this.findById(id));
      }

      const sql = `UPDATE subscribers SET ${fields.join(', ')} WHERE id = ?`;
      params.push(id);

      db.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM subscribers WHERE id = ?`;
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row ? { ...row, is_subscribed: !!row.is_subscribed } : null);
      });
    });
  }

  static async addCategory(subscriberId, presetId) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT OR IGNORE INTO subscriber_categories (subscriber_id, preset_id) VALUES (?, ?)`;
      db.run(sql, [subscriberId, presetId], function(err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }

  static async removeCategory(subscriberId, presetId) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM subscriber_categories WHERE subscriber_id = ? AND preset_id = ?`;
      db.run(sql, [subscriberId, presetId], function(err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }

  static async clearCategories(subscriberId) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM subscriber_categories WHERE subscriber_id = ?`;
      db.run(sql, [subscriberId], function(err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }

  static async getCategories(subscriberId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.* FROM ai_subject_presets p
        JOIN subscriber_categories sc ON p.id = sc.preset_id
        WHERE sc.subscriber_id = ?
      `;
      db.all(sql, [subscriberId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = Subscriber;
