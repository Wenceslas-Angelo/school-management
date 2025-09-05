const electron = require("electron");

type Student = import("../types/student").Student;
type Payment = import("../types/payment").Payment;

electron.contextBridge.exposeInMainWorld("api", {
  // Students
  students: {
    getAll: () => electron.ipcRenderer.invoke("students:getAll") as Promise<Student[]>,
    getById: (id: number) =>
      electron.ipcRenderer.invoke("students:getById", id) as Promise<
        Student | undefined
      >,
    add: (student: Student) =>
      electron.ipcRenderer.invoke("students:add", student) as Promise<number>,
    update: (student: Student) =>
      electron.ipcRenderer.invoke("students:update", student) as Promise<number>,
    delete: (id: number) =>
      electron.ipcRenderer.invoke("students:delete", id) as Promise<number>,
  },

  // Payments
  payments: {
    getAll: () => electron.ipcRenderer.invoke("payments:getAll") as Promise<Payment[]>,
    getById: (id: number) =>
      electron.ipcRenderer.invoke("payments:getById", id) as Promise<
        Payment | undefined
      >,
    add: (payment: Payment) =>
      electron.ipcRenderer.invoke("payments:add", payment) as Promise<number>,
    update: (payment: Payment) =>
      electron.ipcRenderer.invoke("payments:update", payment) as Promise<number>,
    delete: (id: number) =>
      electron.ipcRenderer.invoke("payments:delete", id) as Promise<number>,
  },
});
