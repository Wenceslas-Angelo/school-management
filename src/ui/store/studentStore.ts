import { create } from "zustand";
import type { Student } from "../../types/student";

type StudentState = {
  students: Student[];
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: number) => void;
};

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  setStudents: (students) => set({ students }),
  addStudent: (student) =>
    set((state) => ({ students: [...state.students, student] })),
  updateStudent: (student) =>
    set((state) => ({
      students: state.students.map((s) => (s.id === student.id ? student : s)),
    })),
  deleteStudent: (id) =>
    set((state) => ({
      students: state.students.filter((s) => s.id !== id),
    })),
}));
