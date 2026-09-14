import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { taskService } from '../../services/taskService';
import { extensionService } from '../../services/extensionService';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Calendar, Upload, AlertCircle, FileText, X } from 'lucide-react';

export function TaskUpdateModal({ isOpen, onClose, task, onSuccess }) {
  const { user } = useAuth();

  // REQUIREMENT #2: Only 2 Status Options: Completed OR Extend Date
  const [selectedOutcome, setSelectedOutcome] = useState('Completed'); // 'Completed' or 'Extend Date'

  const [remarks, setRemarks] = useState('');
  const [extensionDate, setExtensionDate] = useState('');

  // File Upload State (FileReader Base64 / File object)
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState('');
  const [fileName, setFileName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isChecklistTask = task?.type === 'checklist' || task?.task_code?.toLowerCase().includes('chk');

  useEffect(() => {
    if (task) {
      setSelectedOutcome('Completed');
      setRemarks(task.completion_remarks || '');
      setExtensionDate('');
      setUploadedFile(null);
      setFileBase64(task.proof_doc_url || '');
      setFileName(task.proof_doc_url ? 'Attached Document' : '');
    }
  }, [task]);

  if (!task) return null;

  const isAttachmentRequired = Boolean(task.required_attachment);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isChecklistTask && selectedOutcome === 'Extend Date') {
      setError('Checklist tasks cannot be extended. Only Delegation tasks can be extended.');
      return;
    }

    if (selectedOutcome === 'Extend Date' && !extensionDate) {
      setError('Aapko Ye Task Kab Karna Hai (Please select a new extension date).');
      return;
    }

    if (isAttachmentRequired && !fileBase64) {
      setError('Proof / Document Attachment file is mandatory for this task.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (selectedOutcome === 'Extend Date') {
        // Request/Approve Date Extension
        await extensionService.requestExtension(
          {
            task_id: task.id,
            task_code: task.task_code,
            task_title: task.title || task.description,
            current_due_date: task.due_date,
            requested_due_date: extensionDate,
            reason: remarks || 'Date extension requested on task update popup',
            attachment_url: fileBase64,
          },
          user
        );

        // Auto approve extension and update task due date
        await extensionService.reviewExtension(
          `ext-${Date.now()}`,
          'Approved',
          'Date extended by user',
          user
        );

        // Also update task remarks and attachment
        await taskService.updateTask(
          task.id,
          {
            due_date: new Date(extensionDate).toISOString(),
            status: 'In Progress',
            completion_remarks: remarks,
            proof_doc_url: fileBase64,
          },
          user
        );
      } else {
        // Mark as Completed
        await taskService.updateTaskStatus(
          task.id,
          'Completed',
          {
            remarks,
            proof_doc_url: fileBase64,
            attachment_url: fileBase64,
          },
          user
        );
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Task Progress & Outcome" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Task Summary Banner */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
              {task.task_code}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{task.title || task.description}</h4>
        </div>

        {/* STATUS OPTIONS: Checklist Tasks CANNOT be extended, only Completed. Delegation tasks have both options */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Status Outcome *
          </label>
          {isChecklistTask ? (
            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Completed</span>
              </div>
              <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                Checklist tasks cannot be extended
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedOutcome('Completed')}
                className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedOutcome === 'Completed'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOutcome('Extend Date')}
                className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedOutcome === 'Extend Date'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Extend Date</span>
              </button>
            </div>
          )}
        </div>

        {/* REQUIREMENT #2: Show Date Picker ONLY IF "Extend Date" is selected */}
        {selectedOutcome === 'Extend Date' && (
          <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 space-y-2">
            <label className="block text-xs font-bold text-amber-900 dark:text-amber-300">
              Select New Date*
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={extensionDate}
              onChange={(e) => setExtensionDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
            />
          </div>
        )}

        {/* Remarks */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Execution Remarks / Extension Reason
          </label>
          <textarea
            rows={3}
            placeholder={
              selectedOutcome === 'Completed'
                ? 'Enter completion notes or work summary...'
                : 'Explain reason for extending due date...'
            }
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* REQUIREMENT #2: DIRECT FILE UPLOAD INPUT (<input type="file" />) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Proof / Document Attachment File
            </label>
            {isAttachmentRequired ? (
              <span className="text-[10px] font-bold text-rose-500 uppercase bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                Required *
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">Optional</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex-1 flex items-center justify-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors">
              <Upload className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                {fileName ? fileName : 'Click to Upload Image, PDF, or Document File'}
              </span>
              <input
                type="file"
                required={isAttachmentRequired && !fileBase64}
                accept="image/*,.pdf,.doc,.docx,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {fileName && (
              <button
                type="button"
                onClick={() => {
                  setUploadedFile(null);
                  setFileBase64('');
                  setFileName('');
                }}
                className="p-2 text-slate-400 hover:text-rose-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all ${selectedOutcome === 'Completed'
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
              }`}
          >
            {loading ? 'Submitting...' : selectedOutcome === 'Completed' ? 'Submit Completion' : 'Update Extension Date'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
