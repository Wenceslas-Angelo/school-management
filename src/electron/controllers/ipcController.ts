import { ipcMain } from "electron";
import { studentDAO } from "../db/students.js";
import { classDAO } from "../db/classes.js";
import { paymentDAO } from "../db/payments.js";
import { studentService } from "../services/studentService.js";
import { db } from "../config/database.js";

const studentDAOInstance = studentDAO(db);
const classDAOInstance = classDAO(db);
const paymentDAOInstance = paymentDAO(db);

export class IPCController {
  static registerHandlers(): void {
    // Students
    ipcMain.handle("students:getAll", () => studentDAOInstance.getAll());
    ipcMain.handle("students:getById", (_, id: number) => studentDAOInstance.getById(id));
    ipcMain.handle("students:getByClassId", (_, classId: number) => studentDAOInstance.getByClassId(classId));
    ipcMain.handle("students:search", (_, query: string) => studentDAOInstance.search(query));
    ipcMain.handle("students:add", (_, student) => studentService.createStudent(student));
    ipcMain.handle("students:update", (_, student) => studentService.updateStudent(student));
    ipcMain.handle("students:delete", (_, id: number) => studentService.deleteStudent(id));

    // Classes
    ipcMain.handle("classes:getAll", () => classDAOInstance.getAll());
    ipcMain.handle("classes:getById", (_, id: number) => classDAOInstance.getById(id));
    ipcMain.handle("classes:getWithStudents", (_, id: number) => classDAOInstance.getWithStudentCount());
    ipcMain.handle("classes:add", (_, cls) => classDAOInstance.add(cls));
    ipcMain.handle("classes:update", (_, cls) => classDAOInstance.update(cls));
    ipcMain.handle("classes:delete", (_, id: number) => classDAOInstance.delete(id));

    // Payments
    ipcMain.handle("payments:getAll", () => paymentDAOInstance.getAll());
    ipcMain.handle("payments:getAllWithStudentInfo", () => paymentDAOInstance.getAllWithStudentInfo());
    ipcMain.handle("payments:getById", (_, id: number) => paymentDAOInstance.getById(id));
    ipcMain.handle("payments:getByStudentId", (_, studentId: number) => paymentDAOInstance.getByStudentId(studentId));
    ipcMain.handle("payments:add", (_, payment) => paymentDAOInstance.add(payment));
    ipcMain.handle("payments:update", (_, payment) => paymentDAOInstance.update(payment));
    ipcMain.handle("payments:delete", (_, id: number) => paymentDAOInstance.delete(id));
    ipcMain.handle("payments:hasPaidMonth", (_, studentId: number, month: string) => 
      paymentDAOInstance.hasPaidMonth(studentId, month));
  }
}