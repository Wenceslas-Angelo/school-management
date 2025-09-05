import { useEffect, useCallback } from "react";
import { useClassStore } from "../store/classStore";
import type { Class } from "../../types/class";

export function useClasses() {
  const { classes, setClasses, addClass, updateClass, deleteClass } =
    useClassStore();

  const reload = useCallback(async () => {
    const data = await window.api.classes.getAll(); // backend IPC
    setClasses(data);
  }, [setClasses]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    classes,
    reload,
    add: async (classItem: Class) => {
      const id = await window.api.classes.add(classItem);
      addClass({ ...classItem, id });
    },
    update: async (classItem: Class) => {
      await window.api.classes.update(classItem);
      updateClass(classItem);
    },
    remove: async (id: number) => {
      await window.api.classes.delete(id);
      deleteClass(id);
    },
  };
}
