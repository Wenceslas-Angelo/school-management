import { useEffect, useMemo } from "react";
import { useCrud } from "./useCrud";
import type { Class } from "../../types/class";

export function useClasses() {
  const operations = useMemo(() => ({
    getAll: () => window.api.classes.getAll(),
    add: (cls: Omit<Class, "id">) => window.api.classes.add(cls as Class),
    update: (cls: Class) => window.api.classes.update(cls),
    delete: (id: number) => window.api.classes.delete(id),
  }), []);

  const crud = useCrud<Class>(operations);

  useEffect(() => {
    crud.load();
  }, [crud.load]);

  return crud;
}
