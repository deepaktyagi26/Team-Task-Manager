import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/auth/me?t=${Date.now()}`);
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post('http://127.0.0.1:5000/api/auth/register', { name, email, password, role });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (name, email) => {
    const oldUser = { ...user };
    // 1. Optimistically update local state
    setUser(prev => ({ ...prev, name, email }));
    
    try {
      // 2. Perform the actual update on server
      const token = localStorage.getItem('token');
      const res = await axios.post('http://127.0.0.1:5000/api/auth/update-profile', 
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // 3. Immediately sync state from server response
      setUser(res.data.user);
      
      // 4. Background re-fetch for absolute consistency
      fetchUser();
    } catch (err) {
      if (!err.response) {
        console.error("NETWORK ERROR: Cannot reach backend server at http://localhost:5000");
      } else {
        console.error("SERVER UPDATE FAILED:", err.response?.data || err.message);
      }
      // Rollback to old state if server update failed
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
