import { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import toast from 'react-hot-toast';

export const useAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [latestAttendance, chartStats] = await Promise.all([
          attendanceService.getLatestAttendance(),
          attendanceService.getChartData()
        ]);

        setAttendanceData(latestAttendance);
        setChartData(chartStats);

      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError(err.message);
        toast.error('Failed to load attendance data');

        // Set fallback data
        setAttendanceData([
          { id: '92847188', name: 'Faris Sofyan', time: '08:23:15', status: 'Present', schedule: 'IoT Core Exp. 7' },
          { id: '92847189', name: 'Ravi Kumar', time: '08:23:15', status: 'Present', schedule: 'IoT Core Exp. 7' },
          { id: '92847190', name: 'Ahmad Daniyal', time: '08:23:15', status: 'Present', schedule: 'IoT Core Exp. 7' },
          { id: '92847191', name: 'Aminullah Anhar', time: '08:23:15', status: 'Present', schedule: 'IoT Core Exp. 7' }
        ]);

        setChartData([
          { day: 'MON', present: 250, permission: 200, sick: 100, absent: 50 },
          { day: 'TUE', present: 180, permission: 150, sick: 80, absent: 40 },
          { day: 'WED', present: 320, permission: 180, sick: 120, absent: 60 },
          { day: 'THU', present: 280, permission: 160, sick: 90, absent: 45 },
          { day: 'FRI', present: 200, permission: 140, sick: 70, absent: 35 },
          { day: 'SAT', present: 350, permission: 200, sick: 110, absent: 55 },
          { day: 'SUN', present: 300, permission: 170, sick: 95, absent: 48 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const markAttendance = async (userId, status) => {
    try {
      await attendanceService.markAttendance(userId, status);
      toast.success(`Attendance marked as ${status}`);
      
      // Refresh data after marking attendance
      const latestAttendance = await attendanceService.getLatestAttendance();
      setAttendanceData(latestAttendance);
      
    } catch (err) {
      console.error('Error marking attendance:', err);
      toast.error('Failed to mark attendance');
    }
  };

  const refreshAttendance = async () => {
    toast.promise(
      fetchAttendanceData(),
      {
        loading: 'Refreshing attendance data...',
        success: 'Attendance data updated!',
        error: 'Failed to refresh
