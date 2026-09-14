import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { TaskUpdateModal } from '../../components/tasks/TaskUpdateModal';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { formatDate } from '../../lib/utils';
import { Eye, Edit3, CheckSquare, ListTodo, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MyTasksPage() {
  const { user, isAdmin, isManager } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Checklist'); // Checklist OR Delegation only!

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    priority: 'All',
    department: 'All',
  });

  // Modal States
  const [selectedTaskForUpdate, setSelectedTaskForUpdate] = useState(null);
  const [selectedTaskIdForDetail, setSelectedTaskIdForDetail] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [user, filters, activeTab]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const combinedFilters = {
        ...filters,
        user,
        taskType: activeTab === 'Checklist' ? 'checklist' : 'delegation',
      };

      const data = await taskService.getTasks(combinedFilters);
      setTasks(data);
    } catch (err) {
      console.error('Failed to load my tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      priority: 'All',
      department: 'All',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Tasks</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            View your assigned operational checklists and delegated work items
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {(isAdmin || isManager) && (
            <Link
              to="/task-assignment"
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>Task Assignment Hub</span>
            </Link>
          )}
        </div>
      </div>

      {/* REQUIREMENT #1: Strictly ONLY 2 Tabs: Checklist & Delegation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('Checklist')}
          className={`flex items-center space-x-2 px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === 'Checklist'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          <span>Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('Delegation')}
          className={`flex items-center space-x-2 px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === 'Delegation'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Delegation</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />

      {/* Data Table with REQUIREMENT #5: 1st Column = Action */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading your tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No assigned tasks found under {activeTab}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {/* REQUIREMENT #5: 1st Column is ACTION */}
                  <th className="px-4 py-3.5 w-32">Action</th>
                  <th className="px-4 py-3.5">Task Code</th>
                  <th className="px-4 py-3.5">Task Title</th>
                  <th className="px-4 py-3.5">Frequency</th>
                  <th className="px-4 py-3.5">Assigned By</th>
                  <th className="px-4 py-3.5">Due Date</th>
                  <th className="px-4 py-3.5">Priority</th>
                  <th className="px-4 py-3.5">Attachment</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* 1ST COLUMN: ACTION */}
                    <td className="px-4 py-3 font-semibold">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setSelectedTaskForUpdate(t)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Update</span>
                        </button>
                        <button
                          onClick={() => setSelectedTaskIdForDetail(t.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="View History"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.task_code}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">{t.title}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {t.frequency || (activeTab === 'Delegation' ? 'One Time' : 'Daily')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{t.assigned_by_name || 'Manager'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(t.due_date)}</td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="px-4 py-3">
                      {t.required_attachment ? (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                          Required
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Optional</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <TaskUpdateModal
        isOpen={Boolean(selectedTaskForUpdate)}
        onClose={() => setSelectedTaskForUpdate(null)}
        task={selectedTaskForUpdate}
        onSuccess={loadTasks}
      />

      <TaskDetailModal
        isOpen={Boolean(selectedTaskIdForDetail)}
        onClose={() => setSelectedTaskIdForDetail(null)}
        taskId={selectedTaskIdForDetail}
      />
    </div>
  );
}

