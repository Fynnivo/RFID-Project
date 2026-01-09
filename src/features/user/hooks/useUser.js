import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useUser = (id) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUserById(id);
      setUser(response.user);
    } catch (err) {
      setError(err.message || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser
  };
};