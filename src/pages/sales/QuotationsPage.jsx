import React from 'react';
import { FileText, Plus, Download, Printer } from 'lucide-react';

export function QuotationsPage() {
  const quotations = [
    { id: 'QT-2026-088', customer: 'Godrej Consumer Products', date: '15 Sep 2026', validUntil: '30 Sep 2026', items: 12, amount: '₹ 6,40,000', status: 'Sent' },
    { id: 'QT-2026-087', customer: 'L&T Heavy Engineering', date: '14 Sep 2026', validUntil: '28 Sep 2026', items: 5, amount: '₹ 14,20,000', status: 'Approved' },
    { id: 'QT-2026-086', customer: 'Ultratech Cement Supplies', date: '10 Sep 2026', validUntil: '25 Sep 2026', items: 8, amount: '₹ 3,90,000', status: 'Expired' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-500" />
            <span>Quotations & Estimates</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Generate formal price quotes and commercial proposals for clients.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all">
          <Plus className="w-4 h-4" />
          <span>New Quotation</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 px-3">Quote #</th>
                <th className="pb-3 px-3">Customer</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Valid Until</th>
                <th className="pb-3 px-3">Items</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {quotations.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">{q.id}</td>
                  <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">{q.customer}</td>
                  <td className="py-3 px-3 text-slate-500">{q.date}</td>
                  <td className="py-3 px-3 text-slate-500">{q.validUntil}</td>
                  <td className="py-3 px-3 text-slate-500">{q.items} items</td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">{q.amount}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      q.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      q.status === 'Sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Printer className="w-4 h-4" />
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
