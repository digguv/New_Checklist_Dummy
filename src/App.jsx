import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { ProfilePage } from './pages/auth/ProfilePage';
import { DashboardRouter } from './pages/dashboards/DashboardRouter';
import { MyTasksPage } from './pages/tasks/MyTasksPage';
import { TaskAssignmentPage } from './pages/tasks/TaskAssignmentPage';
import { CalendarPage } from './pages/calendar/CalendarPage';
import { HolidaysPage } from './pages/holidays/HolidaysPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { MastersPage } from './pages/masters/MastersPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Requirement #5 Sequential Navigation Order */}
        <Route path="dashboard" element={<DashboardRouter />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="task-assignment" element={<TaskAssignmentPage />} />
        <Route path="my-tasks" element={<MyTasksPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="holidays" element={<HolidaysPage />} />
        <Route path="masters" element={<MastersPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
