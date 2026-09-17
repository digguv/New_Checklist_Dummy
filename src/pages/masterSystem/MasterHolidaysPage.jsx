import React, { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useOTDStorage } from '../../hooks/useOTDStorage';
import { STORAGE_KEYS, setData, generateId, logAuditAction } from '../../services/otdStorageService';

export function MasterHolidaysPage() {
  const holidays = useOTDStorage(STORAGE_KEYS.HOLIDAYS, []);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    type: 'Public Holiday',
    status: 'Active'
  });

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setForm({ ...item });
    } else {
      setEditingItem(null);
      setForm({
        date: new Date().toISOString().split('T')[0],
        name: '',
        type: 'Public Holiday',
        status: 'Active'
      });
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date) return alert('Holiday Name and Date are required');

    let updated;
    if (editingItem) {
      updated = holidays.map((h) => (h.id === editingItem.id ? { ...h, ...form } : h));
      logAuditAction('Holiday Updated', 'Holidays Master', editingItem.id, form);
    } else {
      const newItem = { id: generateId('HOL'), ...form, createdAt: new Date().toISOString() };
      updated = [...holidays, newItem];
      logAuditAction('Holiday Created', 'Holidays Master', newItem.id, form);
    }

    setData(STORAGE_KEYS.HOLIDAYS, updated);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this Holiday?')) return;
    const item = holidays.find((h) => h.id === id);
    const updated = holidays.filter((h) => h.id !== id);
    setData(STORAGE_KEYS.HOLIDAYS, updated);
    logAuditAction('Holiday Deleted', 'Holidays Master', id, item);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-extrabold text-xs uppercase tracking-wider border border-rose-500/30">
            Master System
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2">Holidays Master</h1>
          <p className="text-xs text-slate-400 mt-1">Configure public and company holidays for official calendars.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Holiday</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        {holidays.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No Holidays added yet. Click below to add your first Holiday.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Holiday Name</th>
                  <th className="pb-3 px-3">Type</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {holidays.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-extrabold text-rose-600 dark:text-rose-400">{h.date}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{h.name}</td>
                    <td className="py-3 px-3 text-slate-500">{h.type}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">{h.status}</span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button onClick={() => handleOpenModal(h)} className="p-1 hover:bg-slate-100 rounded text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(h.id)} className="p-1 hover:bg-slate-100 rounded text-rose-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
              {editingItem ? 'Edit Holiday' : 'Add Holiday'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Holiday Name *</label>
                <input type="text" required placeholder="e.g. Independence Day" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold mb-1">Holiday Date *</label>
                <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold mb-1">Holiday Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl">
                  <option value="Public Holiday">Public Holiday</option>
                  <option value="Company Holiday">Company Holiday</option>
                  <option value="Restricted Holiday">Restricted Holiday</option>
                </select>
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
