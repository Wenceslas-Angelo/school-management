import { db } from "./database.js";
import type { Student } from "../../types/student.js";

export const StudentDB = {
  getAll(): Student[] {
    return db.prepare("SELECT * FROM students").all() as Student[];
  },

  getById(id: number): Student | undefined {
    return db.prepare("SELECT * FROM students WHERE id = ?").get(id) as
      | Student
      | undefined;
  },

  getByClassId(classId: number): Student[] {
    return db.prepare("SELECT * FROM students WHERE classId = ?").all(classId) as Student[];
  },

  add(student: Student): number {
    const stmt = db.prepare(`
      INSERT INTO students (firstName, lastName, birthDate, sex, classId)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      student.firstName,
      student.lastName,
      student.birthDate,
      student.sex,
      student.classId
    );
    return info.lastInsertRowid as number;
  },

  update(student: Student): number {
    const stmt = db.prepare(`
      UPDATE students
      SET firstName = ?, lastName = ?, birthDate = ?, sex = ?, classId = ?
      WHERE id = ?
    `);
    const info = stmt.run(
      student.firstName,
      student.lastName,
      student.birthDate,
      student.sex,
      student.classId,
      student.id
    );
    return info.changes;
  },

  delete(id: number): number {
    const stmt = db.prepare("DELETE FROM students WHERE id = ?");
    const info = stmt.run(id);
    return info.changes;
  },
};
