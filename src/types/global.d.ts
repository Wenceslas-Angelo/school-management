import type { Student } from "./student";
import type { Payment, PaymentExtended } from "./payment";
import type { Class } from "./class";

export {};

declare global {
  interface Window {
    api: {
      students: {
        getAll: () => Promise<Student[]>;
        getById: (id: number) => Promise<Student | undefined>;
        getByClassId: (classId: number) => Promise<Student[]>;
        add: (student: Student) => Promise<number>;
        update: (student: Student) => Promise<number>;
        delete: (id: number) => Promise<number>;
      };
      payments: {
        getAll: () => Promise<Payment[]>;
        getAllWithStudentInfo: () => Promise<PaymentExtended[]>;
        getById: (id: number) => Promise<Payment | undefined>;
        getByStudentId: (studentId: number) => Promise<Payment[]>;
        add: (payment: Payment) => Promise<number>;
        update: (payment: Payment) => Promise<number>;
        delete: (id: number) => Promise<number>;
        hasPaidMonth: (studentId: number, month: string) => Promise<boolean>;
      };
      classes: {
        getAll: () => Promise<Class[]>;
        getById: (id: number) => Promise<Class | undefined>;
        add: (cls: Class) => Promise<number>;
        update: (cls: Class) => Promise<number>;
        delete: (id: number) => Promise<number>;
        getWithStudents: (id: number) => Promise<unknown[]>;
      };
    };
  }
}
