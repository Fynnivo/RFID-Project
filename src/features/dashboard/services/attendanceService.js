const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AttendanceService {
  async getUserAttendance(userId) {
    const response = await fetch(`${API_BASE_URL}/api/attendance/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch attendance');
    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to fetch attendance');
    return result.attendance;
  }
}

export const attendanceService = new AttendanceService();