const crypto = require('crypto');
const db = require('../db');

class SubscriberModel {
  static create(email) {
    return new Promise((resolve, reject) => {
      const token = crypto.randomBytes(16).toString('hex');
      db.run(
        "INSERT INTO subscribers (email, status, token) VALUES (?, 'active', ?)",
        [email, token],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, email, token });
        }
      );
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM subscribers WHERE email = ?', [email], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
  }

  static unsubscribeByToken(token) {
      return new Promise((resolve, reject) => {
          db.run("UPDATE subscribers SET status = 'unsubscribed', unsubscribed_at = ? WHERE token = ?", [new Date().toISOString(), token], function(err) {
              if (err) reject(err);
              else resolve({ changes: this.changes });
          });
      });
  }

  static getAllActive() {
      return new Promise((resolve, reject) => {
          db.all("SELECT * FROM subscribers WHERE status = 'active'", [], (err, rows) => {
              if (err) reject(err);
              else resolve(rows);
          });
      });
  }
}

module.exports = SubscriberModel;
