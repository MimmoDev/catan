const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/catan.db');

if (!fs.existsSync(dbPath)) {
  console.error('Database non trovato.');
  process.exit(1);
}

const db = new Database(dbPath);

const users = db.prepare('SELECT id, username, image FROM users ORDER BY username').all();

if (users.length === 0) {
  console.log('Nessun utente trovato nel database.');
} else {
  console.log('\n📋 Utenti nel database:\n');
  users.forEach((user) => {
    console.log(`  ID: ${user.id} | Username: "${user.username}" | Immagine: ${user.image || 'Nessuna'}`);
  });
  console.log(`\nTotale: ${users.length} utente${users.length !== 1 ? 'i' : ''}\n`);
}

db.close();


