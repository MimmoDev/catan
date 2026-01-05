const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/catan.db');

if (!fs.existsSync(dbPath)) {
  console.log('Database non trovato. Verrà creato al primo avvio.');
  process.exit(0);
}

const db = new Database(dbPath);

console.log('Migrazione database in corso...');

try {
  // Check if table exists
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='game_participants'
  `).get();

  if (!tableExists) {
    console.log('Creazione tabella game_participants...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS game_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        score INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE INDEX IF NOT EXISTS idx_game_participants_game ON game_participants(game_id);
      CREATE INDEX IF NOT EXISTS idx_game_participants_user ON game_participants(user_id);
    `);
    console.log('✅ Tabella game_participants creata con successo!');
  } else {
    console.log('✅ Tabella game_participants già esistente.');
  }

  console.log('✅ Migrazione completata!');
} catch (error) {
  console.error('❌ Errore durante la migrazione:', error);
  process.exit(1);
} finally {
  db.close();
}

