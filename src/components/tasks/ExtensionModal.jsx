import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { extensionService } from '../../services/extensionService';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Upload, AlertCircle } from 'lucide-react';

export function ExtensionModal({ isOpen, onClose, task, onSuccess }) {
  const { user } = useAuth();
  const [requestedDate, setRequestedDate] = useState('');
  const [reason, setReason] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestedDate) {
      setError('Please select a requested due date.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason for the extension request.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await extensionService.requestExtension(
        {
          task_id: task.id,
          task_code: task.task_code,
          task_title: task.title,
          current_due_date: task.due_date,
          requested_due_date: requestedDate,
          reason,
          attachment_url: attachmentUrl,
        },
        user
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit extension request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Date Extension" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
          <input
            type="text"
            disabled
            value={`${task.task_code} - ${task.title}`}
            className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl border border-slate-200 dark:border-slate-700 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Due Date</label>
            <input
              type="text"
              disabled
              value={new Date(task.due_date).toLocaleDateString()}
              className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl border border-slate-200 dark:border-slate-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Requested Due Date *</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason for Extension *</label>
          <textarea
            required
            rows={3}
            placeholder="Explain why an extension is required (e.g. data dependency, vendor delay)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Supporting Document / Proof URL (Optional)</label>
          <div className="flex items-center space-x-2">
            <Upload className="w-4 h-4 text-slate-400" />
            <input
              type="url"
              placeholder="https://example.com/document.pdf"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
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
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Extension Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
