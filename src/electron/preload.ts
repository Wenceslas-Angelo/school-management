import { contextBridge, ipcRenderer } from "electron";
import type { Student } from "../types/student.js";
import type { Payment } from "../types/payment.js";

contextBridge.exposeInMainWorld("api", {
  // Students
  students: {
    getAll: () => ipcRenderer.invoke("students:getAll") as Promise<Student[]>,
    getById: (id: number) =>
      ipcRenderer.invoke("students:getById", id) as Promise<
        Student | undefined
      >,
    add: (student: Student) =>
      ipcRenderer.invoke("students:add", student) as Promise<number>,
    update: (student: Student) =>
      ipcRenderer.invoke("students:update", student) as Promise<number>,
    delete: (id: number) =>
      ipcRenderer.invoke("students:delete", id) as Promise<number>,
  },

  // Payments
  payments: {
    getAll: () => ipcRenderer.invoke("payments:getAll") as Promise<Payment[]>,
    getById: (id: number) =>
      ipcRenderer.invoke("payments:getById", id) as Promise<
        Payment | undefined
      >,
    add: (payment: Payment) =>
      ipcRenderer.invoke("payments:add", payment) as Promise<number>,
    update: (payment: Payment) =>
      ipcRenderer.invoke("payments:update", payment) as Promise<number>,
    delete: (id: number) =>
      ipcRenderer.invoke("payments:delete", id) as Promise<number>,
  },
});
