import React, { useState } from 'react';
import { Building, Plus, Edit2, Trash2 } from 'lucide-react';
import { useOTDStorage } from '../../hooks/useOTDStorage';
import { STORAGE_KEYS, setData, generateId, logAuditAction } from '../../services/otdStorageService';

export function MasterDepartmentsPage() {
  const departments = useOTDStorage(STORAGE_KEYS.DEPARTMENTS, []);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', headName: '', status: 'Active' });

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setForm({ ...item });
    } else {
      setEditingItem(null);
      setForm({
        code: `DPT-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        headName: '',
        status: 'Active'
      });
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Department Name is required');

    let updated;
    if (editingItem) {
      updated = departments.map((d) => (d.id === editingItem.id ? { ...d, ...form } : d));
      logAuditAction('Department Updated', 'Department Master', editingItem.id, form);
    } else {
      const newItem = { id: generateId('DPT'), ...form, createdAt: new Date().toISOString() };
      updated = [...departments, newItem];
      logAuditAction('Department Created', 'Department Master', newItem.id, form);
    }

    setData(STORAGE_KEYS.DEPARTMENTS, updated);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this Department?')) return;
    const item = departments.find((d) => d.id === id);
    const updated = departments.filter((d) => d.id !== id);
    setData(STORAGE_KEYS.DEPARTMENTS, updated);
    logAuditAction('Department Deleted', 'Department Master', id, item);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-extrabold text-xs uppercase tracking-wider border border-rose-500/30">
            Master System
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2">Department Master</h1>
          <p className="text-xs text-slate-400 mt-1">Single source of truth for organizational departments.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        {departments.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No Departments added yet. Click below to add your first Department.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                  <th className="pb-3 px-3">Code</th>
                  <th className="pb-3 px-3">Department Name</th>
                  <th className="pb-3 px-3">Head of Department</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {departments.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-extrabold text-indigo-600">{d.code}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{d.name}</td>
                    <td className="py-3 px-3 text-slate-500">{d.headName || '-'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">{d.status}</span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button onClick={() => handleOpenModal(d)} className="p-1 hover:bg-slate-100 rounded text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(d.id)} className="p-1 hover:bg-slate-100 rounded text-rose-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
              {editingItem ? 'Edit Department' : 'Add Department'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Code *</label>
                <input type="text" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold mb-1">Department Name *</label>
                <input type="text" required placeholder="e.g. Quality Control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold mb-1">Head of Department</label>
                <input type="text" placeholder="HOD Name" value={form.headName} onChange={(e) => setForm({ ...form, headName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
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
