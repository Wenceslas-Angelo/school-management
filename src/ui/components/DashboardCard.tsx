import React from 'react';

type DashboardCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'green' | 'red' | 'indigo' | 'orange';
  subtitle?: string;
};

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  orange: 'bg-orange-100 text-orange-600',
};

export const DashboardCard = React.memo(({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle 
}: DashboardCardProps) => (
  <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
    <div className={`p-3 rounded-full ${colorClasses[color]} text-xl`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-lg font-bold">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-400">{subtitle}</p>
      )}
    </div>
  </div>
));

DashboardCard.displayName = 'DashboardCard';