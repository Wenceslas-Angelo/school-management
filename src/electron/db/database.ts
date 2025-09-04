import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, "school.db");

// Créer le fichier si il n'existe pas
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, "");
}

// Connexion SQLite
export const db = new Database(dbPath);

// Création des tables si elles n'existent pas
db.exec(`
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  birthDate TEXT,
  className TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);
`);

console.log("✅ Database initialized");
