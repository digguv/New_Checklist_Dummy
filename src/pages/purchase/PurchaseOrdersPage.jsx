import React from 'react';
import { Package, Truck, Calendar, Download } from 'lucide-react';

export function PurchaseOrdersPage() {
  const orders = [
    { id: 'PO-8821', vendor: 'Jindal Steel & Power', item: 'Raw Steel Sheets 5mm', amount: '₹ 8,50,000', delivery: '22 Sep 2026', status: 'Dispatched' },
    { id: 'PO-8820', vendor: 'Finolex Cables Ltd', item: 'Industrial Armored Cables', amount: '₹ 3,20,000', delivery: '25 Sep 2026', status: 'Approved' },
    { id: 'PO-8819', vendor: 'Supreme Polymers', item: 'High Density PVC Granules', amount: '₹ 4,10,000', delivery: '18 Sep 2026', status: 'Delivered' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-500" />
            <span>Purchase Orders (LPO / PO)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Official purchase orders issued to approved vendors and suppliers.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 px-3">PO Number</th>
                <th className="pb-3 px-3">Vendor</th>
                <th className="pb-3 px-3">Material Description</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Est. Delivery</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {orders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400">{po.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">{po.vendor}</td>
                  <td className="py-3 px-3 text-slate-500">{po.item}</td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">{po.amount}</td>
                  <td className="py-3 px-3 text-slate-500">{po.delivery}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      {po.status}
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
