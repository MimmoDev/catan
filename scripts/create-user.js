const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/catan.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  console.error('Database non trovato. Avvia prima il server con "npm run dev" per creare il database.');
  process.exit(1);
}

const db = new Database(dbPath);

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.error('Usage: node scripts/create-user.js <username> <password>');
  process.exit(1);
}

// Check if user already exists
const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
if (existing) {
  console.error(`Utente ${username} già esistente!`);
  db.close();
  process.exit(1);
}

const hashedPassword = bcrypt.hashSync(password, 10);

db.prepare(`
  INSERT INTO users (username, password, image)
  VALUES (?, ?, NULL)
`).run(username, hashedPassword);

console.log(`✅ Utente ${username} creato con successo!`);
db.close();

