import React from "react";
import {
  FaUserGraduate,
  FaSchool,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaChartLine,
  FaPercentage,
} from "react-icons/fa";
import { DashboardCard } from "../components/DashboardCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { useStudents } from "../hooks/useStudents";
import { usePayments } from "../hooks/usePayments";
import { useClasses } from "../hooks/useClasses";
import { useDashboardStats } from "../hooks/useDashboardStats";

const Dashboard = React.memo(() => {
  const { data: students, loading: studentsLoading, error: studentsError } = useStudents();
  const { data: payments, loading: paymentsLoading, error: paymentsError } = usePayments();
  const { data: classes, loading: classesLoading, error: classesError } = useClasses();

  const loading = studentsLoading || paymentsLoading || classesLoading;
  const error = studentsError || paymentsError || classesError;

  const stats = useDashboardStats(students, payments, classes);

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard 📊</h1>

      {/* Stats principales */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Vue d'ensemble</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <DashboardCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<FaUserGraduate />}
            color="blue"
          />
          
          <DashboardCard
            title="Total Classes"
            value={stats.totalClasses}
            icon={<FaSchool />}
            color="purple"
          />
          
          <DashboardCard
            title="Paid (This Month)"
            value={stats.paidThisMonth}
            icon={<FaMoneyBillWave />}
            color="green"
            subtitle={`${stats.paymentRate}% rate`}
          />
          
          <DashboardCard
            title="Unpaid (This Month)"
            value={stats.unpaidThisMonth}
            icon={<FaExclamationTriangle />}
            color="red"
          />
          
          <DashboardCard
            title="Monthly Revenue"
            value={`${(stats.monthlyRevenue / 1000).toFixed(0)}K Ar`}
            icon={<FaChartLine />}
            color="indigo"
          />
          
          <DashboardCard
            title="Payment Rate"
            value={`${stats.paymentRate}%`}
            icon={<FaPercentage />}
            color="orange"
          />
        </div>
      </section>

      {/* Répartition par classe */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Répartition par classe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.studentsByClass.map((item, i) => (
            <DashboardCard
              key={item.className}
              title={item.className}
              value={item.count}
              icon={<FaSchool />}
              color="indigo"
            />
          ))}
        </div>
      </section>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;