const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/catan.db');

if (!fs.existsSync(dbPath)) {
  console.error('Database non trovato.');
  process.exit(1);
}

const db = new Database(dbPath);

const username = process.argv[2];

if (!username) {
  console.error('Usage: node scripts/delete-user.js <username>');
  process.exit(1);
}

// Check if user exists
const user = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
if (!user) {
  console.error(`❌ Utente ${username} non trovato!`);
  db.close();
  process.exit(1);
}

// Delete user (games will be kept but winner_id will reference a non-existent user)
// If you want to delete games too, uncomment the next line:
// db.prepare('DELETE FROM games WHERE winner_id = ?').run(user.id);

db.prepare('DELETE FROM users WHERE username = ?').run(username);

console.log(`✅ Utente ${username} eliminato con successo!`);
db.close();

