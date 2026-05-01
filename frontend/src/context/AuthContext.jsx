import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/api/auth/me?t=${Date.now()}`);
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (name, email, password, role) => {
    const res = await api.post('/api/auth/register', { name, email, password, role });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (name, email) => {
    const oldUser = { ...user };
    setUser(prev => ({ ...prev, name, email }));
    
    try {
      const res = await api.post('/api/auth/update-profile', { name, email });
      
      setUser(res.data.user);
      fetchUser();
    } catch (err) {
      if (!err.response) {
        console.error("NETWORK ERROR: Cannot reach backend server. Check your VITE_API_URL.");
      } else {
        console.error("SERVER UPDATE FAILED:", err.response?.data || err.message);
      }
      setUser(oldUser);
      throw err;
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
