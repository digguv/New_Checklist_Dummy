import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Bell,
  ClipboardList,
  CheckSquare,
  Calendar,
  PartyPopper,
  Sliders,
  Building2
} from 'lucide-react';

export function Sidebar() {
  const { role } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  // REQUIREMENT #5: Strict Sequence: Dashboard, Notification, Task Assignment, My Task, Calendar, Holiday, Masters
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
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`hidden md:flex flex-col bg-slate-900 text-slate-300 min-h-screen border-r border-slate-800 shrink-0 transition-all duration-300 z-40 ${
        isHovered ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center space-x-3 px-4 h-16 border-b border-slate-800 overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30">
          <Building2 className="w-5 h-5" />
        </div>
        {isHovered && (
          <div className="transition-opacity duration-200">
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none">TaskFlow OS</h1>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-400">Checklist & Delegation</span>
          </div>
        )}
      </div>

      {/* Sequential Nav List */}
      <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
                title={!isHovered ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isHovered && <span className="whitespace-nowrap transition-opacity duration-200">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Role Footing */}
      {isHovered && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Role</span>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/50">
              {role}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
