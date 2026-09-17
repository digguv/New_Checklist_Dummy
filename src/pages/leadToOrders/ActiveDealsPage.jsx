import React from 'react';
import { Target, CheckCircle2, TrendingUp } from 'lucide-react';

export function ActiveDealsPage() {
  const deals = [
    { id: 'DL-501', client: 'Shapoorji Pallonji', project: 'Commercial Tower Façade', value: '₹ 68,00,000', probability: '90%', status: 'Closing Stage' },
    { id: 'DL-502', client: 'Prestige Group', project: 'HVAC Infrastructure', value: '₹ 45,00,000', probability: '75%', status: 'Commercial Proposal' },
    { id: 'DL-503', client: 'Sobha Developers', project: 'Electrical Switchgear', value: '₹ 22,00,000', probability: '60%', status: 'Technical Demo' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-violet-500" />
            <span>Active High-Value Deals</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">High potential commercial deals currently active in final negotiation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deals.map((d) => (
          <div key={d.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-violet-600 dark:text-violet-400">{d.id}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                {d.probability} Probability
              </span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{d.client}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{d.project}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Deal Value</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{d.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
