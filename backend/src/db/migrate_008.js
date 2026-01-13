const db = require('./index');

db.serialize(() => {
  // Add thumbnail_url to trend_items
  db.run("ALTER TABLE trend_items ADD COLUMN thumbnail_url TEXT", (err) => {
    if (err) {
      if (err.message.includes("duplicate column name")) {
        console.log("Column thumbnail_url already exists.");
      } else {
        console.error("Error adding thumbnail_url:", err.message);
      }
    } else {
      console.log("Column thumbnail_url added successfully.");
    }
  });
});

db.close();
