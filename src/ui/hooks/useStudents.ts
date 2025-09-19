import { useEffect, useMemo } from "react";
import { useCrud } from "./useCrud";
import type { Student } from "../../types/student";

export function useStudents() {
  const operations = useMemo(() => ({
    getAll: () => window.api.students.getAll(),
    add: (student: Omit<Student, "id">) => window.api.students.add(student as Student),
    update: (student: Student) => window.api.students.update(student),
    delete: (id: number) => window.api.students.delete(id),
  }), []);

  const crud = useCrud<Student>(operations);

  useEffect(() => {
    crud.load();
  }, [crud.load]);

  return crud;
}
