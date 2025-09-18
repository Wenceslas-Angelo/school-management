import { ipcMain } from "electron";
import { studentDAO } from "../db/students.js";
import { classDAO } from "../db/classes.js";
import { paymentDAO } from "../db/payments.js";
import { studentService } from "../services/studentService.js";

export class IPCController {
  static registerHandlers(): void {
    // Students
    ipcMain.handle("students:getAll", () => studentDAO.getAll());
    ipcMain.handle("students:getById", (_, id: number) => studentDAO.getById(id));
    ipcMain.handle("students:getByClassId", (_, classId: number) => studentDAO.getByClassId(classId));
    ipcMain.handle("students:search", (_, query: string) => studentDAO.search(query));
    ipcMain.handle("students:add", (_, student) => studentService.createStudent(student));
    ipcMain.handle("students:update", (_, student) => studentService.updateStudent(student));
    ipcMain.handle("students:delete", (_, id: number) => studentService.deleteStudent(id));

    // Classes
    ipcMain.handle("classes:getAll", () => classDAO.getAll());
    ipcMain.handle("classes:getById", (_, id: number) => classDAO.getById(id));
    ipcMain.handle("classes:getWithStudents", (_, id: number) => classDAO.getWithStudentCount());
    ipcMain.handle("classes:add", (_, cls) => classDAO.add(cls));
    ipcMain.handle("classes:update", (_, cls) => classDAO.update(cls));
    ipcMain.handle("classes:delete", (_, id: number) => classDAO.delete(id));

    // Payments
    ipcMain.handle("payments:getAll", () => paymentDAO.getAll());
    ipcMain.handle("payments:getAllWithStudentInfo", () => paymentDAO.getAllWithStudentInfo());
    ipcMain.handle("payments:getById", (_, id: number) => paymentDAO.getById(id));
    ipcMain.handle("payments:getByStudentId", (_, studentId: number) => paymentDAO.getByStudentId(studentId));
    ipcMain.handle("payments:add", (_, payment) => paymentDAO.add(payment));
    ipcMain.handle("payments:update", (_, payment) => paymentDAO.update(payment));
    ipcMain.handle("payments:delete", (_, id: number) => paymentDAO.delete(id));
    ipcMain.handle("payments:hasPaidMonth", (_, studentId: number, month: string) => 
      paymentDAO.hasPaidMonth(studentId, month));
  }
}