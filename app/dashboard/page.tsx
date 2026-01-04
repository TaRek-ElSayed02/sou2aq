'use client';
import React, { useState } from 'react';
import { Package, DollarSign, User, Eye } from 'lucide-react';
import { Sidebar } from '../Components/SideBar/SideBar';
import { Navbar } from '../Components/Navbar/Navbar';
import { SalesChart } from '../Components/SalesChart/SalesChart';
import { StatCard } from '../Components/StatCard/StatCard';
import { DealsDetails } from '../Components/DealsDetails/DealsDetails';
import AllShops from '../Components/AllShops/AllShops';
import AllUsers from '../Components/AllUsers/AllUsers';
import TopSale from '../Components/TopSale/TopSale';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex flex-col">

        <div className="flex-1">
          <div className="lg:p-6 p-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="Total User"
                value="40,689"
                change="8.5%"
                trend="up"
                icon={<User className="w-7 h-7 text-purple-600" />}
                iconBg="bg-purple-100"
              />
              <StatCard
                title="Total Order"
                value="10293"
                change="1.3%"
                trend="up"
                icon={<Package className="w-7 h-7 text-amber-600" />}
                iconBg="bg-amber-100"
              />
              <StatCard
                title="Total Sales"
                value="$89,000"
                change="4.3%"
                trend="ChevronDown"
                icon={<DollarSign className="w-7 h-7 text-green-600" />}
                iconBg="bg-green-100"
              />
              <StatCard
                title="Total Pending"
                value="2040"
                change="1.8%"
                trend="up"
                icon={<Clock className="w-7 h-7 text-pink-600" />}
                iconBg="bg-pink-100"
              />
              <StatCard
                title="Total Visits"
                value="540"
                change="1.8%"
                trend="up"
                icon={<Eye  className="w-7 h-7 text-orange-600" />}
                iconBg="bg-orange-100"
              />
            </div>

            {/* Sales Chart */}
            <div className="mb-6">
              <SalesChart />
            </div>

            {/* Deals Details */}
            <DealsDetails />

            {/* All Shops */}
            <div className="mt-6">
              <AllShops />
            </div>

            {/* All Users */}
            <div className="mt-6">
              <AllUsers />
            </div>
            {/* top sale */}
             <div className="mt-6">
              <TopSale />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Clock = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);