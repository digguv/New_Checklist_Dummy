import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, UserCheck, Users } from 'lucide-react';

export function RoleSwitcher() {
  const { role, switchRole } = useAuth();

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 px-2 hidden lg:inline-block">
        Demo Role:
      </span>
      <button
        onClick={() => switchRole('ADMIN')}
        className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          role === 'ADMIN'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
        title="Switch to Admin view"
      >
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>Admin</span>
      </button>
      <button
        onClick={() => switchRole('MANAGER')}
        className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          role === 'MANAGER'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
        title="Switch to Manager view"
      >
        <Users className="w-3.5 h-3.5" />
        <span>Manager</span>
      </button>
      <button
        onClick={() => switchRole('EMPLOYEE')}
        className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          role === 'EMPLOYEE'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
        title="Switch to Employee view"
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span>Employee</span>
      </button>
    </div>
  );
}
