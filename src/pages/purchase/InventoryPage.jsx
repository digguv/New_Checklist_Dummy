import React from 'react';
import { Boxes, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function InventoryPage() {
  const stock = [
    { sku: 'SKU-801', name: 'Raw Steel Sheets 5mm', warehouse: 'Warehouse A (Bhiwandi)', stock: '45 Tons', minReorder: '10 Tons', status: 'Healthy' },
    { sku: 'SKU-802', name: 'Armored Cable 4-Core', warehouse: 'Warehouse B (Pune)', stock: '350 Mtr', minReorder: '500 Mtr', status: 'Low Stock Alert' },
    { sku: 'SKU-803', name: 'PVC Polymer Granules', warehouse: 'Warehouse A (Bhiwandi)', stock: '18 Tons', minReorder: '5 Tons', status: 'Healthy' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Boxes className="w-6 h-6 text-amber-500" />
            <span>Material Inventory & Stock</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Warehouse raw material stock balances, reorder triggers & safety levels.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 px-3">SKU Code</th>
                <th className="pb-3 px-3">Item Description</th>
                <th className="pb-3 px-3">Warehouse Location</th>
                <th className="pb-3 px-3">Current Stock</th>
                <th className="pb-3 px-3">Min Reorder Level</th>
                <th className="pb-3 px-3">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {stock.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-500">{item.sku}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">{item.name}</td>
                  <td className="py-3 px-3 text-slate-500">{item.warehouse}</td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">{item.stock}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{item.minReorder}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.status === 'Low Stock Alert' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {item.status}
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
