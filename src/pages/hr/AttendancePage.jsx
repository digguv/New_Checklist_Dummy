import React from 'react';
import { UserCheck, Clock, Calendar } from 'lucide-react';

export function AttendancePage() {
  const attendance = [
    { emp: 'Amitabh Sharma', date: '16 Sep 2026', checkIn: '09:12 AM', checkOut: '06:30 PM', workHours: '9h 18m', status: 'On-Time' },
    { emp: 'Neha Kapoor', date: '16 Sep 2026', checkIn: '09:45 AM', checkOut: '06:15 PM', workHours: '8h 30m', status: 'Late Arrival' },
    { emp: 'Rajesh Verma', date: '16 Sep 2026', checkIn: '09:05 AM', checkOut: '06:00 PM', workHours: '8h 55m', status: 'On-Time' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-cyan-500" />
            <span>Daily Attendance & Punch Log</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Biometric & mobile check-in records, shift hours & overtime logs.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 px-3">Employee</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Check-In</th>
                <th className="pb-3 px-3">Check-Out</th>
                <th className="pb-3 px-3">Total Work Hours</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {attendance.map((a, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{a.emp}</td>
                  <td className="py-3 px-3 text-slate-500">{a.date}</td>
                  <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400">{a.checkIn}</td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{a.checkOut}</td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">{a.workHours}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      a.status === 'On-Time' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {a.status}
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
