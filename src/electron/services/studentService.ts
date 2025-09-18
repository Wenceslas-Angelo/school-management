import { studentDAO } from "../db/students.js";
import { classDAO } from "../db/classes.js";
import type { Student } from "../../types/student.js";

export class StudentService {
  async createStudent(studentData: Omit<Student, 'id' | 'createdAt'>): Promise<number> {
    // Validation
    if (!studentData.firstName?.trim() || !studentData.lastName?.trim()) {
      throw new Error("First name and last name are required");
    }

    if (studentData.classId) {
      const classExists = await classDAO.getById(studentData.classId);
      if (!classExists) {
        throw new Error("Selected class does not exist");
      }
    }

    return studentDAO.add({
      ...studentData,
      firstName: studentData.firstName.trim(),
      lastName: studentData.lastName.trim()
    });
  }

  async updateStudent(student: Student): Promise<void> {
    if (!student.id) {
      throw new Error("Student ID is required for update");
    }

    const exists = await studentDAO.getById(student.id);
    if (!exists) {
      throw new Error("Student not found");
    }

    const updated = studentDAO.update(student);
    if (updated === 0) {
      throw new Error("Failed to update student");
    }
  }

  async deleteStudent(id: number): Promise<void> {
    const deleted = studentDAO.delete(id);
    if (deleted === 0) {
      throw new Error("Student not found or could not be deleted");
    }
  }

  async getStudentWithDetails(id: number): Promise<(Student & { className?: string }) | null> {
    const students = studentDAO.getWithClassInfo();
    return students.find(s => s.id === id) || null;
  }
}

export const studentService = new StudentService();