import React from 'react';
import { Users, UserCheck, Plane, DollarSign, Plus, ArrowUpRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HRDashboardPage() {
  const metrics = [
    { title: 'Total Employees', value: '148 Staff', change: '+5 this month', icon: Users, color: 'cyan' },
    { title: 'Today Attendance', value: '138 Present', change: '93.2% On-time', icon: UserCheck, color: 'emerald' },
    { title: 'On Leave Today', value: '6 Pending', change: '2 Casual, 4 Sick', icon: Plane, color: 'amber' },
    { title: 'Payroll Budget', value: '₹ 42,50,000', change: 'Processed for Aug', icon: DollarSign, color: 'blue' },
  ];

  const recentLeaves = [
    { name: 'Amitabh Sharma', dept: 'Engineering', type: 'Casual Leave', dates: '18 Sep - 20 Sep', status: 'Pending Approval' },
    { name: 'Neha Kapoor', dept: 'Accounts & Finance', type: 'Sick Leave', dates: 'Today', status: 'Approved' },
    { name: 'Rajesh Verma', dept: 'Sales Operations', type: 'Earned Leave', dates: '22 Sep - 26 Sep', status: 'Pending Approval' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 to-cyan-950 p-6 rounded-3xl text-white shadow-xl border border-cyan-900/30">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold text-xs tracking-wider uppercase border border-cyan-500/30">
              HR & Workforce Module
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2">Human Resources Overview</h1>
          <p className="text-xs text-slate-300 mt-1">Manage employee records, daily attendance, leave approvals & monthly payroll.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/leave-requests" className="flex items-center space-x-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/30 transition-all">
            <Plane className="w-4 h-4" />
            <span>Manage Leave Requests</span>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.title}</span>
                <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{m.value}</p>
              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-2">{m.change}</p>
            </div>
          );
        })}
      </div>

      {/* Leave Approvals Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Recent Leave Applications</h3>
          <Link to="/leave-requests" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            View All Requests
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 px-2">Employee</th>
                <th className="pb-3 px-2">Department</th>
                <th className="pb-3 px-3">Leave Type</th>
                <th className="pb-3 px-2">Dates</th>
                <th className="pb-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {recentLeaves.map((l, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{l.name}</td>
                  <td className="py-3 px-2 text-slate-500">{l.dept}</td>
                  <td className="py-3 px-3 font-semibold text-cyan-600 dark:text-cyan-400">{l.type}</td>
                  <td className="py-3 px-2 text-slate-500">{l.dates}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      l.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
