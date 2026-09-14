import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import {
  Bell,
  CheckCircle2,
  LogIn,
  LogOut,
  ClipboardList,
  Plane,
  ArrowRightLeft,
  Activity,
  Check,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, AUTH, TASKS, LEAVE
  const [searchQuery, setSearchQuery] = useState('');

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_login':
        return <LogIn className="w-4 h-4 text-emerald-500" />;
      case 'user_logout':
        return <LogOut className="w-4 h-4 text-rose-500" />;
      case 'task_assigned':
      case 'task_edited':
      case 'task_completed':
        return <ClipboardList className="w-4 h-4 text-indigo-500" />;
      case 'task_transferred':
        return <ArrowRightLeft className="w-4 h-4 text-amber-500" />;
      case 'leave_requested':
      case 'leave_approved':
      case 'leave_rejected':
        return <Plane className="w-4 h-4 text-sky-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    // Tab Filter
    if (activeTab === 'AUTH' && n.type !== 'user_login' && n.type !== 'user_logout') return false;
    if (
      activeTab === 'TASKS' &&
      n.type !== 'task_assigned' &&
      n.type !== 'task_edited' &&
      n.type !== 'task_completed' &&
      n.type !== 'task_deleted'
    )
      return false;
    if (
      activeTab === 'LEAVE' &&
      n.type !== 'leave_requested' &&
      n.type !== 'leave_approved' &&
      n.type !== 'leave_rejected' &&
      n.type !== 'task_transferred'
    )
      return false;

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
    }

    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <Activity className="w-6 h-6 text-indigo-600" />
            <span>Activity Log & Notification Center</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Realtime activity feed: user login/logout events, task assignments, leave requests & transfer logs
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'ALL'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setActiveTab('AUTH')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'AUTH'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Login/Logout Logs
          </button>
          <button
            onClick={() => setActiveTab('TASKS')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'TASKS'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Task Assignments
          </button>
          <button
            onClick={() => setActiveTab('LEAVE')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'LEAVE'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Leave & Transfers
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No activity records found under this filter.</div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markAsRead(n.id);
                if (n.link_url) navigate(n.link_url);
              }}
              className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-start justify-between gap-4 transition-colors ${
                !n.is_read ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                    !n.is_read
                      ? 'bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {getActivityIcon(n.type)}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>{n.title}</span>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block shrink-0"></span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block mt-1.5 font-mono">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(n.id);
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
