import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
        // Ambil user dari token JWT
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.user) {
            setUser(payload.user);
          }
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token, userData = null) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    } else {
      // fallback: ambil user dari token jika userData tidak ada
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.user) setUser(payload.user);
      } catch {
        setUser(null);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};