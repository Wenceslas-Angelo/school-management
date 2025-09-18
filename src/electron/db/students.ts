import { BaseDAO } from "./base.js";
import { TABLE_NAMES } from "../config/constants.js";
import type { Student } from "../../types/student.js";

export class StudentDAO extends BaseDAO<Student> {
  constructor() {
    super(TABLE_NAMES.STUDENTS);
  }

  add(student: Omit<Student, 'id' | 'createdAt'>): number {
    const result = this.executeRun(
      `INSERT INTO ${this.tableName} (firstName, lastName, birthDate, sex, classId) 
       VALUES (?, ?, ?, ?, ?)`,
      [student.firstName, student.lastName, student.birthDate, student.sex, student.classId]
    );
    return result.lastInsertRowid as number;
  }

  update(student: Student): number {
    const result = this.executeRun(
      `UPDATE ${this.tableName} 
       SET firstName = ?, lastName = ?, birthDate = ?, sex = ?, classId = ?, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [student.firstName, student.lastName, student.birthDate, student.sex, student.classId, student.id]
    );
    return result.changes;
  }

  getByClassId(classId: number): Student[] {
    return this.executeQuery(
      `SELECT * FROM ${this.tableName} WHERE classId = ? ORDER BY lastName, firstName`,
      [classId]
    );
  }

  search(query: string, limit: number = 50): Student[] {
    const searchTerm = `%${query.replace(/%/g, "\\%")}%`;
    return this.executeQuery(
      `SELECT * FROM ${this.tableName} 
       WHERE firstName LIKE ? OR lastName LIKE ? 
          OR (firstName || ' ' || lastName) LIKE ?
          OR (lastName || ' ' || firstName) LIKE ?
       ORDER BY lastName, firstName
       LIMIT ?`,
      [searchTerm, searchTerm, searchTerm, searchTerm, limit]
    );
  }

  getWithClassInfo(): Array<Student & { className?: string; classSection?: string }> {
    return this.executeQuery(`
      SELECT s.*, c.name as className, c.section as classSection
      FROM ${this.tableName} s
      LEFT JOIN ${TABLE_NAMES.CLASSES} c ON s.classId = c.id
      ORDER BY s.lastName, s.firstName
    `);
  }
}

export const studentDAO = new StudentDAO();
