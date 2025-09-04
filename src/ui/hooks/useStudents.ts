import { useEffect, useCallback } from "react";
import { useStudentStore } from "../store/studentStore";
import { studentsApi } from "../mocks/studentsApi";
import type { Student } from "../../types/student";

export function useStudents() {
  const { students, setStudents, addStudent, updateStudent, deleteStudent } =
    useStudentStore();

  const reload = useCallback(async () => {
    const data = await studentsApi.getAll();
    setStudents(data);
  }, [setStudents]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    students,
    reload,
    add: async (student: Student) => {
      const id = await studentsApi.add(student);
      addStudent({ ...student, id });
    },
    update: async (student: Student) => {
      await studentsApi.update(student);
      updateStudent(student);
    },
    remove: async (id: number) => {
      await studentsApi.remove(id);
      deleteStudent(id);
    },
  };
}
