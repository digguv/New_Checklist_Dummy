import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/leaveService';
import { INITIAL_USERS } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { Plane, CheckCircle2, XCircle, ArrowRightLeft, UserCheck, Search, Filter, AlertCircle, Clock } from 'lucide-react';

export function LeaveRequestsPage() {
  const { user, isAdmin, isManager } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Approval Modal States
  const [selectedLeaveForApproval, setSelectedLeaveForApproval] = useState(null);
  const [selectedSubstituteId, setSelectedSubstituteId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Rejection Modal States
  const [selectedLeaveForRejection, setSelectedLeaveForRejection] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadLeaves();
  }, [statusFilter, searchQuery]);

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getLeaveRequests({
        status: statusFilter,
        search: searchQuery,
      });
      setLeaves(data);
    } catch (err) {
      console.error('Failed to load leave requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApprovalModal = (leave) => {
    setSelectedLeaveForApproval(leave);
    // Default substitute is employee's preferred substitute or fallback
    const defaultSub =
      leave.preferred_substitute_id ||
      INITIAL_USERS.find((u) => u.id !== leave.user_id)?.id ||
      '';
    setSelectedSubstituteId(defaultSub);
    setModalError('');
  };

  const handleConfirmApproval = async (e) => {
    e.preventDefault();
    if (!selectedLeaveForApproval) return;

    setActionLoading(true);
    setModalError('');

    try {
      await leaveService.approveLeaveRequest(
        selectedLeaveForApproval.id,
        user,
        selectedSubstituteId || null
      );

      setSelectedLeaveForApproval(null);
      loadLeaves();
    } catch (err) {
      setModalError(err.message || 'Failed to approve leave request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmRejection = async (e) => {
    e.preventDefault();
    if (!selectedLeaveForRejection) return;

    setActionLoading(true);
    try {
      await leaveService.rejectLeaveRequest(
        selectedLeaveForRejection.id,
        user,
        rejectionReason
      );

      setSelectedLeaveForRejection(null);
      setRejectionReason('');
      loadLeaves();
    } catch (err) {
      alert(err.message || 'Failed to reject leave request');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Leave Requests & Task Transfer Approval
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review employee leave requests, approve dates, and confirm or modify task transfer substitutes
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee name, department, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white font-bold"
          >
            <option value="All">All Leave Statuses</option>
            <option value="Pending">Pending Approvals</option>
            <option value="Approved">Approved Leaves</option>
            <option value="Rejected">Rejected Requests</option>
          </select>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading leave requests...</div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No leave requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3.5 w-32">Action</th>
                  <th className="px-4 py-3.5">Employee Name</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Leave Duration</th>
                  <th className="px-4 py-3.5">Leave Reason</th>
                  <th className="px-4 py-3.5">Task Transfer Substitute</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-semibold">
                      {l.status === 'Pending' ? (
                        isAdmin ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleOpenApprovalModal(l)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1"
                              title="Approve & Transfer Tasks"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => setSelectedLeaveForRejection(l)}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1"
                              title="Reject Request"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-lg font-bold border border-amber-200 dark:border-amber-800">
                            In Process (Admin Approval Needed)
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {l.status === 'Approved'
                            ? `Approved by ${l.approved_by_name || 'Admin'}`
                            : l.status === 'Rejected'
                            ? `Rejected by ${l.rejected_by_name || 'Admin'}`
                            : 'Finalized'}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {l.user_name}
                    </td>

                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {l.user_department || 'Operations'}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{l.leave_days}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {l.start_date} to {l.end_date}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {l.reason}
                    </td>

                    <td className="px-4 py-3">
                      {l.want_transfer ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                            <UserCheck className="w-3 h-3" />
                            <span>{l.final_substitute_name || l.preferred_substitute_name || 'Substitute Requested'}</span>
                          </span>
                          {l.status === 'Pending' && (
                            <span className="text-[10px] text-slate-400 block font-normal">
                              Requested by Employee
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">No transfer requested</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          l.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : l.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Approval & Task Transfer Modal */}
      {selectedLeaveForApproval && (
        <Modal
          isOpen={Boolean(selectedLeaveForApproval)}
          onClose={() => setSelectedLeaveForApproval(null)}
          title="Approve Leave & Confirm Task Transfer"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleConfirmApproval} className="space-y-4">
            {modalError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2 border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedLeaveForApproval.user_name}
                </span>
                <span className="font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                  {selectedLeaveForApproval.leave_days}
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-400">
                <strong>Leave Period:</strong> {selectedLeaveForApproval.start_date} to {selectedLeaveForApproval.end_date}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <strong>Reason:</strong> {selectedLeaveForApproval.reason}
              </p>
            </div>

            {/* Requirement #1: Admin Can Override or Confirm Task Substitute Employee */}
            <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900 space-y-3">
              <div className="flex items-center space-x-2">
                <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  Task Transfer Substitute Employee Selection (Admin Control)
                </h4>
              </div>

              {selectedLeaveForApproval.preferred_substitute_name && (
                <div className="text-[11px] text-indigo-700 dark:text-indigo-300">
                  Employee's Preferred Preference: <strong>{selectedLeaveForApproval.preferred_substitute_name}</strong>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Assign Tasks To (Admin can change or keep preference) *
                </label>
                <select
                  value={selectedSubstituteId}
                  onChange={(e) => setSelectedSubstituteId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white font-bold"
                >
                  <option value="">Do Not Transfer Tasks (Leave Pending)</option>
                  {INITIAL_USERS.filter((u) => u.id !== selectedLeaveForApproval.user_id).map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.role} - {u.department_name})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                  Approving will automatically reassign all pending checklists due between {selectedLeaveForApproval.start_date} and {selectedLeaveForApproval.end_date}.
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedLeaveForApproval(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={actionLoading}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{actionLoading ? 'Approving & Transferring...' : 'Approve & Execute Task Transfer'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Admin Rejection Modal */}
      {selectedLeaveForRejection && (
        <Modal
          isOpen={Boolean(selectedLeaveForRejection)}
          onClose={() => setSelectedLeaveForRejection(null)}
          title="Reject / Decline Leave Request"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmRejection} className="space-y-4">
            <div className="bg-rose-50 dark:bg-rose-950/40 p-3.5 rounded-xl border border-rose-100 dark:border-rose-900 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>Employee: {selectedLeaveForRejection.user_name}</span>
                <span className="text-rose-600">{selectedLeaveForRejection.leave_days}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                <strong>Period:</strong> {selectedLeaveForRejection.start_date} to {selectedLeaveForRejection.end_date}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <strong>Reason:</strong> {selectedLeaveForRejection.reason}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select or Enter Rejection Reason *
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[
                  'Critical project deliverable in progress',
                  'Staff shortage on selected dates',
                  'Multiple team members on leave',
                  'Please reschedule leave dates',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRejectionReason(preset)}
                    className="text-[10px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors font-medium"
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                required
                placeholder="Type specific reason for declining this leave request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none dark:text-white"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedLeaveForRejection(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 flex items-center space-x-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>{actionLoading ? 'Declining...' : 'Reject Leave Request'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
