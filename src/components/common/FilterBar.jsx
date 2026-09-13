import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { DEPARTMENTS } from '../../config/constants';

export function FilterBar({ filters, onFilterChange, onReset }) {
  const hasActiveFilters =
    filters.search ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.taskType !== 'All' ||
    filters.department !== 'All';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm mb-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, code, employee..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Status */}
        <div>
          <select
            value={filters.status || 'All'}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Not Done">Not Done</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <select
            value={filters.priority || 'All'}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Task Type */}
        <div>
          <select
            value={filters.taskType || 'All'}
            onChange={(e) => onFilterChange('taskType', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          >
            <option value="All">All Types</option>
            <option value="checklist">Checklist</option>
            <option value="delegation">Delegation</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <select
            value={filters.department || 'All'}
            onChange={(e) => onFilterChange('department', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
