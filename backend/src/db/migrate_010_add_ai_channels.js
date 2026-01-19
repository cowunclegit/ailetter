const db = require('./index');

const channels = [
  { name: 'AI Advantage', type: 'youtube', url: 'UCRJFAp0rewx8kzdhEqDHIlA' },
  { name: 'AI Explained', type: 'youtube', url: 'UCNJ1Ymd5yFuUPtn21xtRbbw' },
  { name: 'Matt Wolfe', type: 'youtube', url: 'UCuK2Mf5As9OKfWU7XV6yzCg' },
  { name: 'Matthew Berman', type: 'youtube', url: 'UCawZsQWqfGSbCI5yjkdVkTA' },
  { name: 'David Shapiro', type: 'youtube', url: 'UCvKRFNawVcuz4b9ihUTApCg' },
  { name: 'Wes Roth', type: 'youtube', url: 'UCqcbQf6yw5KzRoDDcZ_wBSw' }
];

db.serialize(() => {
  const stmt = db.prepare("INSERT INTO sources (name, type, url, reliability_score) SELECT ?, ?, ?, 1.0 WHERE NOT EXISTS (SELECT 1 FROM sources WHERE url = ?)");
  
  let completed = 0;
  
  if (channels.length === 0) {
      db.close();
      return;
  }

  channels.forEach(channel => {
    stmt.run(channel.name, channel.type, channel.url, channel.url, function(err) {
        if (err) {
            console.error(`Error adding ${channel.name}:`, err.message);
        } else if (this.changes > 0) {
            console.log(`Added ${channel.name}`);
        } else {
            console.log(`Skipped ${channel.name} (already exists)`);
        }
        
        completed++;
        if (completed === channels.length) {
            stmt.finalize();
            db.close();
        }
    });
  });
});
