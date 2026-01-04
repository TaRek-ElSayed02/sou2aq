import React from 'react'

export const StatCard = ({ title, value, change, icon, iconBg, trend }) => {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500 mb-2">{title}</div>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
        </div>
        <div className={`w-14 h-14 ${iconBg} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}`}>
        <span>{isPositive ? '↗' : isNegative ? '↘' : '→'}</span>
        <span className="font-semibold">{change}</span>
        <span className="text-gray-500">{trend === 'up' ? 'Up from yesterday' : trend === 'down' ? 'Down from yesterday' : 'Up from past week'}</span>
      </div>
    </div>
  );
};
