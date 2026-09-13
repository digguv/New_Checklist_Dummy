import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import {
  Users,
  UserCheck,
  ListTodo,
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [empReport, setEmpReport] = useState([]);
  const [deptReport, setDeptReport] = useState([]);
  const [dateRange, setDateRange] = useState('This Month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const m = await reportService.getDashboardMetrics();
      const emp = await reportService.getEmployeePerformanceReport();
      const dept = await reportService.getDepartmentReport();
      setMetrics(m);
      setEmpReport(emp);
      setDeptReport(dept);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Admin Dashboard...</div>;
  }

  // Chart data definitions
  const completionData = [
    { day: 'Mon', completed: 12, overdue: 2 },
    { day: 'Tue', completed: 18, overdue: 1 },
    { day: 'Wed', completed: 15, overdue: 3 },
    { day: 'Thu', completed: 22, overdue: 0 },
    { day: 'Fri', completed: 25, overdue: 1 },
    { day: 'Sat', completed: 10, overdue: 0 },
    { day: 'Sun', completed: 8, overdue: 0 },
  ];

  const pendingVsCompleted = [
    { name: 'Completed', value: metrics.completedTasks, color: '#10b981' },
    { name: 'Pending', value: metrics.pendingTasks, color: '#f59e0b' },
    { name: 'Overdue', value: metrics.overdueTasks, color: '#f43f5e' },
  ];

  const checklistVsDelegation = [
    { name: 'Checklists', value: metrics.totalChecklists, color: '#6366f1' },
    { name: 'Delegations', value: metrics.totalDelegations, color: '#ec4899' },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Admin System Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete organization performance analytics, TAT monitoring & master stats
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">Range:</span>
          {['Today', 'This Week', 'This Month', 'Custom'].map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                dateRange === r
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top 8 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-2">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Users</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{metrics.totalUsers}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-2">
            <UserCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Users</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{metrics.activeUsers}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2">
            <ListTodo className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Checklists</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{metrics.totalChecklists}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mb-2">
            <CheckSquare className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Delegations</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{metrics.totalDelegations}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{metrics.pendingTasks}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{metrics.completedTasks}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2 w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Overdue</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{metrics.overdueTasks}</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl text-white shadow-md shadow-indigo-600/20">
          <div className="p-2 w-8 h-8 rounded-xl bg-white/20 text-white mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-indigo-100 font-bold uppercase block">Completion %</span>
          <p className="text-lg font-extrabold text-white mt-0.5">{metrics.completionRate}%</p>
        </div>
      </div>

      {/* 6 Recharts Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Completion Trend */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Daily Task Completion & Overdue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} name="Completed" />
                <Line type="monotone" dataKey="overdue" stroke="#f43f5e" strokeWidth={3} name="Overdue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Employee Performance Scores */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Employee Performance & Score Ranking</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={empReport}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="overallScore" fill="#6366f1" radius={[8, 8, 0, 0]} name="Score Points" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Department-wise Completion Rates */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Department Task Volumes & Completion %</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptReport}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalTasks" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Total Tasks" />
                <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Pending vs Completed Donut */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Overall Task Status Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pendingVsCompleted}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pendingVsCompleted.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Checklist vs Delegation Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Checklist Workload vs One-Time Delegations</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={checklistVsDelegation}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  label
                >
                  {checklistVsDelegation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Overdue Task Department Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Overdue Task Distribution by Department</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptReport}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="overdue" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Overdue Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
