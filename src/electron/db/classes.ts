import { BaseDAO } from "./base.js";
import { TABLE_NAMES } from "../config/constants.js";
import type { Class } from "../../types/class.js";
import type { Database as DBType } from "better-sqlite3";

export class ClassDAO extends BaseDAO<Class> {
  constructor(db: DBType) {
    super(TABLE_NAMES.CLASSES, db);
  }

  getAll(): Class[] {
    return this.executeQuery("SELECT * FROM classes ORDER BY name, section");
  }

  add(cls: Omit<Class, 'id'>): number {
    if (this.exists(cls.name, cls.section? cls.section : null)) {
      throw new Error('Class with this name and section already exists');
    }

    const result = this.executeRun(
      `INSERT INTO ${this.tableName} (name, section) VALUES (?, ?)`,
      [cls.name, cls.section]
    );
    return result.lastInsertRowid as number;
  }



  update(cls: Class): number {
    const result = this.executeRun(
      `UPDATE ${this.tableName} 
       SET name = ?, section = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [cls.name, cls.section, cls.id]
    );
    return result.changes;
  }

  getWithStudentCount(): Array<Class & { studentCount: number }> {
    return this.executeQuery(`
      SELECT c.*, COUNT(s.id) as studentCount
      FROM ${this.tableName} c
      LEFT JOIN ${TABLE_NAMES.STUDENTS} s ON s.classId = c.id
      GROUP BY c.id
      ORDER BY c.name, c.section
    `);
  }

  exists(name: string, section: string | null): boolean {
    const result = this.executeGet(
      `SELECT 1 FROM ${this.tableName} WHERE name = ? AND section IS ?`,
      [name, section]
    );
    return !!result;
  }
}

export const classDAO = (db: DBType) => new ClassDAO(db);
