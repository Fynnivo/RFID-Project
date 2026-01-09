const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AttendanceService = {
  async scanAttendance(rfidCard) {
    const response = await fetch(`${API_BASE_URL}/api/attendance/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ rfidCard }),
    });
    return await response.json();
  },

  async getBySchedule(scheduleId, date) {
    const response = await fetch(
      `${API_BASE_URL}/api/attendance/by-schedule/${scheduleId}?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return await response.json();
  },

  async updateAttendance(id, { status, notes, isLate }) {
    const response = await fetch(`${API_BASE_URL}/api/attendance/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ status, notes, isLate }),
    });
    return await response.json();
  },

  async deleteAttendance(id) {
    const response = await fetch(`${API_BASE_URL}/api/attendance/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return await response.json();
  },

  async createManualAttendance({ userId, scheduleId, status, notes, scanTime }) {
    const response = await fetch(`${API_BASE_URL}/api/attendance/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        userId,
        scheduleId,
        status,
        scanTime, // <--- gunakan scanTime dari parameter!
        notes: notes || `Manual entry by admin - Status: ${status}`,
      }),
    });
    return await response.json();
  },

  async getLastAttendanceBySchedule(scheduleId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance/last/schedule/${scheduleId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch last attendance by schedule');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching last attendance by schedule:', error);
      throw error;
    }
  }
};
