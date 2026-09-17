import React from 'react';
import { FileCheck, Plus, CheckCircle2, Clock } from 'lucide-react';

export function PurchaseRequisitionsPage() {
  const reqs = [
    { id: 'REQ-409', department: 'Production / Factory', requestedBy: 'Mahesh K.', item: 'Hydraulic Oil Grade 68', urgency: 'High', status: 'Pending Approval' },
    { id: 'REQ-408', department: 'IT Operations', requestedBy: 'Rohan Mehta', item: 'Dell PowerEdge Server RAM', urgency: 'Medium', status: 'Approved' },
    { id: 'REQ-407', department: 'Maintenance', requestedBy: 'Karan Johar', item: 'Safety Goggles & Gloves', urgency: 'Low', status: 'Converted to PO' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-amber-500" />
            <span>Purchase Requisitions (Indent)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Internal material requests and department procurement approvals.</p>
        </div>
        <button className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>New Requisition</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reqs.map((r) => (
          <div key={r.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400">{r.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${r.urgency === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-100 text-slate-600'}`}>
                {r.urgency} Urgency
              </span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{r.item}</h3>
              <p className="text-xs text-slate-400 mt-1">Dept: {r.department} • By: {r.requestedBy}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Status</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{r.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
