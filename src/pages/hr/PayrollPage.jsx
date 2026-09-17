import React from 'react';
import { DollarSign, Download, FileText } from 'lucide-react';

export function PayrollPage() {
  const payroll = [
    { period: 'August 2026', totalStaff: 148, grossPay: '₹ 42,50,000', netPay: '₹ 37,20,000', status: 'Disbursed', date: '01 Sep 2026' },
    { period: 'July 2026', totalStaff: 145, grossPay: '₹ 41,80,000', netPay: '₹ 36,50,000', status: 'Disbursed', date: '01 Aug 2026' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-cyan-500" />
            <span>Payroll & Salary Slips</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Monthly payroll processing, tax deductions, and salary slips.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 px-3">Payroll Cycle</th>
                <th className="pb-3 px-3">Total Staff</th>
                <th className="pb-3 px-3">Gross Salary</th>
                <th className="pb-3 px-3">Net Disbursed</th>
                <th className="pb-3 px-3">Disbursement Date</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Payslips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {payroll.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-bold text-cyan-600 dark:text-cyan-400">{p.period}</td>
                  <td className="py-3 px-3 text-slate-500">{p.totalStaff} Employees</td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">{p.grossPay}</td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">{p.netPay}</td>
                  <td className="py-3 px-3 text-slate-500">{p.date}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Download className="w-4 h-4" />
                    </button>
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
