// electron/db/base.ts
import type { Database, RunResult } from "better-sqlite3";

export abstract class BaseDAO<T> {
  protected db: Database;
  protected tableName: string;

  constructor(tableName: string, db: Database) {
    this.db = db;
    this.tableName = tableName;
  }

  protected executeQuery<R = unknown>(query: string, params: unknown[] = []): R[] {
    return this.db.prepare(query).all(...params) as R[];
  }

  protected executeGet<R = unknown>(query: string, params: unknown[] = []): R | undefined {
    return this.db.prepare(query).get(...params) as R | undefined;
  }

  protected executeRun(query: string, params: unknown[] = []): RunResult {
    return this.db.prepare(query).run(...params);
  }

  getAll(): T[] {
    return this.executeQuery(`SELECT * FROM ${this.tableName} ORDER BY id`);
  }

  getById(id: number): T | undefined {
    return this.executeGet(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  delete(id: number): number {
    return this.executeRun(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]).changes;
  }

  count(): number {
    const result = this.executeGet<{ count: number }>(`SELECT COUNT(*) as count FROM ${this.tableName}`);
    return result?.count ?? 0;
  }
}

