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
CREATE TABLE IF NOT EXISTS class (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  section TEXT,                  -- "A", "B" ou NULL
  UNIQUE(name, section)
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  birthDate TEXT,
  sex TEXT,                      -- "M" ou "F"
  classId INTEGER,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(classId) REFERENCES class(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  months TEXT NOT NULL,          -- ex: "2025-09,2025-10"
  description TEXT,
  FOREIGN KEY(studentId) REFERENCES students(id) ON DELETE CASCADE
);
`);

console.log("✅ Database initialized");
