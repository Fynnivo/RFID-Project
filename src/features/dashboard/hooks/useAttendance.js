import { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from '../../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

export const useAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user) throw new Error('User not found');
      const data = await attendanceService.getUserAttendance(user.id);
      setAttendanceData(
        data.map(item => ({
          id: item.id,
          name: item.user?.fullName || '-',
          time: new Date(item.scanTime).toLocaleTimeString(),
          status: item.status,
          schedule: item.schedule?.className || '-'
        }))
      );
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load attendance data');
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
    // eslint-disable-next-line
  }, [user]);

  return {
    attendanceData,
    loading,
    error,
    refreshAttendance: fetchAttendanceData,
  };
};