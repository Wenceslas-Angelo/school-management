import React from "react";
import {
  FaUserGraduate,
  FaSchool,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from "react-icons/fa";

const Dashboard = () => {
  // Fake data (pour l'instant)
  const totalStudents = 245;
  const totalClasses = 12;
  const paidThisMonth = 190;
  const unpaidThisMonth = 55;

  const studentsByClass = [
    { className: "10ème A", count: 30 },
    { className: "10ème B", count: 28 },
    { className: "11ème A", count: 32 },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard 📊</h1>

      {/* Section globale */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Vue d’ensemble</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students */}
          <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 text-xl">
              <FaUserGraduate />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-lg font-bold">{totalStudents}</p>
            </div>
          </div>

          {/* Total Classes */}
          <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 text-xl">
              <FaSchool />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Classes</p>
              <p className="text-lg font-bold">{totalClasses}</p>
            </div>
          </div>

          {/* Paid */}
          <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600 text-xl">
              <FaMoneyBillWave />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Paid (This Month)</p>
              <p className="text-lg font-bold">{paidThisMonth}</p>
            </div>
          </div>

          {/* Unpaid */}
          <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-100 text-red-600 text-xl">
              <FaExclamationTriangle />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Unpaid (This Month)</p>
              <p className="text-lg font-bold">{unpaidThisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section par classe */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Par Classe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentsByClass.map((c, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow p-4 flex items-center gap-4"
            >
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 text-xl">
                <FaSchool />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{c.className}</p>
                <p className="text-lg font-bold">{c.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
