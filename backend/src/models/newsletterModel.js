const db = require('../db');

class NewsletterModel {
  static async createDraft(itemIds) {
    // 1. Validate that all trend items exist
    const placeholders = itemIds.map(() => '?').join(',');
    const existingItems = await new Promise((resolve, reject) => {
      db.all(`SELECT id FROM trend_items WHERE id IN (${placeholders})`, itemIds, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (existingItems.length !== itemIds.length) {
      throw new Error('One or more item_ids are invalid.');
    }
    
    // 2. Create the newsletter draft
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION;");

        // Overwrite: delete existing draft and its items
        db.run("DELETE FROM newsletter_items WHERE newsletter_id IN (SELECT id FROM newsletters WHERE status = 'draft')");
        db.run("DELETE FROM newsletters WHERE status = 'draft'");

        const issueDate = new Date().toISOString().split('T')[0];
        db.run(
          "INSERT INTO newsletters (issue_date, status) VALUES (?, 'draft')",
          [issueDate],
          function (err) {
            if (err) {
              db.run("ROLLBACK;");
              return reject(err);
            }
            
            const newsletterId = this.lastID;
            const stmt = db.prepare("INSERT INTO newsletter_items (newsletter_id, trend_item_id, display_order) VALUES (?, ?, ?)");
            
            itemIds.forEach((id, index) => {
              stmt.run(newsletterId, id, index);
            });

            stmt.finalize((err) => {
              if (err) {
                db.run("ROLLBACK;");
                return reject(err);
              }
              db.run("COMMIT;");
              resolve({ id: newsletterId, status: 'draft', item_ids: itemIds });
            });
          }
        );
      });
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT n.*, t.id as trend_id, t.title, t.summary, t.original_url, t.published_at, s.name as source_name, ni.display_order
        FROM newsletters n
        LEFT JOIN newsletter_items ni ON n.id = ni.newsletter_id
        LEFT JOIN trend_items t ON ni.trend_item_id = t.id
        LEFT JOIN sources s ON t.source_id = s.id
        WHERE n.id = ?
        ORDER BY ni.display_order ASC
      `;
      db.all(query, [id], (err, rows) => {
        if (err) reject(err);
        else if (rows.length === 0) resolve(null);
        else {
          const newsletter = {
            id: rows[0].id,
            issue_date: rows[0].issue_date,
            status: rows[0].status,
            confirmation_uuid: rows[0].confirmation_uuid,
            created_at: rows[0].created_at,
            sent_at: rows[0].sent_at,
            items: rows.filter(r => r.trend_id).map(r => ({
              id: r.trend_id,
              title: r.title,
              summary: r.summary,
              original_url: r.original_url,
              published_at: r.published_at,
              source_name: r.source_name,
              display_order: r.display_order
            }))
          };
          resolve(newsletter);
        }
      });
    });
  }

  static async updateItemOrder(id, itemOrders) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION;");
        
        const stmt = db.prepare("UPDATE newsletter_items SET display_order = ? WHERE newsletter_id = ? AND trend_item_id = ?");
        
        itemOrders.forEach(({ trend_item_id, display_order }) => {
          stmt.run(display_order, id, trend_item_id);
        });

        stmt.finalize((err) => {
          if (err) {
            db.run("ROLLBACK;");
            return reject(err);
          }
          db.run("COMMIT;");
          resolve(true);
        });
      });
    });
  }

  static async toggleItem(newsletterId, trendItemId) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION;");

        db.get(
          "SELECT * FROM newsletter_items WHERE newsletter_id = ? AND trend_item_id = ?",
          [newsletterId, trendItemId],
          (err, row) => {
            if (err) {
              db.run("ROLLBACK;");
              return reject(err);
            }

            if (row) {
              // Exists, so remove
              db.run(
                "DELETE FROM newsletter_items WHERE newsletter_id = ? AND trend_item_id = ?",
                [newsletterId, trendItemId],
                (err) => {
                  if (err) {
                    db.run("ROLLBACK;");
                    return reject(err);
                  }
                  db.run("COMMIT;");
                  resolve({ action: 'removed' });
                }
              );
            } else {
              // Doesn't exist, so add
              // Get current max display_order
              db.get(
                "SELECT COALESCE(MAX(display_order), -1) as max_order FROM newsletter_items WHERE newsletter_id = ?",
                [newsletterId],
                (err, row) => {
                  if (err) {
                    db.run("ROLLBACK;");
                    return reject(err);
                  }
                  const nextOrder = (row ? row.max_order : -1) + 1;
                  db.run(
                    "INSERT INTO newsletter_items (newsletter_id, trend_item_id, display_order) VALUES (?, ?, ?)",
                    [newsletterId, trendItemId, nextOrder],
                    (err) => {
                      if (err) {
                        db.run("ROLLBACK;");
                        return reject(err);
                      }
                      db.run("COMMIT;");
                      resolve({ action: 'added' });
                    }
                  );
                }
              );
            }
          }
        );
      });
    });
  }

  static async updateConfirmationUuid(id, uuid) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE newsletters SET confirmation_uuid = ? WHERE id = ?",
        [uuid, id],
        function (err) {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  static async getByUuid(uuid) {
    return new Promise((resolve, reject) => {
      db.get("SELECT id FROM newsletters WHERE confirmation_uuid = ?", [uuid], (err, row) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else resolve(this.getById(row.id));
      });
    });
  }

  static async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const sentAt = status === 'sent' ? new Date().toISOString() : null;
      db.run(
        "UPDATE newsletters SET status = ?, sent_at = COALESCE(?, sent_at) WHERE id = ?",
        [status, sentAt, id],
        function (err) {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  static async getActiveDraft() {
    return new Promise((resolve, reject) => {
      db.get("SELECT id FROM newsletters WHERE status = 'draft'", (err, row) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else resolve(this.getById(row.id));
      });
    });
  }

  static async confirmAndSend(uuid) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION;");

        db.get(
          "SELECT id, status, created_at FROM newsletters WHERE confirmation_uuid = ?",
          [uuid],
          (err, row) => {
            if (err) {
              db.run("ROLLBACK;");
              return reject(err);
            }
            if (!row) {
              db.run("ROLLBACK;");
              return resolve({ error: 'not_found' });
            }
            if (row.status !== 'draft') {
              db.run("ROLLBACK;");
              return resolve({ error: 'already_processed' });
            }

            // Expiration check (24h)
            const created = new Date(row.created_at);
            const now = new Date();
            if (now - created > 24 * 60 * 60 * 1000) {
              db.run("ROLLBACK;");
              return resolve({ error: 'expired' });
            }

            db.run(
              "UPDATE newsletters SET status = 'sending' WHERE id = ?",
              [row.id],
              (err) => {
                if (err) {
                  db.run("ROLLBACK;");
                  return reject(err);
                }
                db.run("COMMIT;");
                resolve({ id: row.id });
              }
            );
          }
        );
      });
    });
  }

  static async getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT n.*, COUNT(ni.trend_item_id) as item_count 
        FROM newsletters n
        LEFT JOIN newsletter_items ni ON n.id = ni.newsletter_id
        GROUP BY n.id
        ORDER BY n.id DESC
      `;
      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = NewsletterModel;