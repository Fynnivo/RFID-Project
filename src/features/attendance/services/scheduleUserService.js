const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ScheduleUserService = {
  async assignUser(userId, scheduleId) {
    const response = await fetch(`${API_BASE_URL}/api/schedule-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ userId, scheduleId }),
    });
    return await response.json();
  },

    async getAvailableUsers(scheduleId, search = '') {
    const response = await fetch(
      `${API_BASE_URL}/api/attendance/users/available?scheduleId=${scheduleId}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return await response.json();
  },

  async removeAssignment(userId, scheduleId) {
    const response = await fetch(
      `${API_BASE_URL}/api/schedule-users/${scheduleId}/${userId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return await response.json();
  },
};