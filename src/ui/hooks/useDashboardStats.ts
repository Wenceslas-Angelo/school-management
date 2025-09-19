import { useMemo } from 'react';
import type { Student } from '../../types/student';
import type { PaymentExtended } from '../../types/payment';
import type { Class } from '../../types/class';

export function useDashboardStats(
  students: Student[],
  payments: PaymentExtended[],
  classes: Class[]
) {
  return useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Map des classes pour performance
    const classMap = new Map<number, { name: string; section?: string }>();
    classes.forEach(c => classMap.set(c.id!, { name: c.name, section: c.section }));

    // Stats de base
    const totalStudents = students.length;
    const totalClasses = classes.length;

    // Payments ce mois
    const paidThisMonth = payments.filter(p => 
      p.months?.split(',').some(m => m.trim() === currentMonth)
    ).length;

    const unpaidThisMonth = totalStudents - paidThisMonth;

    // Répartition par classe
    const classCounts = new Map<string, number>();
    
    students.forEach(s => {
      const cls = s.classId ? classMap.get(s.classId) : null;
      const key = cls 
        ? `${cls.name}${cls.section ? ' ' + cls.section : ''}` 
        : 'Unassigned';
      classCounts.set(key, (classCounts.get(key) || 0) + 1);
    });

    const studentsByClass = Array.from(classCounts.entries()).map(
      ([className, count]) => ({ className, count })
    );

    // Revenue total ce mois (bonus)
    const monthlyRevenue = payments
      .filter(p => p.months?.includes(currentMonth))
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      totalStudents,
      totalClasses,
      paidThisMonth,
      unpaidThisMonth,
      studentsByClass,
      monthlyRevenue,
      paymentRate: totalStudents > 0 ? (paidThisMonth / totalStudents * 100).toFixed(1) : '0'
    };
  }, [students, payments, classes]);
}