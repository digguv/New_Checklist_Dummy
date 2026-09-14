import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Auth load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      notificationService.notifyLogin(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const newUser = await authService.signup(userData);
      setUser(newUser);
      notificationService.notifyLogin(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (user) {
        notificationService.notifyLogout(user);
      }
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (targetRole) => {
    setLoading(true);
    try {
      const switchedUser = await authService.switchDemoRole(targetRole);
      setUser(switchedUser);
      notificationService.notifyLogin(switchedUser);
      return switchedUser;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData) => {
    if (!user) return;
    const updated = await authService.updateProfile(user.id, updateData);
    setUser(updated);
    return updated;
  };

  const value = {
    user,
    role: user?.role || 'EMPLOYEE',
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'MANAGER',
    isEmployee: user?.role === 'EMPLOYEE',
    loading,
    login,
    signup,
    logout,
    switchRole,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
