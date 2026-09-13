import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { TaskCompletionModal } from '../../components/tasks/TaskCompletionModal';
import { ExtensionModal } from '../../components/tasks/ExtensionModal';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  Calendar,
  User,
  Eye,
  Plus
} from 'lucide-react';

export function EmployeeDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedTaskForCompletion, setSelectedTaskForCompletion] = useState(null);
  const [selectedTaskForExtension, setSelectedTaskForExtension] = useState(null);
  const [selectedTaskIdForDetail, setSelectedTaskIdForDetail] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [user]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks({ user });
      setTasks(data);
    } catch (err) {
      console.error('Failed to load employee tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = async (taskId) => {
    try {
      await taskService.updateTaskStatus(taskId, 'In Progress', {}, user);
      loadTasks();
    } catch (err) {
      alert(err.message || 'Failed to start task');
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-400">Loading your task dashboard...</div>;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.start_date === todayStr || t.status === 'In Progress');
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const overdueCount = tasks.filter((t) => t.status === 'Overdue').length;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Track your assigned daily checklists, one-time delegations, and submit task completion proofs
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 mb-2">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Today's Tasks</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{todayTasks.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-amber-50 text-amber-600 mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{pendingCount}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-blue-50 text-blue-600 mb-2">
            <Play className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">In Progress</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{inProgressCount}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{completedCount}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-rose-50 text-rose-600 mb-2">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Overdue</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{overdueCount}</p>
        </div>
      </div>

      {/* Today's Focus Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Today's Focus Tasks</h2>
        </div>

        {todayTasks.length === 0 ? (
          <div className="p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-60" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">All caught up for today!</h3>
            <p className="text-xs text-slate-400 mt-1">Check "My Tasks" for upcoming scheduled items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayTasks.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                        {t.task_code}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {t.type}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{t.title}</h3>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <PriorityBadge priority={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>By: {t.assigned_by_name || 'Manager'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: {new Date(t.due_date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setSelectedTaskIdForDetail(t.id)}
                    className="p-2 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {t.status === 'Pending' && (
                    <button
                      onClick={() => handleStartTask(t.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Task</span>
                    </button>
                  )}

                  {t.status !== 'Completed' && (
                    <button
                      onClick={() => setSelectedTaskForExtension(t)}
                      className="px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded-xl transition-colors"
                    >
                      Extension
                    </button>
                  )}

                  {t.status !== 'Completed' && (
                    <button
                      onClick={() => setSelectedTaskForCompletion(t)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <TaskCompletionModal
        isOpen={Boolean(selectedTaskForCompletion)}
        onClose={() => setSelectedTaskForCompletion(null)}
        task={selectedTaskForCompletion}
        onSuccess={loadTasks}
      />

      <ExtensionModal
        isOpen={Boolean(selectedTaskForExtension)}
        onClose={() => setSelectedTaskForExtension(null)}
        task={selectedTaskForExtension}
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
