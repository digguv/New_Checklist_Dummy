import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../lib/utils';
import { UserCheck, Plus, User, Calendar, Eye } from 'lucide-react';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';

export function DelegationListPage() {
  const { user, isAdmin, isManager } = useAuth();
  const [delegations, setDelegations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    loadDelegations();
  }, [user]);

  const loadDelegations = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks({ taskType: 'delegation', user });
      setDelegations(data);
    } catch (err) {
      console.error('Failed to load delegations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Delegation Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track one-time delegated operational tasks, due dates, and completion status
          </p>
        </div>

        {(isAdmin || isManager) && (
          <Link
            to="/delegation/create"
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Delegate Task</span>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading delegations...</div>
      ) : delegations.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-2xl text-center text-xs text-slate-400">
          No delegated tasks found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {delegations.map((d) => (
            <div
              key={d.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {d.task_code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{d.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{d.description}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <PriorityBadge priority={d.priority} />
                  <StatusBadge status={d.status} />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>By: {d.assigned_by_name} → To: {d.assigned_to_name}</span>
                <span>Due: {formatDate(d.due_date)}</span>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setSelectedTaskId(d.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Detail</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskDetailModal
        isOpen={Boolean(selectedTaskId)}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId}
      />
    </div>
  );
}
