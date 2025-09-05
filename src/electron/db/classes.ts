import { db } from "./database.js";
import type { Class } from "../../types/class.js";

export const ClassDB = {
  getAll(): Class[] {
    return db.prepare("SELECT * FROM class ORDER BY name").all() as Class[];
  },

  getById(id: number): Class | undefined {
    return db.prepare("SELECT * FROM class WHERE id = ?").get(id) as Class | undefined;
  },

  add(cls: Class): number {
    const stmt = db.prepare(`
      INSERT INTO class (name, section)
      VALUES (?, ?)
    `);
    const info = stmt.run(cls.name, cls.section);
    return info.lastInsertRowid as number;
  },

  update(cls: Class): number {
    const stmt = db.prepare(`
      UPDATE class
      SET name = ?, section = ?
      WHERE id = ?
    `);
    const info = stmt.run(cls.name, cls.section, cls.id);
    return info.changes;
  },

  delete(id: number): number {
    const stmt = db.prepare("DELETE FROM class WHERE id = ?");
    const info = stmt.run(id);
    return info.changes;
  },

  // Optionnel : récupérer une classe avec tous ses élèves
  getWithStudents(id: number): any {
    return db.prepare(`
      SELECT c.id AS classId, c.name AS className, c.section,
             s.id AS studentId, s.firstName, s.lastName, s.sex
      FROM class c
      LEFT JOIN students s ON s.classId = c.id
      WHERE c.id = ?
    `).all(id);
  }
};
