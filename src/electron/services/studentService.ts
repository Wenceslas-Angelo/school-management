import type { Student } from "../../types/student.js";
import type { StudentDAO } from "../db/students.js";
import type { ClassDAO } from "../db/classes.js";

export class StudentService {
  private studentDAO: StudentDAO;
  private classDAO: ClassDAO;

  constructor(studentDAO: StudentDAO, classDAO: ClassDAO) {
    this.studentDAO = studentDAO;
    this.classDAO = classDAO;
  }

  createStudent(studentData: Omit<Student, "id" | "createdAt">): number {
    if (!studentData.firstName?.trim() || !studentData.lastName?.trim()) {
      throw new Error("First name and last name are required");
    }

    if (studentData.classId != null) {
      const classExists = this.classDAO.getById(studentData.classId);
      if (!classExists) {
        throw new Error("Selected class does not exist");
      }
    }

    return this.studentDAO.add({
      ...studentData,
      firstName: studentData.firstName.trim(),
      lastName: studentData.lastName.trim()
    });
  }

  updateStudent(student: Student): void {
    if (!student.id) {
      throw new Error("Student ID is required for update");
    }

    const exists = this.studentDAO.getById(student.id);
    if (!exists) {
      throw new Error("Student not found");
    }

    const updated = this.studentDAO.update(student);
    if (!updated) {
      throw new Error("Failed to update student");
    }
  }

  deleteStudent(id: number): void {
    const deleted = this.studentDAO.delete(id);
    if (!deleted) {
      throw new Error("Student not found or could not be deleted");
    }
  }

  getStudentWithDetails(id: number): (Student & { className?: string }) | null {
    const students = this.studentDAO.getWithClassInfo();
    return students.find(s => s.id === id) || null;
  }
}
