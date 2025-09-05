import { db } from "./database.js";
import type { Payment } from "../../types/payment.js";

export const PaymentDB = {
  getAll(): Payment[] {
    return db.prepare("SELECT * FROM payments").all() as Payment[];
  },

  getById(id: number): Payment | undefined {
    return db.prepare("SELECT * FROM payments WHERE id = ?").get(id) as
      | Payment
      | undefined;
  },

  getByStudentId(studentId: number): Payment[] {
    return db.prepare("SELECT * FROM payments WHERE studentId = ?").all(studentId) as Payment[];
  },

  add(payment: Payment): number {
    const stmt = db.prepare(`
      INSERT INTO payments (studentId, amount, date, months, description)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      payment.studentId,
      payment.amount,
      payment.date,
      payment.months,         // ex: "2025-09,2025-10"
      payment.description || ""
    );
    return info.lastInsertRowid as number;
  },

  update(payment: Payment): number {
    const stmt = db.prepare(`
      UPDATE payments
      SET studentId = ?, amount = ?, date = ?, months = ?, description = ?
      WHERE id = ?
    `);
    const info = stmt.run(
      payment.studentId,
      payment.amount,
      payment.date,
      payment.months,
      payment.description || "",
      payment.id
    );
    return info.changes;
  },

  delete(id: number): number {
    const stmt = db.prepare("DELETE FROM payments WHERE id = ?");
    const info = stmt.run(id);
    return info.changes;
  },

  // ✅ Fonction utilitaire pour vérifier si un élève a payé un mois donné
  hasPaidMonth(studentId: number, month: string): boolean {
    const payment = db.prepare(`
      SELECT 1 FROM payments
      WHERE studentId = ?
      AND ',' || months || ',' LIKE '%,${month},%'
      LIMIT 1
    `).get(studentId);
    return !!payment;
  },

   getAllWithStudentInfo(): any[] {
    return db.prepare(`
      SELECT
        p.id AS paymentId,
        p.amount,
        p.date,
        p.months,
        p.description,
        s.firstName,
        s.lastName,
        c.name AS className,
        c.section AS classSection
      FROM payments p
      JOIN students s ON p.studentId = s.id
      LEFT JOIN class c ON s.classId = c.id
      ORDER BY p.date DESC
    `).all();
  }
};
