const db = require('../db');

class SourceModel {
  static getAll(categoryId) {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT s.*, GROUP_CONCAT(c.name) as category_names, GROUP_CONCAT(c.id) as category_ids
        FROM sources s 
        LEFT JOIN source_categories sc ON s.id = sc.source_id
        LEFT JOIN categories c ON sc.category_id = c.id
      `;
      const params = [];
      const conditions = [];
      
      if (categoryId) {
        conditions.push('sc.category_id = ?');
        params.push(categoryId);
      }
      
      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }
      
      sql += ' GROUP BY s.id';
      
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else {
          const formatted = rows.map(row => ({
            ...row,
            category_names: row.category_names ? row.category_names.split(',') : [],
            category_ids: row.category_ids ? row.category_ids.split(',').map(Number) : []
          }));
          resolve(formatted);
        }
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT s.*, GROUP_CONCAT(c.name) as category_names, GROUP_CONCAT(c.id) as category_ids
        FROM sources s 
        LEFT JOIN source_categories sc ON s.id = sc.source_id
        LEFT JOIN categories c ON sc.category_id = c.id
        WHERE s.id = ?
        GROUP BY s.id
      `;
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else {
          resolve({
            ...row,
            category_names: row.category_names ? row.category_names.split(',') : [],
            category_ids: row.category_ids ? row.category_ids.split(',').map(Number) : []
          });
        }
      });
    });
  }

  static create(source) {
    const { name, type, url, reliability_score = 1.0, categoryIds = [] } = source;
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run(
          'INSERT INTO sources (name, type, url, reliability_score) VALUES (?, ?, ?, ?)',
          [name, type, url, reliability_score],
          function (err) {
            if (err) {
              db.run('ROLLBACK');
              return reject(err);
            }
            const sourceId = this.lastID;
            
            if (categoryIds.length === 0) {
              db.run('COMMIT');
              return resolve({ id: sourceId, ...source });
            }

            const stmt = db.prepare('INSERT INTO source_categories (source_id, category_id) VALUES (?, ?)');
            categoryIds.forEach(catId => {
              stmt.run(sourceId, catId);
            });
            stmt.finalize(err => {
              if (err) {
                db.run('ROLLBACK');
                reject(err);
              } else {
                db.run('COMMIT');
                resolve({ id: sourceId, ...source });
              }
            });
          }
        );
      });
    });
  }

  static update(id, source) {
    const { name, url, reliability_score, categoryIds } = source;
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        // 1. Update basic info
        const updates = [];
        const params = [];
        if (name !== undefined) { updates.push('name = ?'); params.push(name); }
        if (url !== undefined) { updates.push('url = ?'); params.push(url); }
        if (reliability_score !== undefined) { updates.push('reliability_score = ?'); params.push(reliability_score); }
        
        const updateBasic = () => {
          if (updates.length > 0) {
            params.push(id);
            return new Promise((res, rej) => {
              db.run(`UPDATE sources SET ${updates.join(', ')} WHERE id = ?`, params, function(err) {
                if (err) rej(err);
                else res();
              });
            });
          }
          return Promise.resolve();
        };

        const updateCategories = async () => {
          if (categoryIds !== undefined) {
            await new Promise((res, rej) => {
              db.run('DELETE FROM source_categories WHERE source_id = ?', [id], (err) => {
                if (err) rej(err); else res();
              });
            });
            
            if (categoryIds.length > 0) {
              const stmt = db.prepare('INSERT INTO source_categories (source_id, category_id) VALUES (?, ?)');
              for (const catId of categoryIds) {
                stmt.run(id, catId);
              }
              await new Promise((res, rej) => stmt.finalize(err => err ? rej(err) : res()));
            }
          }
        };

        updateBasic()
          .then(updateCategories)
          .then(() => {
            db.run('COMMIT');
            resolve({ id, changes: 1 });
          })
          .catch(err => {
            db.run('ROLLBACK');
            reject(err);
          });
      });
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
