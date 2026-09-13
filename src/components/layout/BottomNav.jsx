import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Plus, Bell, Calendar } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 px-3 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around relative">
        {/* 1. Dashboard / Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${isActive
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Dashboard</span>
        </NavLink>

        {/* 2. My Task */}
        <NavLink
          to="/my-tasks"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${isActive
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 font-semibold">My Task</span>
        </NavLink>

        {/* 3. Central Floating Action Button (+ New Task / Task Assignment) */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={() => navigate('/task-assignment')}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 ring-4 ring-slate-50 dark:ring-slate-950 transform active:scale-95 transition-all"
            title="Assign New Task"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight mt-0.5">
            Assign
          </span>
        </div>

        {/* 4. Alerts / Notifications */}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${isActive
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Alerts</span>
        </NavLink>

        {/* 5. Calendar */}
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${isActive
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Calendar</span>
        </NavLink>
      </div>
    </div>
  );
}
