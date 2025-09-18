import DatabaseConstructor, { Database as DBType } from "better-sqlite3";
import { MigrationManager } from "../db/migrations.js";

export class TestDB {
  db: DBType; // ✅ le type correct

  constructor() {
    // DB en mémoire
    this.db = new DatabaseConstructor(":memory:");
  }

  async init() {
    const migrationManager = new MigrationManager(this.db);
    await migrationManager.initialize();
  }

  close() {
    this.db.close();
  }
}
