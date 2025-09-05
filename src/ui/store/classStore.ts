import { create } from "zustand";
import type { Class } from "../../types/class";

type ClassState = {
  classes: Class[];
  setClasses: (classes: Class[]) => void;
  addClass: (classItem: Class) => void;
  updateClass: (classItem: Class) => void;
  deleteClass: (id: number) => void;
};

export const useClassStore = create<ClassState>((set) => ({
  classes: [],
  setClasses: (classes) => set({ classes }),
  addClass: (classItem) =>
    set((state) => ({ classes: [...state.classes, classItem] })),
  updateClass: (classItem) =>
    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === classItem.id ? classItem : c
      ),
    })),
  deleteClass: (id) =>
    set((state) => ({ classes: state.classes.filter((c) => c.id !== id) })),
}));
