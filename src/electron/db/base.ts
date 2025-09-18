import { db } from "../config/database.js";
import type { Database } from "better-sqlite3";

export abstract class BaseDAO<T> {
  protected db: Database.Database;
  protected tableName: string;

  constructor(tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  protected executeQuery<R = any>(query: string, params: any[] = []): R[] {
    try {
      return this.db.prepare(query).all(...params) as R[];
    } catch (error) {
      console.error(`Error executing query: ${query}`, error);
      throw error;
    }
  }

  protected executeGet<R = any>(query: string, params: any[] = []): R | undefined {
    try {
      return this.db.prepare(query).get(...params) as R | undefined;
    } catch (error) {
      console.error(`Error executing get query: ${query}`, error);
      throw error;
    }
  }

  protected executeRun(query: string, params: any[] = []): Database.RunResult {
    try {
      return this.db.prepare(query).run(...params);
    } catch (error) {
      console.error(`Error executing run query: ${query}`, error);
      throw error;
    }
  }

  // Méthodes communes
  getAll(): T[] {
    return this.executeQuery(`SELECT * FROM ${this.tableName} ORDER BY id`);
  }

  getById(id: number): T | undefined {
    return this.executeGet(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  delete(id: number): number {
    const result = this.executeRun(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    return result.changes;
  }

  count(): number {
    const result = this.executeGet<{ count: number }>(`SELECT COUNT(*) as count FROM ${this.tableName}`);
    return result?.count ?? 0;
  }
}