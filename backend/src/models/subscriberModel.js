const { v4: uuidv4 } = require('uuid');
const db = require('../db');

class SubscriberModel {
  static create(email) {
    return new Promise((resolve, reject) => {
      const uuid = uuidv4();
      db.run(
        "INSERT INTO subscribers (email, is_subscribed, uuid) VALUES (?, 1, ?)",
        [email, uuid],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, email, uuid, is_subscribed: 1 });
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

  static unsubscribeByToken(uuid) {
      return new Promise((resolve, reject) => {
          db.run("UPDATE subscribers SET is_subscribed = 0, updated_at = CURRENT_TIMESTAMP WHERE uuid = ?", [uuid], function(err) {
              if (err) reject(err);
              else resolve({ changes: this.changes });
          });
      });
  }

  static getAllActive() {
      return new Promise((resolve, reject) => {
          db.all("SELECT * FROM subscribers WHERE is_subscribed = 1", [], (err, rows) => {
              if (err) reject(err);
              else resolve(rows);
          });
      });
  }
}

module.exports = SubscriberModel;