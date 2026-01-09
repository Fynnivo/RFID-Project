// hooks/useSchedules.js
import { useState, useEffect } from 'react';
import scheduleService from '../services/scheduleService';

export const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using mock data for demo - replace with scheduleService.getSchedules() for real API
      const response = await scheduleService.getSchedules();
      setSchedules(response.schedules);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (scheduleData) => {
    setError(null);
    try {
      // Using mock data for demo - replace with scheduleService.createSchedule() for real API
      const response = await scheduleService.createSchedule(scheduleData);
      setSchedules(prev => [...prev, response.schedule]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSchedule = async (id, scheduleData) => {
    setError(null);
    try {
      // Using mock data for demo - replace with scheduleService.updateSchedule() for real API
      const response = await scheduleService.updateSchedule(id, scheduleData);
      setSchedules(prev => prev.map(schedule => 
        schedule.id === id ? response.schedule : schedule
      ));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSchedule = async (id) => {
    setError(null);
    try {
      // Using mock data for demo - replace with scheduleService.deleteSchedule() for real API
      await scheduleService.deleteSchedule(id);
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getScheduleById = (id) => {
    return schedules.find(schedule => schedule.id === id);
  };

  const getSchedulesByDay = (dayOfWeek) => {
    return schedules.filter(schedule => schedule.dayOfWeek === dayOfWeek);
  };

  const getActiveSchedules = () => {
    return schedules.filter(schedule => schedule.isActive);
  };

  const searchSchedules = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    return schedules.filter(schedule =>
      schedule.className.toLowerCase().includes(term) ||
      schedule.subject.toLowerCase().includes(term) ||
      schedule.instructor.toLowerCase().includes(term) ||
      schedule.room.toLowerCase().includes(term)
    );
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    schedules,
    loading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleById,
    getSchedulesByDay,
    getActiveSchedules,
    searchSchedules,
    refetch: fetchSchedules,
    clearError: () => setError(null)
  };
};

export default useSchedules;