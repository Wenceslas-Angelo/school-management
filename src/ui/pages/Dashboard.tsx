import React from "react";
import {
  FaUserGraduate,
  FaSchool,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Fake data
const stats = [
  {
    label: "Students",
    value: 245,
    icon: <FaUserGraduate />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Classes",
    value: 12,
    icon: <FaSchool />,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Payments (Sept)",
    value: "$3,200",
    icon: <FaMoneyBillWave />,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    label: "Unpaid",
    value: 18,
    icon: <FaExclamationTriangle />,
    color: "bg-red-100 text-red-600",
  },
];

const paymentsData = [
  { month: "Jan", amount: 2200 },
  { month: "Feb", amount: 2800 },
  { month: "Mar", amount: 1800 },
  { month: "Apr", amount: 3000 },
  { month: "May", amount: 2600 },
  { month: "Jun", amount: 3200 },
];

const classDistribution = [
  { name: "Class A", value: 80 },
  { name: "Class B", value: 65 },
  { name: "Class C", value: 100 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

const newStudents = [
  { id: 1, name: "John Doe", class: "Class A", date: "2025-08-20" },
  { id: 2, name: "Jane Smith", class: "Class B", date: "2025-08-22" },
  { id: 3, name: "Ali Khan", class: "Class C", date: "2025-08-25" },
];

const recentPayments = [
  {
    id: 1,
    student: "John Doe",
    class: "Class A",
    amount: "$200",
    date: "2025-08-28",
  },
  {
    id: 2,
    student: "Jane Smith",
    class: "Class B",
    amount: "$200",
    date: "2025-08-29",
  },
  {
    id: 3,
    student: "Ali Khan",
    class: "Class C",
    amount: "$200",
    date: "2025-08-30",
  },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Welcome back 👋</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-4 flex items-center gap-4"
          >
            <div className={`p-3 rounded-full ${s.color} text-xl`}>
              {s.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className="text-lg font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart payments */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Payments</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paymentsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart distribution */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Class Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={classDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {classDistribution.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New students */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">New Students</h2>
          <table className="w-full text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Class</th>
                <th className="text-left p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {newStudents.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.class}</td>
                  <td className="p-2">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent payments */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
          <table className="w-full text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="text-left p-2">Student</th>
                <th className="text-left p-2">Class</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.student}</td>
                  <td className="p-2">{p.class}</td>
                  <td className="p-2">{p.amount}</td>
                  <td className="p-2">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
