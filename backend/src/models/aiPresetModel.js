const db = require('../db');

class AiPresetModel {
  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM ai_subject_presets ORDER BY created_at DESC, id DESC", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM ai_subject_presets WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async create(data) {
    const { name, prompt_template, is_default = 0 } = data;
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO ai_subject_presets (name, prompt_template, is_default) VALUES (?, ?, ?)",
        [name, prompt_template, is_default],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...data });
        }
      );
    });
  }

  static async update(id, data) {
    const { name, prompt_template } = data;
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE ai_subject_presets SET name = ?, prompt_template = ? WHERE id = ?",
        [name, prompt_template, id],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      // Protection against deleting default presets
      db.run(
        "DELETE FROM ai_subject_presets WHERE id = ? AND is_default = 0",
        [id],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        }
      );
    });
  }
}

module.exports = AiPresetModel;
