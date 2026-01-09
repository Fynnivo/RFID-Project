import { useAttendance } from '../hooks/useAttendance';
import { useDashboardData } from '../../dashboard/hooks/useDashboardData';
import { Card } from '@/shared/components/ui/card';
import { TrendingUp, Users, Loader2, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

const QuickStats = ({ selectedScheduleId, selectedDate }) => {
  const {
    loading,
    error,
    data,
    fetchAttendance
  } = useAttendance(selectedScheduleId);

  const { statsData } = useDashboardData();

  // Fetch data ketika scheduleId atau tanggal berubah
  useEffect(() => {
    if (selectedScheduleId && selectedDate) {
      fetchAttendance(selectedDate);
    }
  }, [selectedScheduleId, selectedDate, fetchAttendance]);

  const totalMember = (statsData || []).reduce((sum, stat) => sum + (stat.value || 0), 0);

  const attendanceRate = data?.stats && data.stats.totalAssigned
    ? ((data.stats.totalPresent + data.stats.totalLate)/ data.stats.totalAssigned * 100) .toFixed(2)
    : 0;

  const renderStatCard = (icon, value, label, isLoading) => {
    const IconComponent = icon;
    return (
      <Card className="p-4 bg-white border-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <IconComponent className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : value}
            </p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        </div>
      </Card>
    );
  };

  if (error) {
    return (
      <div className="flex gap-4">
        {renderStatCard(AlertCircle, "Error", "Tingkat Kehadiran", false)}
        {renderStatCard(AlertCircle, "Error", "Total Member", false)}
      </div>
    );
  }

  if (!selectedScheduleId) {
    return (
      <div className="flex gap-4">
        {renderStatCard(Users, "-", "Tingkat Kehadiran", false)}
        {renderStatCard(Users, totalMember, "Total Member", false)}
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {renderStatCard(
        TrendingUp,
        `${attendanceRate}%`,
        "Tingkat Kehadiran",
        loading && !data
      )}
      {renderStatCard(
        Users,
        totalMember,
        "Total Member",
        false
      )}
    </div>
  );
};

export default QuickStats;
