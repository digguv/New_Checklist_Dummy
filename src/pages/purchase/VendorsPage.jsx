import React from 'react';
import { Truck, Star, MapPin, Phone } from 'lucide-react';

export function VendorsPage() {
  const vendors = [
    { id: 'VND-01', name: 'Jindal Steel & Power', category: 'Raw Metals & Steel', rating: 4.9, location: 'Hisar, Haryana', phone: '+91 98110 55443' },
    { id: 'VND-02', name: 'Finolex Cables Ltd', category: 'Electrical & Cabling', rating: 4.8, location: 'Pune, Maharashtra', phone: '+91 98220 11998' },
    { id: 'VND-03', name: 'Supreme Polymers', category: 'Plastics & Polymers', rating: 4.6, location: 'Jalgaon, Maharashtra', phone: '+91 94222 33445' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-amber-500" />
            <span>Vendors & Suppliers Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Approved vendor partners, compliance documents & performance ratings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vendors.map((v) => (
          <div key={v.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-600 dark:text-amber-400">{v.id}</span>
              <div className="flex items-center space-x-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{v.rating}</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{v.name}</h3>
              <p className="text-xs font-semibold text-slate-400">{v.category}</p>
            </div>
            <div className="text-xs space-y-1 text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {v.location}</p>
              <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {v.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
