import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const signup = async (name, email, phone, password, address = {}) => {
    try {
      const signupData = { name, email, phone, password };

      // Add address if provided and has at least one field
      if (address && (address.street || address.city || address.state || address.pincode)) {
        signupData.address = {
          name: name, // Use user's name as address name
          phone: phone, // Use user's phone
          ...address
        };
      }

      const response = await authAPI.signup(signupData);
      const { user: userData, token: newToken } = response.data.data;

      setUser(userData);
      setToken(newToken);

      localStorage.setItem('userToken', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Signup failed',
      };
    }
  };

  const login = async (phone, password) => {
    try {
      const response = await authAPI.login({ phone, password });
      const { user: userData, token: newToken } = response.data.data;

      setUser(userData);
      setToken(newToken);

      localStorage.setItem('userToken', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
  };

  const updateProfile = async (name, phone) => {
    try {
      const response = await authAPI.updateProfile({ name, phone });
      const updatedUser = response.data.data;

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Update failed',
      };
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
