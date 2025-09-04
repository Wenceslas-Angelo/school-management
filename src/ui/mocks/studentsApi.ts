import type { Student } from "../../types/student";

let mockStudents: Student[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    birthDate: "2012-05-14",
    className: "10ieme A",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    birthDate: "2011-09-23",
    className: "7ieme B",
  },
];

let nextId = 3;

export const studentsApi = {
  async getAll(): Promise<Student[]> {
    return [...mockStudents];
  },

  async getById(id: number): Promise<Student | undefined> {
    return mockStudents.find((s) => s.id === id);
  },

  async add(student: Student): Promise<number> {
    const newStudent = { ...student, id: nextId++ };
    mockStudents.push(newStudent);
    return newStudent.id!;
  },

  async update(student: Student): Promise<number> {
    const idx = mockStudents.findIndex((s) => s.id === student.id);
    if (idx >= 0) {
      mockStudents[idx] = student;
      return 1;
    }
    return 0;
  },

  async remove(id: number): Promise<number> {
    const len = mockStudents.length;
    mockStudents = mockStudents.filter((s) => s.id !== id);
    return len - mockStudents.length;
  },
};
