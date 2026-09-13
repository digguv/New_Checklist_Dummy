import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCircle2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Realtime notifications for task assignments, due reminders, and extension approvals
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

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No notifications available.</div>
        ) : (
          notifications.map((n) => (
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
                  className={`p-2 rounded-xl mt-0.5 ${
                    !n.is_read
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block mt-1">
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
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
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
