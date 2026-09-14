import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { INITIAL_USERS } from '../../services/mockData';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, AlertCircle, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

export function TaskTransferModal({ isOpen, onClose, onSuccess, initialFromUserId = null }) {
  const { user } = useAuth();
  const [fromUserId, setFromUserId] = useState(initialFromUserId || user?.id || INITIAL_USERS[0].id);
  const [toUserId, setToUserId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [matchingTasksCount, setMatchingTasksCount] = useState(0);

  useEffect(() => {
    if (initialFromUserId) {
      setFromUserId(initialFromUserId);
    } else if (user?.id) {
      setFromUserId(user.id);
    }
  }, [initialFromUserId, user, isOpen]);

  // Set default substitute user (different from selected fromUserId)
  useEffect(() => {
    const fallback = INITIAL_USERS.find((u) => u.id !== fromUserId);
    if (fallback) {
      setToUserId(fallback.id);
    }
  }, [fromUserId]);

  // Dynamic preview of matching pending tasks
  useEffect(() => {
    if (!isOpen || !fromUserId) return;
    const calculateMatching = async () => {
      try {
        const allTasks = await taskService.getTasks();
        const start = startDate ? new Date(startDate) : new Date('1970-01-01');
        const end = endDate ? new Date(endDate + 'T23:59:59') : new Date('2099-12-31');

        const matches = allTasks.filter((t) => {
          if (t.assigned_to !== fromUserId || t.status === 'Completed' || t.status === 'Not Done') return false;
          const due = new Date(t.due_date);
          return due >= start && due <= end;
        });

        setMatchingTasksCount(matches.length);
      } catch (err) {
        console.error('Failed to preview matching tasks:', err);
      }
    };
    calculateMatching();
  }, [isOpen, fromUserId, startDate, endDate]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!fromUserId || !toUserId) {
      setError('Please select both From User (On Leave) and Substitute User.');
      return;
    }

    if (fromUserId === toUserId) {
      setError('Cannot transfer tasks to the exact same user.');
      return;
    }

    if (!endDate) {
      setError('Please select Leave End Date.');
      return;
    }

    setLoading(true);
    try {
      const result = await taskService.transferTasks(
        {
          fromUserId,
          toUserId,
          startDate,
          endDate,
          reason,
        },
        user
      );

      setSuccessMessage(
        `Successfully transferred ${result.transferredCount} task(s) from ${result.fromUserName} to ${result.toUserName}!`
      );

      setTimeout(() => {
        setSuccessMessage('');
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to transfer tasks.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Transfer & Leave Delegation"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleTransfer} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center space-x-2 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-bold">{successMessage}</span>
          </div>
        )}

        {/* Transfer Header Card */}
        <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">Reassign Tasks for Employee Leave</h4>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
                Transfer active checklists & delegations up to the specified leave date
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-300 block">{matchingTasksCount} Tasks</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">matching criteria</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* From Employee */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Employee Going on Leave *
            </label>
            <select
              value={fromUserId}
              onChange={(e) => setFromUserId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            >
              {INITIAL_USERS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.role} - {u.department_name})
                </option>
              ))}
            </select>
          </div>

          {/* To Substitute Employee */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Substitute Employee (Transfer To) *
            </label>
            <select
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white font-bold"
            >
              {INITIAL_USERS.filter((u) => u.id !== fromUserId).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.role} - {u.department_name})
                </option>
              ))}
            </select>
          </div>

          {/* Leave Start Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Leave Start Date *
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            />
          </div>

          {/* Leave End Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Leave End Date (Up to Date) *
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white font-bold"
            />
          </div>
        </div>

        {/* Reason / Remarks */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Leave Reason / Transfer Remarks
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Annual Leave, Medical Emergency, Sick Leave..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Actions */}
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
            disabled={loading || matchingTasksCount === 0}
            className={`px-6 py-2 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 ${
              loading || matchingTasksCount === 0
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{loading ? 'Transferring...' : `Transfer ${matchingTasksCount} Task(s)`}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
