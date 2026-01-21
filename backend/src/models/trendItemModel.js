const db = require('../db');

class TrendItemModel {
  static getAll(options = {}) {
    const { limit = 100, aiSelectedOnly = false, startDate, endDate, categoryIds, offset = 0 } = options;
    
    // Default to 28 days ago if no startDate provided
    let effectiveStartDate = startDate;
    if (!effectiveStartDate) {
      const d = new Date();
      d.setDate(d.getDate() - 28);
      effectiveStartDate = d.toISOString();
    }

    let query = `
      SELECT t.*, s.name as source_name, s.type as source_type,
             MAX(CASE WHEN n.status = 'sent' THEN 2 WHEN n.status = 'draft' THEN 1 ELSE 0 END) as status_level,
             GROUP_CONCAT(DISTINCT c.name) as category_names,
             GROUP_CONCAT(DISTINCT c.id) as category_ids
      FROM trend_items t
      LEFT JOIN sources s ON t.source_id = s.id
      LEFT JOIN newsletter_items ni ON t.id = ni.trend_item_id
      LEFT JOIN newsletters n ON ni.newsletter_id = n.id
      LEFT JOIN trend_item_tags tit ON t.id = tit.trend_item_id
      LEFT JOIN categories c ON tit.category_id = c.id AND c.is_deleted = 0
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

    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      const placeholders = categoryIds.map(() => '?').join(',');
      conditions.push(`t.id IN (SELECT trend_item_id FROM trend_item_tags WHERE category_id IN (${placeholders}))`);
      params.push(...categoryIds);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` GROUP BY t.id ORDER BY t.published_at DESC, t.id DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

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
              ai_selected: !!row.ai_selected,
              category_names: row.category_names ? row.category_names.split(',') : [],
              category_ids: row.category_ids ? row.category_ids.split(',').map(Number) : []
            };
          });
          resolve(formattedRows);
        }
      });
    });
  }

  static create(item) {
    const { source_id, title, original_url, published_at, summary, thumbnail_url, categoryIds = [] } = item;
    
    // Ensure published_at is in ISO8601 format for consistent sorting
    const formattedDate = new Date(published_at).toISOString();

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        db.run(
          'INSERT INTO trend_items (source_id, title, original_url, published_at, summary, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?)',
          [source_id, title, original_url, formattedDate, summary, thumbnail_url],
          function (err) {
            let trendItemId;
            if (err) {
              if (err.message.includes('UNIQUE constraint failed')) {
                // Item exists, get its ID to update tags
                db.get('SELECT id FROM trend_items WHERE original_url = ?', [original_url], (getErr, row) => {
                  if (getErr) {
                    db.run('ROLLBACK');
                    return reject(getErr);
                  }
                  trendItemId = row.id;
                  updateTags(trendItemId);
                });
                return;
              } else {
                db.run('ROLLBACK');
                return reject(err);
              }
            } else {
              trendItemId = this.lastID;
              updateTags(trendItemId);
            }

            function updateTags(id) {
              if (categoryIds.length === 0) {
                db.run('COMMIT');
                return resolve({ id, ...item });
              }

              // Use INSERT OR IGNORE for tags to avoid duplicates if re-collecting
              const stmt = db.prepare('INSERT OR IGNORE INTO trend_item_tags (trend_item_id, category_id) VALUES (?, ?)');
              categoryIds.forEach(catId => {
                stmt.run(id, catId);
              });
              stmt.finalize(err => {
                if (err) {
                  db.run('ROLLBACK');
                  reject(err);
                } else {
                  db.run('COMMIT');
                  resolve({ id, ...item });
                }
              });
            }
          }
        );
      });
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