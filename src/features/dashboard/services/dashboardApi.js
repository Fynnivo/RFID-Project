const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class DashboardApi {
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
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
      
      return [
        {
          title: 'Peoples',
          value: data.members?.toString() || '7',
          subtitle: 'Member',
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-100'
        },
        {
          title: 'Peoples',
          value: data.guestUsers?.toString() || '2',
          subtitle: 'Cadet Team',
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        },
        {
          title: 'Peoples',
          value: data.newMembers?.toString() || '9',
          subtitle: 'Main Team',
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-100'
        },
        {
          title: 'Peoples',
          value: data.totalMembers?.toString() || '18',
          subtitle: 'All Member',
          iconColor: 'text-green-600',
          bgColor: 'bg-green-100'
        }
      ];
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/profile`, {
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
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  async getNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/notifications`, {
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
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/notifications/${notificationId}/read`, {
        method: 'PUT',
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
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }
}

export const dashboardApi = new DashboardApi();
