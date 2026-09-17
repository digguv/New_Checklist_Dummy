import React, { useState } from 'react';
import { Users2, ShoppingCart, Truck, Plus, Edit2, Trash2, AlertTriangle, Building2, Phone, Mail } from 'lucide-react';
import { useOTDStorage } from '../../hooks/useOTDStorage';
import { STORAGE_KEYS, setData, generateId, logAuditAction } from '../../services/otdStorageService';

export function MasterVendorsPage() {
  const [subTab, setSubTab] = useState('sales'); // 'sales', 'purchase', 'transporter'

  const salesVendors = useOTDStorage(STORAGE_KEYS.CUSTOMERS, []);
  const purchaseVendors = useOTDStorage(STORAGE_KEYS.PURCHASE_VENDORS, []);
  const transporters = useOTDStorage(STORAGE_KEYS.TRANSPORTERS, []);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenModal = (item = null) => {
    setErrorMsg('');
    if (item) {
      setEditingItem(item);
      setForm({ ...item });
    } else {
      setEditingItem(null);
      if (subTab === 'sales') {
        setForm({
          code: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          name: '',
          type: 'Corporate',
          contactPerson: '',
          mobile: '',
          email: '',
          city: '',
          status: 'Active'
        });
      } else if (subTab === 'purchase') {
        setForm({
          code: `VND-${Math.floor(1000 + Math.random() * 9000)}`,
          name: '',
          contactPerson: '',
          mobile: '',
          email: '',
          gstin: '',
          city: '',
          status: 'Active'
        });
      } else {
        setForm({
          code: `TRN-${Math.floor(100 + Math.random() * 900)}`,
          name: '',
          contactPerson: '',
          mobile: '',
          vehicleTypes: 'Truck, Container',
          status: 'Active'
        });
      }
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!form.name.trim()) return setErrorMsg('Vendor / Transporter Name is required');

    if (subTab === 'sales') {
      const updated = editingItem
        ? salesVendors.map((c) => (c.id === editingItem.id ? { ...c, ...form } : c))
        : [...salesVendors, { id: generateId('CUST'), ...form, createdAt: new Date().toISOString() }];
      setData(STORAGE_KEYS.CUSTOMERS, updated);
      logAuditAction(editingItem ? 'Sales Vendor Updated' : 'Sales Vendor Created', 'Vendors Master', editingItem?.id || 'NEW', form);
    } else if (subTab === 'purchase') {
      const updated = editingItem
        ? purchaseVendors.map((v) => (v.id === editingItem.id ? { ...v, ...form } : v))
        : [...purchaseVendors, { id: generateId('VND'), ...form, createdAt: new Date().toISOString() }];
      setData(STORAGE_KEYS.PURCHASE_VENDORS, updated);
      logAuditAction(editingItem ? 'Purchase Vendor Updated' : 'Purchase Vendor Created', 'Vendors Master', editingItem?.id || 'NEW', form);
    } else if (subTab === 'transporter') {
      const updated = editingItem
        ? transporters.map((t) => (t.id === editingItem.id ? { ...t, ...form } : t))
        : [...transporters, { id: generateId('TRN'), ...form, createdAt: new Date().toISOString() }];
      setData(STORAGE_KEYS.TRANSPORTERS, updated);
      logAuditAction(editingItem ? 'Transporter Updated' : 'Transporter Created', 'Vendors Master', editingItem?.id || 'NEW', form);
    }

    setShowModal(false);
  };

  const handleDelete = (id, label, storageKey, currentList) => {
    if (!window.confirm(`Are you sure you want to delete this ${label}?`)) return;
    const item = currentList.find((x) => x.id === id);
    const updated = currentList.filter((x) => x.id !== id);
    setData(storageKey, updated);
    logAuditAction(`${label} Deleted`, 'Vendors Master', id, item);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-extrabold text-xs tracking-wider uppercase border border-rose-500/30">
              Master System
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2">Vendors & Logistics Master</h1>
          <p className="text-xs text-rose-200 mt-1">Manage Sales Vendors (Customers), Purchase Vendors, and Logistics Transporters.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>
            {subTab === 'sales' ? 'Add Sales Vendor' : subTab === 'purchase' ? 'Add Purchase Vendor' : 'Add Transporter'}
          </span>
        </button>
      </div>

      {/* Sub-Tabs: Sales Vendor, Purchase Vendor, Transporter */}
      <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setSubTab('sales')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            subTab === 'sales'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>Sales Vendors (Customers)</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-white/20">{salesVendors.length}</span>
        </button>

        <button
          onClick={() => setSubTab('purchase')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            subTab === 'purchase'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Purchase Vendors</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-white/20">{purchaseVendors.length}</span>
        </button>

        <button
          onClick={() => setSubTab('transporter')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            subTab === 'transporter'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Transporters</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-white/20">{transporters.length}</span>
        </button>
      </div>

      {/* Main Table Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        {/* SUB TAB 1: SALES VENDORS */}
        {subTab === 'sales' && (
          <div>
            {salesVendors.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No Sales Vendors added yet. Order creation forms draw customer options directly from this master.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                      <th className="pb-3 px-3">Code</th>
                      <th className="pb-3 px-3">Customer / Sales Vendor Name</th>
                      <th className="pb-3 px-3">Type</th>
                      <th className="pb-3 px-3">Contact Person</th>
                      <th className="pb-3 px-3">Mobile & Email</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {salesVendors.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-3 font-extrabold text-rose-600 dark:text-rose-400">{c.code}</td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{c.name}</td>
                        <td className="py-3 px-3 text-slate-500">{c.type}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">{c.contactPerson || '-'}</td>
                        <td className="py-3 px-3 text-slate-500">{c.mobile} {c.email ? `(${c.email})` : ''}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{c.status}</span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button onClick={() => handleOpenModal(c)} className="p-1 hover:bg-slate-100 rounded text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(c.id, 'Sales Vendor', STORAGE_KEYS.CUSTOMERS, salesVendors)} className="p-1 hover:bg-slate-100 rounded text-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SUB TAB 2: PURCHASE VENDORS */}
        {subTab === 'purchase' && (
          <div>
            {purchaseVendors.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No Purchase Vendors added yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                      <th className="pb-3 px-3">Code</th>
                      <th className="pb-3 px-3">Purchase Vendor Name</th>
                      <th className="pb-3 px-3">GSTIN</th>
                      <th className="pb-3 px-3">Contact Person</th>
                      <th className="pb-3 px-3">Mobile & Email</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {purchaseVendors.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-3 font-extrabold text-amber-600">{v.code}</td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{v.name}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">{v.gstin || '-'}</td>
                        <td className="py-3 px-3 text-slate-500">{v.contactPerson || '-'}</td>
                        <td className="py-3 px-3 text-slate-500">{v.mobile} {v.email ? `(${v.email})` : ''}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">{v.status}</span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button onClick={() => handleOpenModal(v)} className="p-1 hover:bg-slate-100 rounded text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(v.id, 'Purchase Vendor', STORAGE_KEYS.PURCHASE_VENDORS, purchaseVendors)} className="p-1 hover:bg-slate-100 rounded text-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SUB TAB 3: TRANSPORTERS */}
        {subTab === 'transporter' && (
          <div>
            {transporters.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No Transporters added yet. Dispatch stage courier dropdowns will source from here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                      <th className="pb-3 px-3">Code</th>
                      <th className="pb-3 px-3">Transporter / Courier Name</th>
                      <th className="pb-3 px-3">Contact Person</th>
                      <th className="pb-3 px-3">Mobile</th>
                      <th className="pb-3 px-3">Vehicle Types</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {transporters.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-3 font-extrabold text-purple-600">{t.code}</td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{t.name}</td>
                        <td className="py-3 px-3 text-slate-500">{t.contactPerson || '-'}</td>
                        <td className="py-3 px-3 text-slate-500">{t.mobile}</td>
                        <td className="py-3 px-3 text-slate-500">{t.vehicleTypes || 'General'}</td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button onClick={() => handleOpenModal(t)} className="p-1 hover:bg-slate-100 rounded text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(t.id, 'Transporter', STORAGE_KEYS.TRANSPORTERS, transporters)} className="p-1 hover:bg-slate-100 rounded text-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
              {editingItem
                ? `Edit ${subTab === 'sales' ? 'Sales Vendor' : subTab === 'purchase' ? 'Purchase Vendor' : 'Transporter'}`
                : `Add ${subTab === 'sales' ? 'Sales Vendor' : subTab === 'purchase' ? 'Purchase Vendor' : 'Transporter'}`}
            </h3>

            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Code *</label>
                  <input type="text" required value={form.code || ''} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
                {subTab === 'sales' && (
                  <div>
                    <label className="block font-bold mb-1">Type</label>
                    <select value={form.type || 'Corporate'} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl">
                      <option value="Corporate">Corporate</option>
                      <option value="Retail">Retail</option>
                      <option value="Distributor">Distributor</option>
                    </select>
                  </div>
                )}
                {subTab === 'purchase' && (
                  <div>
                    <label className="block font-bold mb-1">GSTIN</label>
                    <input type="text" placeholder="GSTIN #" value={form.gstin || ''} onChange={(e) => setForm({ ...form, gstin: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1">Name *</label>
                <input type="text" required placeholder="Name..." value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Contact Person</label>
                  <input type="text" value={form.contactPerson || ''} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Mobile</label>
                  <input type="tel" value={form.mobile || ''} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Email</label>
                <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
