import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SalesChart = () => {
  const data = [
    { x: 5000, y: 28 },
    { x: 7000, y: 30 },
    { x: 10000, y: 38 },
    { x: 12000, y: 42 },
    { x: 15000, y: 35 },
    { x: 17000, y: 40 },
    { x: 18000, y: 48 },
    { x: 20000, y: 84 },
    { x: 22000, y: 42 },
    { x: 25000, y: 52 },
    { x: 27000, y: 48 },
    { x: 30000, y: 58 },
    { x: 32000, y: 55 },
    { x: 35000, y: 62 },
    { x: 37000, y: 28 },
    { x: 40000, y: 32 },
    { x: 42000, y: 48 },
    { x: 45000, y: 52 },
    { x: 47000, y: 58 },
    { x: 50000, y: 62 },
    { x: 52000, y: 68 },
    { x: 55000, y: 58 },
    { x: 57000, y: 55 },
    { x: 60000, y: 65 }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Sales Details</h2>
        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>October</option>
          <option>November</option>
          <option>December</option>
        </select>
      </div>
      
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="x" 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <YAxis 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#3b82f6', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '12px',
                  padding: '8px 12px'
                }}
                formatter={(value) => [`${value}%`, 'Sales']}
                labelFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
