import type { IpcMain } from "electron";
import * as StudentDB from "../db/students.js";

export function registerStudentHandlers(ipcMain: IpcMain) {
  ipcMain.handle("get-students", () => {
    return StudentDB.getStudents();
  });

  ipcMain.handle("get-student-by-id", (_event, id: number) => {
    return StudentDB.getStudentById(id);
  });

  ipcMain.handle("add-student", (_event, student) => {
    return StudentDB.addStudent(student);
  });

  ipcMain.handle("update-student", (_event, student) => {
    return StudentDB.updateStudent(student);
  });

  ipcMain.handle("delete-student", (_event, id: number) => {
    return StudentDB.deleteStudent(id);
  });
}
