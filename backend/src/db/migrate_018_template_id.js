const db = require('./index');

db.serialize(() => {
  // Add template_id to newsletters
  db.run("ALTER TABLE newsletters ADD COLUMN template_id TEXT DEFAULT 'classic-list'", (err) => {
    if (err) {
      if (err.message.includes("duplicate column name")) {
        console.log("Column template_id already exists.");
      } else {
        console.error("Error adding template_id:", err.message);
      }
    } else {
      console.log("Column template_id added successfully with default 'classic-list'.");
    }
  });
});

db.close();
