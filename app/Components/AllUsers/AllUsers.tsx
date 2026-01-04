import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AllUsers = () => {
  const [timePeriod, setTimePeriod] = useState('last_year');

  // البيانات حسب الفترة الزمنية
  const dataByPeriod = {
    last_month: [
      { x: 1, active: 4200, inactive: 580 },
      { x: 5, active: 4250, inactive: 590 },
      { x: 10, active: 4350, inactive: 585 },
      { x: 15, active: 4500, inactive: 595 },
      { x: 20, active: 4600, inactive: 600 },
      { x: 25, active: 4750, inactive: 610 },
      { x: 30, active: 4900, inactive: 620 }
    ],
    last_6_months: [
      { x: 1, active: 2800, inactive: 480 },
      { x: 2, active: 3200, inactive: 520 },
      { x: 3, active: 3600, inactive: 490 },
      { x: 4, active: 4000, inactive: 550 },
      { x: 5, active: 4500, inactive: 580 },
      { x: 6, active: 4900, inactive: 620 }
    ],
    last_year: [
      { x: 1, active: 1200, inactive: 350 },
      { x: 2, active: 1500, inactive: 420 },
      { x: 3, active: 1800, inactive: 380 },
      { x: 4, active: 2100, inactive: 450 },
      { x: 5, active: 2400, inactive: 500 },
      { x: 6, active: 2800, inactive: 480 },
      { x: 7, active: 3200, inactive: 520 },
      { x: 8, active: 3600, inactive: 490 },
      { x: 9, active: 4000, inactive: 550 },
      { x: 10, active: 4500, inactive: 580 },
      { x: 11, active: 5000, inactive: 600 },
      { x: 12, active: 5500, inactive: 620 }
    ],
    last_2_years: [
      { x: 1, active: 400, inactive: 180 },
      { x: 3, active: 650, inactive: 210 },
      { x: 6, active: 1100, inactive: 280 },
      { x: 9, active: 1600, inactive: 340 },
      { x: 12, active: 2200, inactive: 410 },
      { x: 15, active: 2900, inactive: 460 },
      { x: 18, active: 3700, inactive: 510 },
      { x: 21, active: 4600, inactive: 570 },
      { x: 24, active: 5500, inactive: 620 }
    ],
    last_4_years: [
      { x: 1, active: 150, inactive: 80 },
      { x: 6, active: 450, inactive: 140 },
      { x: 12, active: 1200, inactive: 280 },
      { x: 18, active: 2100, inactive: 380 },
      { x: 24, active: 2900, inactive: 450 },
      { x: 30, active: 3600, inactive: 500 },
      { x: 36, active: 4200, inactive: 550 },
      { x: 42, active: 4800, inactive: 590 },
      { x: 48, active: 5500, inactive: 620 }
    ],
    last_5_years: [
      { x: 1, active: 100, inactive: 50 },
      { x: 6, active: 300, inactive: 110 },
      { x: 12, active: 800, inactive: 220 },
      { x: 18, active: 1500, inactive: 320 },
      { x: 24, active: 2200, inactive: 400 },
      { x: 30, active: 2900, inactive: 460 },
      { x: 36, active: 3500, inactive: 510 },
      { x: 42, active: 4100, inactive: 560 },
      { x: 48, active: 4700, inactive: 600 },
      { x: 54, active: 5100, inactive: 610 },
      { x: 60, active: 5500, inactive: 620 }
    ]
  };

  const data = dataByPeriod[timePeriod];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const activeUsers = payload.find(p => p.dataKey === 'active')?.value || 0;
      const inactiveUsers = payload.find(p => p.dataKey === 'inactive')?.value || 0;
      const total = activeUsers + inactiveUsers;
      
      let labelText = '';
      if (timePeriod === 'last_month') {
        labelText = `Day ${label}`;
      } else if (timePeriod === 'last_6_months') {
        labelText = `Month ${label}`;
      } else if (timePeriod === 'last_year') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        labelText = months[label - 1];
      } else {
        labelText = `Month ${label}`;
      }

      return (
        <div style={{
          backgroundColor: '#3b82f6',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '12px',
          padding: '10px 14px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>{labelText}</div>
          <div style={{ marginBottom: '4px' }}>
            Active: <span style={{ fontWeight: 'bold' }}>{activeUsers.toLocaleString()}</span>
          </div>
          <div style={{ marginBottom: '4px' }}>
            Inactive: <span style={{ fontWeight: 'bold' }}>{inactiveUsers.toLocaleString()}</span>
          </div>
          <div style={{ paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
            Total: <span style={{ fontWeight: 'bold' }}>{total.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // حساب المجموع
  const lastDataPoint = data[data.length - 1];
  const totalActive = lastDataPoint.active;
  const totalInactive = lastDataPoint.inactive;

  // X-Axis Formatter
  const formatXAxis = (value) => {
    if (timePeriod === 'last_month') {
      return `Day ${value}`;
    } else if (timePeriod === 'last_6_months') {
      return `M${value}`;
    } else if (timePeriod === 'last_year') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[value - 1];
    } else {
      return `M${value}`;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">All Users</h2>
        <select 
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="last_month">Last Month</option>
          <option value="last_6_months">Last 6 Months</option>
          <option value="last_year">Last Year</option>
          <option value="last_2_years">Last 2 Years</option>
          <option value="last_4_years">Last 4 Years</option>
          <option value="last_5_years">Last 5 Years</option>
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
                tickFormatter={formatXAxis}
              />
              <YAxis 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="active" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
              <Line 
                type="monotone" 
                dataKey="inactive" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Active Users</p>
              <p className="text-xl font-bold text-gray-900">{totalActive.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Inactive Users</p>
              <p className="text-xl font-bold text-gray-900">{totalInactive.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Users</p>
              <p className="text-xl font-bold text-gray-900">{(totalActive + totalInactive).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;