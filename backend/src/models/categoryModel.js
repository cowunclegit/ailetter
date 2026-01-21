const db = require('../db');

class CategoryModel {
  static getAll() {
    return new Promise((resolve, reject) => {
      // Exclude soft-deleted categories from the list (used for filters/assignment)
      db.all('SELECT * FROM categories WHERE is_deleted = 0 ORDER BY name ASC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM categories WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(category) {
    const { name } = category;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO categories (name) VALUES (?)',
        [name],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...category });
        }
      );
    });
  }

  static update(id, category) {
    const { name } = category;
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, id],
        function (err) {
          if (err) reject(err);
          else resolve({ id, changes: this.changes });
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      // Soft delete
      db.run('UPDATE categories SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }
}

module.exports = CategoryModel;