import React, { useState, useEffect } from 'react';
import { INITIAL_HISTORY } from '../../services/mockData';
import { formatDateTime } from '../../lib/utils';
import { ShieldCheck, History, Search } from 'lucide-react';

export function AuditLogsPage() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('corporate_system_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        setHistory(INITIAL_HISTORY);
      }
    } else {
      setHistory(INITIAL_HISTORY);
    }
  }, []);

  const filteredHistory = history.filter(
    (h) =>
      h.action.toLowerCase().includes(search.toLowerCase()) ||
      h.performed_by_name.toLowerCase().includes(search.toLowerCase()) ||
      h.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Activity Audit Trail & System Logs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete compliance history of task creations, status updates, extension approvals, and proof uploads
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Performed By</th>
                <th className="px-4 py-3.5">Action Event</th>
                <th className="px-4 py-3.5">Audit Log Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredHistory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 text-slate-500 font-mono">{formatDateTime(row.created_at)}</td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{row.performed_by_name}</td>
                  <td className="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-400">{row.action}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-md">{row.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
