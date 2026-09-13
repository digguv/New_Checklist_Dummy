import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, XCircle, Upload, AlertCircle } from 'lucide-react';

export function TaskCompletionModal({ isOpen, onClose, task, onSuccess }) {
  const { user } = useAuth();
  const [status, setStatus] = useState('Completed');
  const [remarks, setRemarks] = useState('');
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [proofDocUrl, setProofDocUrl] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task && task.items) {
      setItems(task.items);
    }
  }, [task]);

  if (!task) return null;

  const toggleItem = (itemId) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, completed: !i.completed } : i))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === 'Not Done' && !remarks.trim()) {
      setError('Remarks/Reason is strictly required when marking a task as Not Done.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await taskService.updateTaskStatus(
        task.id,
        status,
        {
          remarks,
          proof_image_url: proofImageUrl,
          proof_doc_url: proofDocUrl,
          items,
        },
        user
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update task status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Task / Update Outcome" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Status Outcome Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Completion Outcome</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStatus('Completed')}
              className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                status === 'Completed'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Completed</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('Not Done')}
              className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                status === 'Not Done'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-500 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>Mark as Not Done</span>
            </button>
          </div>
        </div>

        {/* Checklist Step Toggles */}
        {task.type === 'checklist' && items.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Checklist Steps Verification</p>
            <div className="space-y-2">
              {items.map((item) => (
                <label key={item.id} className="flex items-center space-x-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={Boolean(item.completed)}
                    onChange={() => toggleItem(item.id)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className={item.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                    {item.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Completion Remarks */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Completion Remarks / Reason {status === 'Not Done' && <span className="text-rose-500">*</span>}
          </label>
          <textarea
            required={status === 'Not Done'}
            rows={3}
            placeholder={
              status === 'Completed'
                ? 'Enter completion summary, notes, or execution observations...'
                : 'Enter detailed justification why task could not be completed...'
            }
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Upload Proof URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Proof Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={proofImageUrl}
              onChange={(e) => setProofImageUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Supporting Document URL</label>
            <input
              type="url"
              placeholder="https://example.com/document.pdf"
              value={proofDocUrl}
              onChange={(e) => setProofDocUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all disabled:opacity-50 ${
              status === 'Completed'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
            }`}
          >
            {loading ? 'Submitting...' : status === 'Completed' ? 'Submit Completion' : 'Mark as Not Done'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
