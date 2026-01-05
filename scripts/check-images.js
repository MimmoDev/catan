const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/catan.db');
const uploadsPath = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(dbPath)) {
  console.error('Database non trovato.');
  process.exit(1);
}

const db = new Database(dbPath);

console.log('📸 Immagini nella cartella uploads:');
const files = fs.readdirSync(uploadsPath).filter(f => !f.startsWith('.'));
files.forEach(file => {
  console.log(`  - ${file}`);
});

console.log('\n👥 Utenti nel database:');
const users = db.prepare('SELECT id, username, image FROM users').all();
users.forEach(user => {
  console.log(`  - ${user.username}: ${user.image || 'NESSUN IMMAGINE'}`);
});

console.log('\n🔍 Verifica corrispondenze:');
files.forEach(file => {
  const username = file.split('.')[0];
  const capitalized = username.charAt(0).toUpperCase() + username.slice(1);
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  
  if (user) {
    const expectedPath = `/uploads/${file}`;
    if (user.image === expectedPath) {
      console.log(`  ✅ ${user.username}: ${user.image}`);
    } else {
      console.log(`  ⚠️  ${user.username}: ${user.image || 'NULL'} (dovrebbe essere ${expectedPath})`);
    }
  } else {
    console.log(`  ❌ File ${file} non corrisponde a nessun utente`);
  }
});

db.close();

