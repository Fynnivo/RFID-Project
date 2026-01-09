const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ScheduleService {
  async getSchedules() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedules`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  }

  async getScheduleById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch schedule');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  }

  async createSchedule(scheduleData) {
    try {
      // Format waktu dengan benar menggunakan ISO string
      const formattedData = {
        ...scheduleData,
        startTime: new Date(scheduleData.startTime).toISOString(),
        endTime: new Date(scheduleData.endTime).toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/api/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create schedule');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  }

  async updateSchedule(id, scheduleData) {
    try {
      if (!id) {
        throw new Error('Schedule ID is required');
      }

      // Format waktu dengan benar
      const formattedData = {
        ...scheduleData,
        dayOfWeek: scheduleData.dayOfWeek !== undefined ?
          parseInt(scheduleData.dayOfWeek) :
          0,
        // Pastikan format waktu benar
        startTime: scheduleData.startTime ? new Date(scheduleData.startTime).toISOString() : undefined,
        endTime: scheduleData.endTime ? new Date(scheduleData.endTime).toISOString() : undefined,
        isActive: Boolean(scheduleData.isActive)
      };

      // Debug log
      console.log('Original data:', scheduleData);
      console.log('Formatted data to send:', formattedData);

      const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update schedule');
      }

      const result = await response.json();
      console.log('Update response:', result);
      return result;

    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  }

  async deleteSchedule(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete schedule');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  }


}

export default new ScheduleService();