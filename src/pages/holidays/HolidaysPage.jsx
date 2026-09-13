import React, { useState, useEffect } from 'react';
import { holidayService } from '../../services/holidayService';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Plus, Trash2, PartyPopper, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export function HolidaysPage() {
  const { isAdmin, isManager } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    setLoading(true);
    try {
      const data = await holidayService.getHolidays();
      setHolidays(data);
    } catch (err) {
      console.error('Failed to load holidays:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    if (!name || !date) return;

    try {
      await holidayService.addHoliday({ name, date, description });
      setIsModalOpen(false);
      setName('');
      setDate('');
      setDescription('');
      loadHolidays();
    } catch (err) {
      alert(err.message || 'Failed to add holiday.');
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (!window.confirm('Delete this corporate holiday entry?')) return;
    try {
      await holidayService.deleteHoliday(id);
      loadHolidays();
    } catch (err) {
      alert(err.message || 'Failed to delete holiday.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Corporate Holidays Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure official organization holidays. Tasks on designated holiday dates will not burden employees.
          </p>
        </div>

        {(isAdmin || isManager) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Holiday</span>
          </button>
        )}
      </div>

      {/* Holidays List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading corporate holidays...</div>
        ) : holidays.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No official holidays added yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3.5">Holiday Date</th>
                  <th className="px-4 py-3.5">Holiday Title</th>
                  <th className="px-4 py-3.5">Description</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {holidays.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {new Date(h.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <PartyPopper className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{h.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{h.description || 'Corporate Holiday'}</td>
                    <td className="px-4 py-3 text-right">
                      {(isAdmin || isManager) && (
                        <button
                          onClick={() => handleDeleteHoliday(h.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                          title="Delete Holiday"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Holiday Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Corporate Holiday" maxWidth="max-w-md">
        <form onSubmit={handleAddHoliday} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Holiday Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Independence Day"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Holiday Date *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Corporate holiday details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20"
            >
              Save Holiday
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
