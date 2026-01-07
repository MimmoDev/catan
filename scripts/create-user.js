const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Function to find database path (works with standalone build and Docker)
function getDbPath() {
  // Try multiple possible database paths (for standalone build and Docker)
  const possiblePaths = [
    '/app/data/catan.db', // Absolute path for Docker
    path.join(process.cwd(), 'data', 'catan.db'),
    path.join(process.cwd(), '..', 'data', 'catan.db'),
    path.join(__dirname, '..', 'data', 'catan.db'),
    path.resolve(process.cwd(), 'data', 'catan.db'),
  ];

  // First, try to find existing database
  for (const possiblePath of possiblePaths) {
    const resolvedPath = path.resolve(possiblePath);
    if (fs.existsSync(resolvedPath)) {
      console.log('Database trovato a:', resolvedPath);
      return resolvedPath;
    }
  }

  // If not found, use the first path and create it
  const defaultPath = possiblePaths[0];
  const resolvedPath = path.resolve(defaultPath);
  const dbDir = path.dirname(resolvedPath);
  
  // Ensure data directory exists
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('Cartella data creata a:', dbDir);
  }

  console.log('Database verrà creato a:', resolvedPath);
  return resolvedPath;
}

const dbPath = getDbPath();
const db = new Database(dbPath);

// Initialize database tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    image TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    winner_id INTEGER NOT NULL,
    location TEXT NOT NULL,
    played_at INTEGER NOT NULL DEFAULT (unixepoch()),
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (winner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS game_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_games_winner ON games(winner_id);
  CREATE INDEX IF NOT EXISTS idx_games_played_at ON games(played_at);
  CREATE INDEX IF NOT EXISTS idx_game_participants_game ON game_participants(game_id);
  CREATE INDEX IF NOT EXISTS idx_game_participants_user ON game_participants(user_id);
`);

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


