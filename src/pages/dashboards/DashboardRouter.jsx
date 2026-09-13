import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { EmployeeDashboard } from './EmployeeDashboard';

export function DashboardRouter() {
  const { role } = useAuth();

  if (role === 'ADMIN') {
    return <AdminDashboard />;
  }
  if (role === 'MANAGER') {
    return <ManagerDashboard />;
  }
  return <EmployeeDashboard />;
}
