const db = require('../db');

class TrendItemModel {
  static getAll(options = {}) {
    const { limit = 100, aiSelectedOnly = false, startDate, endDate } = options;
    
    // Default to 28 days ago if no startDate provided
    let effectiveStartDate = startDate;
    if (!effectiveStartDate) {
      const d = new Date();
      d.setDate(d.getDate() - 28);
      effectiveStartDate = d.toISOString();
    }

    let query = `
      SELECT t.*, s.name as source_name, s.type as source_type,
             MAX(CASE WHEN n.status = 'sent' THEN 2 WHEN n.status = 'draft' THEN 1 ELSE 0 END) as status_level
      FROM trend_items t
      LEFT JOIN sources s ON t.source_id = s.id
      LEFT JOIN newsletter_items ni ON t.id = ni.trend_item_id
      LEFT JOIN newsletters n ON ni.newsletter_id = n.id
    `;
    const params = [];
    const conditions = [];

    if (aiSelectedOnly) {
      conditions.push('t.ai_selected = 1');
    }

    if (effectiveStartDate) {
      conditions.push('t.published_at >= ?');
      params.push(effectiveStartDate);
    }

    if (endDate) {
      conditions.push('t.published_at <= ?');
      params.push(endDate);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY t.id ORDER BY t.published_at DESC LIMIT ?';
    params.push(limit);

    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else {
          const formattedRows = rows.map(row => {
            let status = 'available';
            if (row.status_level === 2) status = 'sent';
            else if (row.status_level === 1) status = 'draft';

            return {
              ...row,
              status,
              is_duplicate: row.status_level === 2,
              ai_selected: !!row.ai_selected
            };
          });
          resolve(formattedRows);
        }
      });
    });
  }

  static create(item) {
    const { source_id, title, original_url, published_at, summary, thumbnail_url } = item;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO trend_items (source_id, title, original_url, published_at, summary, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?)',
        [source_id, title, original_url, published_at, summary, thumbnail_url],
        function (err) {
          if (err) {
            // Ignore unique constraint violations (duplicates) gracefully
            if (err.message.includes('UNIQUE constraint failed')) {
              resolve(null); 
            } else {
              reject(err);
            }
          } else {
            resolve({ id: this.lastID, ...item });
          }
        }
      );
    });
  }

  static updateAiSelection(id, selected) {
      return new Promise((resolve, reject) => {
          db.run('UPDATE trend_items SET ai_selected = ? WHERE id = ?', [selected ? 1 : 0, id], function(err) {
              if (err) reject(err);
              else resolve({ changes: this.changes });
          });
      });
  }
}

module.exports = TrendItemModel;