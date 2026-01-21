const db = require('./index');

db.serialize(() => {
  // Create ai_subject_presets table
  db.run(`
    CREATE TABLE IF NOT EXISTS ai_subject_presets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      prompt_template TEXT NOT NULL,
      is_default BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("Error creating ai_subject_presets table:", err.message);
    } else {
      console.log("Table ai_subject_presets created or already exists.");
      
      // Seed default presets
      const defaults = [
        {
          name: 'For Leaders',
          prompt_template: 'You are a senior executive assistant. Based on the following articles, suggest a professional and high-level newsletter subject line that would appeal to CEOs and decision-makers:\n\n${contentList}',
          is_default: 1
        },
        {
          name: 'For Developers',
          prompt_template: 'You are a technical lead. Based on the following technical articles, suggest a concise and informative newsletter subject line for a developer audience. Use technical terminology where appropriate:\n\n${contentList}',
          is_default: 1
        }
      ];

      const stmt = db.prepare("INSERT OR IGNORE INTO ai_subject_presets (name, prompt_template, is_default) VALUES (?, ?, ?)");
      defaults.forEach(preset => {
        stmt.run(preset.name, preset.prompt_template, preset.is_default);
      });
      stmt.finalize(() => {
        console.log("Seeding complete.");
        db.close();
      });
    }
  });
});
