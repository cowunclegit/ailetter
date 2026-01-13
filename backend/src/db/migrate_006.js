const db = require('./index');

db.serialize(() => {
  // Add confirmation_uuid to newsletters
  db.run("ALTER TABLE newsletters ADD COLUMN confirmation_uuid TEXT", (err) => {
    if (err) {
      if (err.message.includes("duplicate column name")) {
        console.log("Column confirmation_uuid already exists.");
      } else {
        console.error("Error adding confirmation_uuid:", err.message);
      }
    } else {
      console.log("Column confirmation_uuid added successfully.");
    }
  });

  // Note: SQLite doesn't support ALTER TABLE to change constraints.
  // The 'sending' status will be allowed by application logic, 
  // though the DB check constraint might complain if strictly enforced.
  // Usually, SQLite allows it if not explicitly re-validated.
});

db.close();
