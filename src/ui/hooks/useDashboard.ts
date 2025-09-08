import { useMemo } from "react";
import { useStudents } from "./useStudents";
import { usePayments } from "./usePayments";
import { useClasses } from "./useClasses";

export function useDashboard() {
  const { students } = useStudents();
  const { payments } = usePayments();
  const { classes } = useClasses();

  const totalStudents = students.length;

  const totalClasses = classes.length;


  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  const paidThisMonth = useMemo(
    () =>
      payments.filter((p) => p.months.split(",").includes(currentMonth)).length,
    [payments, currentMonth]
  );

  const unpaidThisMonth = useMemo(() => totalStudents - paidThisMonth, [
    totalStudents,
    paidThisMonth,
  ]);

  const classMap = useMemo(() => {
    const map = new Map<number, { name: string; section?: string }>();
    classes.forEach((c) => map.set(c.id!, { name: c.name, section: c.section }));
    return map;
  }, [classes]);

  const studentsByClass = useMemo(() => {
    const map: Record<string, number> = {};

    students.forEach((s) => {
      const cls = s.classId ? classMap.get(s.classId) : null;
      const classLabel = cls ? `${cls.name}${cls.section ? " " + cls.section : ""}` : "Unassigned";
      map[classLabel] = (map[classLabel] || 0) + 1;
    });

    return Object.entries(map).map(([className, count]) => ({ className, count }));
  }, [students, classMap]);

  return {
    totalStudents,
    totalClasses,
    paidThisMonth,
    unpaidThisMonth,
    studentsByClass,
  };
}
