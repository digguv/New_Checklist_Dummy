import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { formatDate, formatDateTime, calculateTAT } from '../../lib/utils';
import { taskService } from '../../services/taskService';
import { Calendar, User, Clock, FileText, History, Paperclip, CheckCircle2 } from 'lucide-react';

export function TaskDetailModal({ isOpen, onClose, taskId }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskId && isOpen) {
      loadTask();
    }
  }, [taskId, isOpen]);

  const loadTask = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTaskById(taskId);
      setTask(data);
    } catch (err) {
      console.error('Failed to load task detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Detail & Audit Timeline" maxWidth="max-w-3xl">
      {loading || !task ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading task details...</div>
      ) : (
        <div className="space-y-6">
          {/* Top Header Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                {task.task_code}
              </span>
              <div className="flex items-center space-x-2">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
            </div>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{task.title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{task.description || 'No description provided.'}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Assigned By</span>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span>{task.assigned_by_name || 'Admin'}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Assigned To</span>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <User className="w-3.5 h-3.5 text-emerald-500" />
                <span>{task.assigned_to_name || 'Employee'}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Original Due Date</span>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>{formatDate(task.original_due_date || task.due_date)}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Current Due Date</span>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>{formatDate(task.due_date)}</span>
              </div>
            </div>
          </div>

          {/* Proofs & Attachments */}
          {(task.proof_image_url || task.proof_doc_url || task.attachment_url) && (
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Paperclip className="w-4 h-4 text-indigo-500" />
                <span>Attachments & Completion Proofs</span>
              </p>

              <div className="flex flex-wrap gap-3">
                {task.proof_image_url && (
                  <a
                    href={task.proof_image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Proof Image</span>
                  </a>
                )}
                {task.proof_doc_url && (
                  <a
                    href={task.proof_doc_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Proof Document</span>
                  </a>
                )}
                {task.attachment_url && (
                  <a
                    href={task.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Task Attachment</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Remarks Section */}
          {task.completion_remarks && (
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Completion Remarks</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">{task.completion_remarks}</p>
            </div>
          )}

          {/* Audit Timeline */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <History className="w-4 h-4 text-indigo-500" />
              <span>Activity Audit Timeline</span>
            </h4>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-6">
              {task.history && task.history.length > 0 ? (
                task.history.map((h) => (
                  <div key={h.id} className="relative pl-6">
                    <div className="absolute -left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{h.action}</span>
                        <span className="text-[10px] text-slate-400">• {formatDateTime(h.created_at)}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        By <span className="font-semibold">{h.performed_by_name}</span>: {h.details}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="relative pl-6">
                  <div className="absolute -left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600" />
                  <p className="text-xs text-slate-500">Task created on {formatDateTime(task.created_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
