const db = require('../db');

class SourceModel {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM sources', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM sources WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(source) {
    const { name, type, url, reliability_score = 1.0 } = source;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO sources (name, type, url, reliability_score) VALUES (?, ?, ?, ?)',
        [name, type, url, reliability_score],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...source });
        }
      );
    });
  }

  static delete(id) {
      return new Promise((resolve, reject) => {
          db.run('DELETE FROM sources WHERE id = ?', [id], function(err) {
              if (err) reject(err);
              else resolve({ changes: this.changes });
          });
      });
  }
}

module.exports = SourceModel;