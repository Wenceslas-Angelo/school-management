// src/ui/mocks/paymentsApi.ts
import type { Payment } from "../../types/payment";
import { studentsApi } from "./studentsApi";

export type PaymentExtended = Payment & {
  studentName: string;
  className?: string;
};

let mockPayments: Payment[] = [
  { id: 1, studentId: 1, amount: 50000, date: "2025-01-10", status: "paid" },
  { id: 2, studentId: 2, amount: 60000, date: "2025-02-15", status: "pending" },
];

let nextId = 3;

export const paymentsApi = {
  async getAll(): Promise<PaymentExtended[]> {
    const students = await studentsApi.getAll();
    return mockPayments.map((p) => {
      const student = students.find((s) => s.id === p.studentId);
      return {
        ...p,
        studentName: student
          ? `${student.firstName} ${student.lastName}`
          : "Unknown",
        className: student?.className,
      };
    });
  },

  async getById(id: number): Promise<PaymentExtended | undefined> {
    const payment = mockPayments.find((p) => p.id === id);
    if (!payment) return undefined;

    const student = await studentsApi.getById(payment.studentId);
    return {
      ...payment,
      studentName: student
        ? `${student.firstName} ${student.lastName}`
        : "Unknown",
      className: student?.className,
    };
  },

  async add(payment: Payment): Promise<number> {
    const newPayment = { ...payment, id: nextId++ };
    mockPayments.push(newPayment);
    return newPayment.id!;
  },

  async update(payment: Payment): Promise<number> {
    const idx = mockPayments.findIndex((p) => p.id === payment.id);
    if (idx >= 0) {
      mockPayments[idx] = payment;
      return 1;
    }
    return 0;
  },

  async remove(id: number): Promise<number> {
    const len = mockPayments.length;
    mockPayments = mockPayments.filter((p) => p.id !== id);
    return len - mockPayments.length;
  },
};
