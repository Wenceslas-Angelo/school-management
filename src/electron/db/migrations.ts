import type { Database } from "better-sqlite3";
import { SQL_QUERIES } from "../config/constants.js";
import { db } from "../config/database.js"; // importer l'instance DB

export class MigrationManager {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // Méthode statique qui utilise l'instance DB du singleton
  static async initialize(): Promise<void> {
    const migrationManager = new MigrationManager(db);
    await migrationManager.runInitialization();
  }

  // Méthode d'instance pour les tests avec DB custom
  async initialize(): Promise<void> {
    await this.runInitialization();
  }

  private async runInitialization(): Promise<void> {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        applied_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.runMigrations();
  }

  private async runMigrations() {
    const migrations = [
      { version: 1, sql: SQL_QUERIES.CREATE_CLASS_TABLE },
      { version: 2, sql: SQL_QUERIES.CREATE_STUDENT_TABLE },
      { version: 3, sql: SQL_QUERIES.CREATE_PAYMENT_TABLE },
      { version: 4, sql: SQL_QUERIES.CREATE_INDEXES.join('; ') }
    ];

    const appliedMigrations = new Set(
      this.db.prepare(`SELECT version FROM schema_migrations`).all().map(r => (r as any).version)
    );

    for (const m of migrations) {
      if (!appliedMigrations.has(m.version)) {
        this.db.exec(m.sql);
        this.db.prepare(`INSERT INTO schema_migrations (version) VALUES (?)`).run(m.version);
      }
    }
  }
}