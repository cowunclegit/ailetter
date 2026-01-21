const db = require('./index');

db.serialize(() => {
  // Add subject to newsletters
  db.run("ALTER TABLE newsletters ADD COLUMN subject TEXT", (err) => {
    if (err) {
      if (err.message.includes("duplicate column name")) {
        console.log("Column subject already exists.");
      } else {
        console.error("Error adding subject:", err.message);
      }
    } else {
      console.log("Column subject added successfully.");
    }
  });

  // Add introduction_html to newsletters
  db.run("ALTER TABLE newsletters ADD COLUMN introduction_html TEXT", (err) => {
    if (err) {
      if (err.message.includes("duplicate column name")) {
        console.log("Column introduction_html already exists.");
      } else {
        console.error("Error adding introduction_html:", err.message);
      }
    } else {
      console.log("Column introduction_html added successfully.");
    }
  });

  // Add conclusion_html to newsletters
  db.run("ALTER TABLE newsletters ADD COLUMN conclusion_html TEXT", (err) => {
    if (err) {
      if (err.message.includes("duplicate column name")) {
        console.log("Column conclusion_html already exists.");
      } else {
        console.error("Error adding conclusion_html:", err.message);
      }
    } else {
      console.log("Column conclusion_html added successfully.");
    }
  });
});

db.close();
