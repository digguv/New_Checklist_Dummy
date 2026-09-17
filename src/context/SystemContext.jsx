import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SYSTEMS_CONFIG } from '../config/systemsConfig';
import { getCurrentUser } from '../services/otdStorageService';

const SystemContext = createContext();

export function SystemProvider({ children }) {
  const [activeSystemId, setActiveSystemId] = useState(() => {
    return localStorage.getItem('taskflow_active_system') || 'checklist';
  });

  const [currentUser, setCurrentUserState] = useState(() => getCurrentUser());

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleUpdate = () => {
      setCurrentUserState(getCurrentUser());
    };
    window.addEventListener('otd_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('otd_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Module Permission Filtering
  const allowedModules = currentUser?.allowedModules;

  const systemsList = SYSTEMS_CONFIG.filter((sys) => {
    // If no permission restrictions set or user is Admin, allow all modules
    if (currentUser?.userGroup === 'Admin' || currentUser?.role === 'ADMIN' || !allowedModules || allowedModules.length === 0) {
      return true;
    }
    return allowedModules.includes(sys.id);
  });

  const currentSystem = systemsList.find((sys) => sys.id === activeSystemId) || systemsList[0] || SYSTEMS_CONFIG[0];

  const switchSystem = (systemId, shouldNavigate = true) => {
    const targetSystem = systemsList.find((sys) => sys.id === systemId);
    if (!targetSystem) return;

    setActiveSystemId(systemId);
    localStorage.setItem('taskflow_active_system', systemId);

    if (shouldNavigate) {
      navigate(targetSystem.defaultPath);
    }
  };

  // Sync current active system if URL path belongs directly to a specific system
  useEffect(() => {
    const currentPath = location.pathname;

    // Find matching system for current path
    const matchingSystem = systemsList.find((sys) =>
      sys.navItems.some((item) => item.path === currentPath)
    );

    if (matchingSystem && matchingSystem.id !== activeSystemId) {
      setActiveSystemId(matchingSystem.id);
      localStorage.setItem('taskflow_active_system', matchingSystem.id);
    }
  }, [location.pathname, systemsList, activeSystemId]);

  return (
    <SystemContext.Provider
      value={{
        activeSystemId,
        currentSystem,
        switchSystem,
        systemsList,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
}
