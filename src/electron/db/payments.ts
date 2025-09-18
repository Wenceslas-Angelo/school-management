// db/payments.ts
import { BaseDAO } from "./base.js";
import { TABLE_NAMES } from "../config/constants.js";
import type { Payment } from "../../types/payment.js";
import type { Database } from "better-sqlite3";

export class PaymentDAO extends BaseDAO<Payment> {
  constructor(db: Database) {
    super(TABLE_NAMES.PAYMENTS, db);
  }

  add(payment: Omit<Payment, 'id'>): number {
    const result = this.executeRun(
      `INSERT INTO ${this.tableName} (studentId, amount, date, months, description) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        payment.studentId, 
        payment.amount, 
        payment.date, 
        payment.months, 
        payment.description ?? ""
      ]
    );
    return result.lastInsertRowid as number;
  }

  update(payment: Payment): number {
    const result = this.executeRun(
      `UPDATE ${this.tableName} 
       SET studentId = ?, amount = ?, date = ?, months = ?, description = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        payment.studentId, 
        payment.amount, 
        payment.date, 
        payment.months, 
        payment.description ?? "", 
        payment.id
      ]
    );
    return result.changes;
  }

  getByStudentId(studentId: number): Payment[] {
    return this.executeQuery(
      `SELECT * FROM ${this.tableName} WHERE studentId = ? ORDER BY date DESC`,
      [studentId]
    );
  }

  getAllWithStudentInfo(): Array<Payment & { firstName: string; lastName: string; className?: string; classSection?: string }> {
    return this.executeQuery(`
      SELECT p.*, s.firstName, s.lastName, c.name AS className, c.section AS classSection
      FROM ${this.tableName} p
      JOIN ${TABLE_NAMES.STUDENTS} s ON p.studentId = s.id
      LEFT JOIN ${TABLE_NAMES.CLASSES} c ON s.classId = c.id
      ORDER BY p.date DESC
    `);
  }

  hasPaidMonth(studentId: number, month: string): boolean {
    const result = this.executeGet(
      `SELECT 1 FROM ${this.tableName} WHERE studentId = ? AND months LIKE ? LIMIT 1`,
      [studentId, `%${month}%`]
    );
    return !!result;
  }

  getMonthlyStats(month: string): { totalAmount: number; paymentCount: number } {
    const result = this.executeGet<{ totalAmount: number; paymentCount: number }>(
      `SELECT COALESCE(SUM(amount), 0) AS totalAmount, COUNT(*) AS paymentCount
       FROM ${this.tableName}
       WHERE months LIKE ?`,
      [`%${month}%`]
    );
    return result ?? { totalAmount: 0, paymentCount: 0 };
  }
}

// Export singleton si t'en veux un direct
// tu peux aussi créer plusieurs instances avec diff DB (pour tests)
export const paymentDAO = (db: Database) => new PaymentDAO(db);
