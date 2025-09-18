import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { isDev } from "../utils/env.js";

class DatabaseManager {
  private static instance: Database.Database;
  private static readonly DB_PATH = path.join(
    process.cwd(), 
    isDev() ? "data" : "userData", 
    "school.db"
  );

  static getInstance(): Database.Database {
    if (!this.instance) {
      this.ensureDirectoryExists();
      this.instance = new Database(this.DB_PATH, {
        verbose: isDev() ? console.log : undefined
      });
      this.configure();
    }
    return this.instance;
  }

  private static ensureDirectoryExists(): void {
    const dir = path.dirname(this.DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private static configure(): void {
    // Optimisations SQLite
    this.instance.pragma('journal_mode = WAL');
    this.instance.pragma('synchronous = NORMAL');
    this.instance.pragma('cache_size = 1000');
    this.instance.pragma('temp_store = MEMORY');
    
    // Foreign keys
    this.instance.pragma('foreign_keys = ON');
  }

  static close(): void {
    if (this.instance) {
      this.instance.close();
    }
  }
}

export const db = DatabaseManager.getInstance();
export { DatabaseManager };