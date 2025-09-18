import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PaymentDAO } from '../payments.js';
import { StudentDAO } from '../students.js';
import { ClassDAO } from '../classes.js';
import { DatabaseManager } from '../../config/database.js';
import { MigrationManager } from '../migrations.js';

describe('PaymentDAO', () => {
  let paymentDAO: PaymentDAO;
  let studentDAO: StudentDAO;
  let classDAO: ClassDAO;
  let studentId: number;

  beforeEach(async () => {
    await MigrationManager.initialize();
    paymentDAO = new PaymentDAO();
    studentDAO = new StudentDAO();
    classDAO = new ClassDAO();

    const classId = classDAO.add({ name: 'CM2', section: 'A' });
    studentId = studentDAO.add({
      firstName: 'John',
      lastName: 'Doe',
      sex: 'M',
      classId
    });
  });

  afterEach(() => {
    DatabaseManager.close();
  });

  describe('add', () => {
    it('should create a new payment', () => {
      const paymentData = {
        studentId,
        amount: 50000,
        date: '2025-01-15',
        months: '2025-01,2025-02',
        description: 'Test payment'
      };

      const id = paymentDAO.add(paymentData);
      expect(id).toBeTypeOf('number');
      expect(id).toBeGreaterThan(0);
    });

    it('should reject negative amounts', () => {
      const paymentData = {
        studentId,
        amount: -1000,
        date: '2025-01-15',
        months: '2025-01'
      };

      expect(() => paymentDAO.add(paymentData)).toThrow();
    });
  });

  describe('hasPaidMonth', () => {
    beforeEach(() => {
      paymentDAO.add({
        studentId,
        amount: 50000,
        date: '2025-01-15',
        months: '2025-01,2025-02'
      });
    });

    it('should return true for paid month', () => {
      expect(paymentDAO.hasPaidMonth(studentId, '2025-01')).toBe(true);
      expect(paymentDAO.hasPaidMonth(studentId, '2025-02')).toBe(true);
    });

    it('should return false for unpaid month', () => {
      expect(paymentDAO.hasPaidMonth(studentId, '2025-03')).toBe(false);
    });
  });

  describe('getAllWithStudentInfo', () => {
    it('should return payments with student details', () => {
      paymentDAO.add({
        studentId,
        amount: 50000,
        date: '2025-01-15',
        months: '2025-01'
      });

      const payments = paymentDAO.getAllWithStudentInfo();
      expect(payments).toHaveLength(1);
      expect(payments[0].firstName).toBe('John');
      expect(payments[0].lastName).toBe('Doe');
      expect(payments[0].className).toBe('CM2');
    });
  });

  describe('getMonthlyStats', () => {
    beforeEach(() => {
      paymentDAO.add({
        studentId,
        amount: 50000,
        date: '2025-01-15',
        months: '2025-01'
      });
      paymentDAO.add({
        studentId,
        amount: 30000,
        date: '2025-01-20',
        months: '2025-01'
      });
    });

    it('should calculate monthly statistics', () => {
      const stats = paymentDAO.getMonthlyStats('2025-01');
      expect(stats.totalAmount).toBe(80000);
      expect(stats.paymentCount).toBe(2);
    });

    it('should return zeros for months with no payments', () => {
      const stats = paymentDAO.getMonthlyStats('2025-03');
      expect(stats.totalAmount).toBe(0);
      expect(stats.paymentCount).toBe(0);
    });
  });
});
