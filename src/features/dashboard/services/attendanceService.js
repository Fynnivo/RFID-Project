const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AttendanceService {
  async getLatestAttendance(limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/latest?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.map(item => ({
        id: item.id || item.uid,
        name: item.memberName || item.name,
        time: item.timestamp || item.time,
        status: item.status,
        schedule: item.scheduleName || item.schedule
      }));
    } catch (error) {
      console.error('Error fetching latest attendance:', error);
      throw new Error('Failed to fetch latest attendance');
    }
  }

  async getChartData(period = 'weekly') {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/chart?period=${period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.map(item => ({
        day: item.day,
        present: item.present || 0,
        permission: item.permission || 0,
        sick: item.sick || 0,
        absent: item.absent || 0
      }));
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw new Error('Failed to fetch chart data');
    }
  }

  async markAttendance(userId, status, scheduleId = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          status,
          scheduleId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw new Error('Failed to mark attendance');
    }
  }

  async updateAttendance(attendanceId, newStatus) {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${attendanceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: newStatus,
          updatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw new Error('Failed to update attendance');
    }
  }

  async deleteAttendance(attendanceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${attendanceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting attendance:', error);
      throw new Error('Failed to delete attendance');
    }
  }

  async getAttendanceByUser(userId, startDate = null, endDate = null) {
    try {
      let url = `${API_BASE_URL}/attendance/user/${userId}`;
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user attendance:', error);
      throw new Error('Failed to fetch user attendance');
    }
  }

  async exportAttendance(format = 'csv', filters = {}) {
    try {
      const params = new URLSearchParams({
        format,
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/attendance/export?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true };
    } catch (error) {
      console.error('Error exporting attendance:', error);
      throw new Error('Failed to export attendance data');
    }
  }
}

export const attendanceService = new AttendanceService();
