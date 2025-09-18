import { db } from "../config/database.js";
import { SQL_QUERIES } from "../config/constants.js";

export class MigrationManager {
  private static readonly MIGRATION_TABLE = 'schema_migrations';

  static async initialize(): Promise<void> {
    // Table des migrations
    db.exec(`
      CREATE TABLE IF NOT EXISTS ${this.MIGRATION_TABLE} (
        version INTEGER PRIMARY KEY,
        applied_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.runMigrations();
  }

  private static async runMigrations(): Promise<void> {
    const migrations = [
      { version: 1, sql: SQL_QUERIES.CREATE_CLASS_TABLE },
      { version: 2, sql: SQL_QUERIES.CREATE_STUDENT_TABLE },
      { version: 3, sql: SQL_QUERIES.CREATE_PAYMENT_TABLE },
      { version: 4, sql: SQL_QUERIES.CREATE_INDEXES.join('; ') }
    ];

    const appliedMigrations = new Set(
      db.prepare(`SELECT version FROM ${this.MIGRATION_TABLE}`)
        .all()
        .map(row => (row as any).version)
    );

    for (const migration of migrations) {
      if (!appliedMigrations.has(migration.version)) {
        console.log(`Running migration ${migration.version}...`);
        
        db.exec(migration.sql);
        
        db.prepare(`INSERT INTO ${this.MIGRATION_TABLE} (version) VALUES (?)`)
          .run(migration.version);
        
        console.log(`Migration ${migration.version} completed`);
      }
    }
  }
}