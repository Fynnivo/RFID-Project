// components/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Calendar, BookOpen, User, Clock } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData.js';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle.js';
import { getUpcomingSchedules } from '../services/scheduleService';
import { useAuditLogs } from '../hooks/useAuditLogs';
import StatsCard from '../components/StatsCards';
import AttendanceCart from '../components/AttendanceCart';
import AttendanceTable from '../components/AttendanceTable';
import Skeleton from '@/shared/components/ui/skeleton';
import Layout from '@/shared/components/Layout';

const Dashboard = () => {
  useDocumentTitle('IoT - Dashboard');
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const { statsData, chart, chartMode, setChartMode, loadingStats, loadingChart, refreshData } = useDashboardData();

  useEffect(() => {
    loadUpcomingSchedules();
  }, []);

  const loadUpcomingSchedules = () => {
    setScheduleLoading(true);
    getUpcomingSchedules()
      .then(schedules => {
        setUpcomingSchedule(schedules);
      })
      .catch(err => {
        console.error('Error loading upcoming schedules:', err);
        setUpcomingSchedule([]);
      })
      .finally(() => setScheduleLoading(false));
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const timeMatch = timeString.match(/T(\d{2}):(\d{2})/);
      if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}`;
      }
      const date = new Date(timeString);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      console.error('Error formatting time:', e);
      return '';
    }
  };

  // Label hari relatif dalam Bahasa Indonesia
  const getRelativeDayLabel = (daysUntil) => {
    if (daysUntil === 0) return 'Hari Ini';
    if (daysUntil === 1) return 'Besok';
    return `${daysUntil} hari lagi`;
  };

  const totalMember = (statsData || []).reduce((sum, stat) => sum + (stat.value || 0), 0);
  const { logs: attendanceData, loading: attendanceLoading } = useAuditLogs();

  return (
    <Layout title={"Dashboard"}>
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            key="all-member"
            title="Orang"
            value={totalMember}
            subtitle="Total Anggota"
            iconColor="text-orange-600"
            bgColor="bg-orange-100"
            loading={loadingStats}
          />
          {(statsData || []).map((stat, idx) => (
            <StatsCard key={idx} {...stat} loading={loadingStats} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Statistics Chart */}
          <div className="lg:col-span-2">
            <AttendanceCart
              data={chart}
              loading={loadingChart}
              mode={chartMode}
              onModeChange={setChartMode}
              onRefresh={refreshData}
            />
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-500 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Jadwal Mendatang
              </h3>
              <button
                onClick={loadUpcomingSchedules}
                disabled={scheduleLoading}
                className="p-1 rounded-md text-gray-400 hover:text-orange-500 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Perbarui jadwal"
              >
                <svg 
                  className={`w-4 h-4 ${scheduleLoading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {scheduleLoading ? (
                [...Array(3)].map((_, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2 w-1/2" />
                  </div>
                ))
              ) : upcomingSchedule.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Tidak ada jadwal mendatang</p>
                  <p className="text-gray-400 text-xs mt-1">Buat jadwal untuk melihatnya di sini</p>
                </div>
              ) : (
                upcomingSchedule.slice(0, 5).map((schedule, index) => (
                  <div 
                    key={schedule.id || index} 
                    className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-orange-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800 text-base flex-1 mr-2">
                        {schedule.className}
                      </h4>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-orange-600 font-medium px-2 py-1 bg-orange-50 rounded whitespace-nowrap">
                          {schedule.displayDay}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {getRelativeDayLabel(schedule.daysUntil)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                      <BookOpen className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{schedule.subject}</span>
                    </p>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        {schedule.displayTime || formatTime(schedule.startTime)}
                      </span>
                      <span className="flex items-center gap-1 truncate ml-2">
                        <User className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{schedule.instructor}</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!scheduleLoading && upcomingSchedule.length > 5 && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <a 
                  href="/schedule" 
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Lihat semua {upcomingSchedule.length} Jadwal
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Tabel Kehadiran Terbaru */}
        <div className="mt-6">
          <AttendanceTable
            data={attendanceData}
            loading={attendanceLoading}
          />
        </div>
      </main>
    </Layout>
  );
};

export default Dashboard;