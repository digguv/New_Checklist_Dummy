import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { taskService } from '../../services/taskService';
import { extensionService } from '../../services/extensionService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { ExtensionModal } from '../../components/tasks/ExtensionModal';
import {
  Users,
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function ManagerDashboard() {
  const { user } = useAuth();
  const [teamTasks, setTeamTasks] = useState([]);
  const [extensions, setExtensions] = useState([]);
  const [empReport, setEmpReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const tasks = await taskService.getTasks({ user });
      const exts = await extensionService.getExtensions();
      const emp = await reportService.getEmployeePerformanceReport();

      setTeamTasks(tasks);
      setExtensions(exts.filter((e) => e.status === 'Pending'));
      setEmpReport(emp);
    } catch (err) {
      console.error('Failed to load manager dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewExtension = async (extId, status) => {
    try {
      await extensionService.reviewExtension(extId, status, `Reviewed on dashboard by ${user.full_name}`, user);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update extension request.');
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-400">Loading Manager Dashboard...</div>;

  const totalTeam = 5;
  const todayTasks = teamTasks.filter((t) => t.start_date === new Date().toISOString().split('T')[0]).length;
  const pendingCount = teamTasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
  const completedCount = teamTasks.filter((t) => t.status === 'Completed').length;
  const overdueCount = teamTasks.filter((t) => t.status === 'Overdue').length;
  const completionRate = teamTasks.length > 0 ? Math.round((completedCount / teamTasks.length) * 100) : 100;

  const urgentTasks = teamTasks.filter(
    (t) => t.status === 'Overdue' || (t.priority === 'Critical' && t.status !== 'Completed')
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Manager Operations Dashboard
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor team task progress, review date extension requests, and track department TAT efficiency
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-blue-50 text-blue-600 mb-2">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">My Team</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{totalTeam}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 mb-2">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Today's Tasks</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{todayTasks}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-amber-50 text-amber-600 mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{pendingCount}</p>
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

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-purple-50 text-purple-600 mb-2">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Extension Requests</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{extensions.length}</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl text-white shadow-md shadow-indigo-600/20">
          <div className="p-2 w-8 h-8 rounded-xl bg-white/20 text-white mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-indigo-100 font-bold uppercase block">Team Completion</span>
          <p className="text-lg font-extrabold text-white mt-0.5">{completionRate}%</p>
        </div>
      </div>

      {/* Pending Extensions Alert & Review Box */}
      {extensions.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-5 rounded-2xl">
          <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center space-x-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Pending Extension Requests ({extensions.length})</span>
          </h3>

          <div className="space-y-3">
            {extensions.map((ext) => (
              <div
                key={ext.id}
                className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {ext.task_code} - {ext.task_title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Requested by <span className="font-semibold text-slate-700 dark:text-slate-200">{ext.requested_by_name}</span> to{' '}
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {new Date(ext.requested_due_date).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-[11px] italic text-slate-500 dark:text-slate-400 mt-1">Reason: "{ext.reason}"</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleReviewExtension(ext.id, 'Approved')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReviewExtension(ext.id, 'Rejected')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Tasks Requiring Attention & Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Requiring Attention */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Tasks Requiring Urgent Attention ({urgentTasks.length})
          </h3>

          <div className="space-y-3">
            {urgentTasks.length === 0 ? (
              <p className="text-xs text-slate-400">No urgent overdue tasks requiring attention.</p>
            ) : (
              urgentTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{t.task_code}</span>
                      <PriorityBadge priority={t.priority} />
                      <StatusBadge status={t.status} />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">{t.title}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Assigned to: {t.assigned_to_name} | Due: {new Date(t.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Team Employee-wise Completion */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Team Employee Completion Rates</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={empReport}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} name="Completed Tasks" />
                <Bar dataKey="overdue" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Overdue Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
