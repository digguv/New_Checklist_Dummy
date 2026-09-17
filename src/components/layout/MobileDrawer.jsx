import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSystem } from '../../context/SystemContext';
import { SystemSelector } from './SystemSelector';
import { X, Building2, Eye } from 'lucide-react';

export function MobileDrawer({ isOpen, onClose }) {
  const { user, role, isAdmin, isManager } = useAuth();
  const { currentSystem } = useSystem();

  if (!isOpen) return null;

  const rawNavItems = currentSystem.navItems || [];

  const navItems = rawNavItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.requiresSelfAssignOrManager) {
      if (isAdmin || isManager) return true;
      return user?.self_assign_enabled !== false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm flex">
      <div className="w-4/5 max-w-xs bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between shadow-2xl p-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-sm">TaskFlow OS</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* System Switcher */}
          <div className="mb-3">
            <SystemSelector />
          </div>

          <div className="px-2 py-1 flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 mb-2">
            <span className="flex items-center gap-1 text-indigo-400">
              <Eye className="w-3 h-3" /> Unhidden System Pages
            </span>
            <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
              {navItems.length}
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Role: <strong className="text-indigo-400">{role}</strong></span>
          <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
            {currentSystem.shortName}
          </span>
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
