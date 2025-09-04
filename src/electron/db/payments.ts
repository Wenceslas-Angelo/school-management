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

  add(payment: Payment): number {
    const stmt = db.prepare(`
      INSERT INTO payments (studentId, amount, date, status) 
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(
      payment.studentId,
      payment.amount,
      payment.date,
      payment.status || "pending"
    );
    return info.lastInsertRowid as number;
  },

  update(payment: Payment): number {
    const stmt = db.prepare(`
      UPDATE payments
      SET studentId = ?, amount = ?, date = ?, status = ?
      WHERE id = ?
    `);
    const info = stmt.run(
      payment.studentId,
      payment.amount,
      payment.date,
      payment.status,
      payment.id
    );
    return info.changes;
  },

  delete(id: number): number {
    const stmt = db.prepare("DELETE FROM payments WHERE id = ?");
    const info = stmt.run(id);
    return info.changes;
  },
};
