import type { Student } from "./student";
import type { Payment } from "./payment";

export {};

declare global {
  interface Window {
    api: {
      students: {
        getAll: () => Promise<Student[]>;
        getById: (id: number) => Promise<Student | undefined>;
        add: (student: Student) => Promise<number>;
        update: (student: Student) => Promise<number>;
        delete: (id: number) => Promise<number>;
      };
      payments: {
        getAll: () => Promise<Payment[]>;
        getById: (id: number) => Promise<Payment | undefined>;
        add: (payment: Payment) => Promise<number>;
        update: (payment: Payment) => Promise<number>;
        delete: (id: number) => Promise<number>;
      };
    };
  }
}
