import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Setup axios interceptor untuk auth
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/users${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};