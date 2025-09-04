import { db } from "./database.js";
import type { Class } from "../../types/class.js";

// 👉 CREATE
export function addClass(newClass: Class) {
  const stmt = db.prepare(`INSERT INTO Classes (name, level) VALUES (?, ?)`);
  const result = stmt.run(newClass.name, newClass.level ?? null);
  return result.lastInsertRowid; // retourne l'id de la classe ajoutée
}

// 👉 READ - all
export function getClasses(): Class[] {
  return db.prepare("SELECT * FROM Classes").all() as Class[];
}

// 👉 READ - by id
export function getClassById(id: number): Class | undefined {
  return db.prepare("SELECT * FROM Classes WHERE id = ?").get(id) as
    | Class
    | undefined;
}

// 👉 UPDATE
export function updateClass(updatedClass: Class) {
  if (!updatedClass.id) throw new Error("Class ID is required for update");

  const stmt = db.prepare(
    `UPDATE Classes 
     SET name = ?, level = ? 
     WHERE id = ?`
  );

  const result = stmt.run(
    updatedClass.name,
    updatedClass.level ?? null,
    updatedClass.id
  );
  return result.changes; // nb de lignes modifiées
}

// 👉 DELETE
export function deleteClass(id: number) {
  const stmt = db.prepare("DELETE FROM Classes WHERE id = ?");
  const result = stmt.run(id);
  return result.changes; // nb de lignes supprimées
}
