import axios from 'axios';
import { z } from 'zod';

// Schema validasi
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const login = async ({ email, password }) => {
  try {
    const validatedData = loginSchema.parse({ email, password });

    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      validatedData,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
        withCredentials: true,
      },
    );

    // Simpan token ke localStorage
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = {};
      error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      throw { type: 'validation', errors: fieldErrors };
    } else if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || 'Login failed.';
      throw { type: 'api', message };
    } else {
      throw { type: 'unknown', message: 'Unexpected error occurred.' };
    }
  }
};

const logout = async () => {
  try {
    await axios.post(
      `${API_BASE_URL}/api/auth/logout`,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
        withCredentials: true,
      }
    );
  } catch (error) {
    // Optional: handle error
  } finally {
    localStorage.removeItem('authToken');
  }
};

// Ambil user dari token di localStorage
const getUser = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user || null;
  } catch {
    return null;
  }
};

export const authService = {
  login,
  logout,
  getUser,
};