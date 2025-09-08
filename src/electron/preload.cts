const electron = require("electron");

type Student = import("../types/student").Student;
type Payment = import("../types/payment").Payment;
type Class = import("../types/class").Class;

electron.contextBridge.exposeInMainWorld("api", {
  // Students
  students: {
    getAll: (): Promise<Student[]> =>
      electron.ipcRenderer.invoke("students:getAll"),
    getById: (id: number): Promise<Student | undefined> =>
      electron.ipcRenderer.invoke("students:getById", id),
    getByClassId: (classId: number): Promise<Student[]> =>
      electron.ipcRenderer.invoke("students:getByClassId", classId),
    add: (student: Student): Promise<number> =>
      electron.ipcRenderer.invoke("students:add", student),
    update: (student: Student): Promise<number> =>
      electron.ipcRenderer.invoke("students:update", student),
    delete: (id: number): Promise<number> =>
      electron.ipcRenderer.invoke("students:delete", id),
    search: (query: string): Promise<{ value: number; label: string }[]> =>
      electron.ipcRenderer.invoke("students:search", query),
  },

  // Payments
  payments: {
    getAll: (): Promise<Payment[]> =>
      electron.ipcRenderer.invoke("payments:getAll"),
    getAllWithStudentInfo: (): Promise<any[]> =>
      electron.ipcRenderer.invoke("payments:getAllWithStudentInfo"),
    getById: (id: number): Promise<Payment | undefined> =>
      electron.ipcRenderer.invoke("payments:getById", id),
    getByStudentId: (studentId: number): Promise<Payment[]> =>
      electron.ipcRenderer.invoke("payments:getByStudentId", studentId),
    add: (payment: Payment): Promise<number> =>
      electron.ipcRenderer.invoke("payments:add", payment),
    update: (payment: Payment): Promise<number> =>
      electron.ipcRenderer.invoke("payments:update", payment),
    delete: (id: number): Promise<number> =>
      electron.ipcRenderer.invoke("payments:delete", id),
    hasPaidMonth: (studentId: number, month: string): Promise<boolean> =>
      electron.ipcRenderer.invoke("payments:hasPaidMonth", studentId, month),
  },

  // Classes
  classes: {
    getAll: (): Promise<Class[]> =>
      electron.ipcRenderer.invoke("classes:getAll"),
    getById: (id: number): Promise<Class | undefined> =>
      electron.ipcRenderer.invoke("classes:getById", id),
    add: (cls: Class): Promise<number> =>
      electron.ipcRenderer.invoke("classes:add", cls),
    update: (cls: Class): Promise<number> =>
      electron.ipcRenderer.invoke("classes:update", cls),
    delete: (id: number): Promise<number> =>
      electron.ipcRenderer.invoke("classes:delete", id),
    getWithStudents: (id: number): Promise<any[]> =>
      electron.ipcRenderer.invoke("classes:getWithStudents", id),
  },
});
