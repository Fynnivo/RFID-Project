const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ScheduleService = {
  async getAllSchedules() {
    const response = await fetch(`${API_BASE_URL}/api/schedules`, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('authToken')}` 
      },
    });
    return await response.json();
  },
};