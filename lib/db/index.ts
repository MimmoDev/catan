import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Function to find database path (works with standalone build)
function getDbPath(): string {
  // Try multiple possible database paths (for standalone build)
  const possiblePaths = [
    "/app/data/catan.db", // Absolute path for Docker
    path.join(process.cwd(), "data", "catan.db"),
    path.join(process.cwd(), "..", "data", "catan.db"),
    path.resolve(process.cwd(), "data", "catan.db"),
  ];

  // First, try to find existing database
  for (const possiblePath of possiblePaths) {
    const resolvedPath = path.resolve(possiblePath);
    if (fs.existsSync(resolvedPath)) {
      console.log("Database found at:", resolvedPath);
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
  }

  // Create database if it doesn't exist
  if (!fs.existsSync(resolvedPath)) {
    fs.writeFileSync(resolvedPath, "");
  }

  console.log("Database created/using at:", resolvedPath);
  return resolvedPath;
}

const dbPath = getDbPath();
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

// Initialize tables
export function initDb() {
  sqlite.exec(`
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
}

