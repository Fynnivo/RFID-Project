import React from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCards';
import AttendanceChart from '../components/AttendanceCart';
import AttendanceTable from '../components/AttendanceTable';
import { useDashboardData } from '../hooks/useDashboardData.js';
import { useAttendance } from '../hooks/useAttendance.js';

const Dashboard = () => {
  const { statsData, loading: statsLoading } = useDashboardData();
  const { attendanceData, chartData, loading: attendanceLoading } = useAttendance();

  const upcomingSchedule = [
    { name: 'Schedule Name', description: 'Lorem ipsum sit amet consectetur elit do eiusmod' },
    { name: 'Schedule Name', description: 'Lorem ipsum sit amet consectetur elit do eiusmod' },
    { name: 'Schedule Name', description: 'Lorem ipsum sit amet consectetur elit do eiusmod' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64">
        <Header />
        
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                iconColor={stat.iconColor}
                bgColor={stat.bgColor}
                loading={statsLoading}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Statistics Chart */}
            <div className="lg:col-span-2">
              <AttendanceChart 
                data={chartData} 
                loading={attendanceLoading}
              />
            </div>

            {/* Upcoming Schedule */}
            <div className="bg-white p-6 rounded-xl shadow-sm ">
              <h3 className="text-lg font-semibold text-orange-500 mb-4">Upcoming Schedule</h3>
              <div className="space-y-4">
                {upcomingSchedule.map((schedule, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-1">{schedule.name}</h4>
                    <p className="text-sm text-gray-600">{schedule.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Attendance Table */}
          <div className="mt-6">
            <AttendanceTable 
              data={attendanceData} 
              loading={attendanceLoading}
            />
          </div>

          {/* User Profile */}
          <div className="fixed bottom-4 left-4">
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-lg border">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">EA</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Edan Arafat</p>
                <p className="text-xs text-gray-600">admin</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
