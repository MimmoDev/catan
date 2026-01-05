const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/catan.db');

if (!fs.existsSync(dbPath)) {
  console.error('Database non trovato. Avvia prima il server con "npm run dev" per creare il database.');
  process.exit(1);
}

const db = new Database(dbPath);

const username = process.argv[2];
const imagePath = process.argv[3]; // es: /uploads/mario.jpg

if (!username || !imagePath) {
  console.error('Usage: node scripts/update-user-image.js <username> <imagePath>');
  console.error('Example: node scripts/update-user-image.js mario /uploads/mario.jpg');
  process.exit(1);
}

// Check if user exists
const user = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
if (!user) {
  console.error(`❌ Utente ${username} non trovato!`);
  db.close();
  process.exit(1);
}

// Check if image file exists
const fullImagePath = path.join(__dirname, '../public', imagePath);
if (!fs.existsSync(fullImagePath)) {
  console.warn(`⚠️  Attenzione: il file ${fullImagePath} non esiste!`);
  console.warn('   Assicurati di aver caricato l\'immagine in public/uploads/');
}

db.prepare(`
  UPDATE users 
  SET image = ? 
  WHERE username = ?
`).run(imagePath, username);

console.log(`✅ Immagine aggiornata per ${username}: ${imagePath}`);
db.close();

