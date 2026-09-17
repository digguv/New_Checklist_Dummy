import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function OrderConversionsPage() {
  const conversions = [
    { leadId: 'LD-960', customer: 'Shapoorji Pallonji', orderId: 'SO-9042', value: '₹ 68,00,000', daysToConvert: '14 Days', convertedDate: '15 Sep 2026' },
    { leadId: 'LD-942', customer: 'Adani Infrastructure', orderId: 'SO-9038', value: '₹ 8,90,000', daysToConvert: '8 Days', convertedDate: '12 Sep 2026' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-violet-500" />
            <span>Lead To Order Conversion Metrics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Audit trail of leads successfully converted into active sales orders.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 px-3">Lead ID</th>
                <th className="pb-3 px-3">Conversion Flow</th>
                <th className="pb-3 px-3">Converted Sales Order</th>
                <th className="pb-3 px-3">Order Value</th>
                <th className="pb-3 px-3">Turnaround Time</th>
                <th className="pb-3 px-3">Conversion Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {conversions.map((c) => (
                <tr key={c.leadId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-bold text-violet-500">{c.leadId}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>{c.customer}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-violet-500" />
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">{c.orderId}</td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">{c.value}</td>
                  <td className="py-3 px-3 text-slate-500">{c.daysToConvert}</td>
                  <td className="py-3 px-3 text-slate-400">{c.convertedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
