import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  LayoutDashboard,
  Bell,
  ClipboardList,
  CheckSquare,
  Calendar,
  PartyPopper,
  Sliders,
  Building2
} from 'lucide-react';

export function MobileDrawer({ isOpen, onClose }) {
  const { role } = useAuth();

  if (!isOpen) return null;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Notification', path: '/notifications', icon: Bell },
    { label: 'Task Assignment', path: '/task-assignment', icon: ClipboardList },
    { label: 'My Task', path: '/my-tasks', icon: CheckSquare },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Holiday', path: '/holidays', icon: PartyPopper },
    { label: 'Masters', path: '/masters', icon: Sliders },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm flex">
      <div className="w-4/5 max-w-xs bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between shadow-2xl p-4">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
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

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
          Role: <span className="font-bold text-indigo-400">{role}</span>
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
