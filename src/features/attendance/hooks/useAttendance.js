import { useState, useCallback, useEffect } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { customToast as toast } from '@/shared/utils/lib/toast';
import { AttendanceService } from '../services/attendanceService';
import { ScheduleUserService } from '../services/scheduleUserService';

export const useAttendance = (scheduleId) => {
  const [data, setData] = useState(null);
  const [lastAttendance, setLastAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDateForAPI = useCallback((date) => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) {
        throw new Error('Invalid date');
      }
      return format(dateObj, 'yyyy-MM-dd');
    } catch (err) {
      console.error('Date formatting error:', err);
      return format(new Date(), 'yyyy-MM-dd');
    }
  }, []);

  const fetchAttendance = useCallback(async (date = new Date()) => {
    if (!scheduleId) return;

    setLoading(true);
    setError('');

    try {
      const formattedDate = formatDateForAPI(date);
      const result = await AttendanceService.getBySchedule(scheduleId, formattedDate);

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
        toast.error(result.message || 'Failed to fetch attendance data');
      }

      // ✅ FIXED: Handle response yang bisa null/error dengan proper error handling
      try {
        const lastAttendanceData = await AttendanceService.getLastAttendanceBySchedule(scheduleId);
        if (lastAttendanceData.success && lastAttendanceData.data) {
          setLastAttendance(lastAttendanceData.data);
        } else {
          // Set to null if no data found (not an error condition)
          setLastAttendance(null);
          console.log('No last attendance data found for schedule:', scheduleId);
        }
      } catch (lastAttendanceError) {
        console.warn('Failed to fetch last attendance:', lastAttendanceError);
        setLastAttendance(null); // Set to null instead of throwing error
      }

    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  }, [scheduleId, formatDateForAPI]);

  const updateAttendance = useCallback(async (id, updates, date) => {
    setLoading(true);
    try {
      const result = await AttendanceService.updateAttendance(id, updates);
      if (result.success) {
        toast.success('Attendance updated successfully');
        await fetchAttendance(date);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update attendance');
    } finally {
      setLoading(false);
    }
  }, [fetchAttendance]);

  const deleteAttendance = useCallback(async (id, date) => {
    setLoading(true);
    try {
      const result = await AttendanceService.deleteAttendance(id);
      if (result.success) {
        toast.success('Attendance deleted successfully');
        await fetchAttendance(date);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete attendance');
    } finally {
      setLoading(false);
    }
  }, [fetchAttendance]);

  const createManualAttendance = useCallback(async (userId, status, notes, date) => {
    setLoading(true);
    try {
      const scanTime = date
        ? `${date}T08:00:00.000Z`
        : new Date().toISOString();

      const result = await AttendanceService.createManualAttendance({
        userId,
        scheduleId,
        status,
        notes,
        scanTime,
      });
      if (result.success) {
        toast.success('Manual attendance created');
        await fetchAttendance(date);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create manual attendance');
    } finally {
      setLoading(false);
    }
  }, [scheduleId, fetchAttendance]);

  const assignUser = useCallback(async (userId) => {
    setLoading(true);
    try {
      const result = await ScheduleUserService.assignUser(userId, scheduleId);
      if (result.success) {
        toast.success('User assigned to schedule');
        await fetchAttendance();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to assign user');
    } finally {
      setLoading(false);
    }
  }, [scheduleId, fetchAttendance]);

  const removeAssignment = useCallback(async (scheduleIdToRemove, userId) => {
    setLoading(true);
    try {
      const result = await ScheduleUserService.removeAssignment(scheduleIdToRemove, userId);
      if (result.success) {
        toast.success('Assignment removed');
        await fetchAttendance();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove assignment');
    } finally {
      setLoading(false);
    }
  }, [fetchAttendance]);

  return {
    data,
    loading,
    error,
    fetchAttendance,
    updateAttendance,
    deleteAttendance,
    createManualAttendance,
    assignUser,
    removeAssignment,
    lastAttendance,
  };
};
