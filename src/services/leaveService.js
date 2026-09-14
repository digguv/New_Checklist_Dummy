import { INITIAL_USERS } from './mockData';
import { notificationService } from './notificationService';
import { taskService } from './taskService';

const LOCAL_LEAVE_KEY = 'corporate_system_leave_requests';

const INITIAL_LEAVE_REQUESTS = [];

function getStoredLeaves() {
  const stored = localStorage.getItem(LOCAL_LEAVE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_LEAVE_KEY, JSON.stringify(INITIAL_LEAVE_REQUESTS));
    return INITIAL_LEAVE_REQUESTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_LEAVE_REQUESTS;
  }
}

function saveStoredLeaves(leaves) {
  localStorage.setItem(LOCAL_LEAVE_KEY, JSON.stringify(leaves));
}

export const leaveService = {
  async getLeaveRequests(filters = {}) {
    let leaves = getStoredLeaves();

    if (filters.userId) {
      leaves = leaves.filter((l) => l.user_id === filters.userId);
    }

    if (filters.status && filters.status !== 'All') {
      leaves = leaves.filter((l) => l.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      leaves = leaves.filter(
        (l) =>
          l.user_name.toLowerCase().includes(q) ||
          l.reason.toLowerCase().includes(q) ||
          (l.user_department && l.user_department.toLowerCase().includes(q))
      );
    }

    return leaves;
  },

  async createLeaveRequest(formData, currentUser) {
    const leaves = getStoredLeaves();

    let preferredSubstituteName = null;
    if (formData.want_transfer && formData.preferred_substitute_id) {
      const subUser = INITIAL_USERS.find((u) => u.id === formData.preferred_substitute_id);
      preferredSubstituteName = subUser?.full_name || null;
    }

    const newRequest = {
      id: `leave-${Date.now()}`,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_department: currentUser.department_name || 'Operations',
      reason: formData.reason,
      leave_days: formData.leave_days || '1 Day',
      start_date: formData.start_date,
      end_date: formData.end_date,
      want_transfer: Boolean(formData.want_transfer),
      preferred_substitute_id: formData.want_transfer ? formData.preferred_substitute_id : null,
      preferred_substitute_name: formData.want_transfer ? preferredSubstituteName : null,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };

    leaves.unshift(newRequest);
    saveStoredLeaves(leaves);

    // Notify Activity Center
    notificationService.notifyLeaveRequested({
      user: currentUser,
      startDate: newRequest.start_date,
      endDate: newRequest.end_date,
      reason: newRequest.reason,
      wantTransfer: newRequest.want_transfer,
      preferredSubstituteName,
    });

    return newRequest;
  },

  async approveLeaveRequest(requestId, adminUser, overrideSubstituteId = null) {
    const leaves = getStoredLeaves();
    const index = leaves.findIndex((l) => l.id === requestId);
    if (index === -1) throw new Error('Leave request not found');

    const leave = leaves[index];
    const targetSubstituteId = overrideSubstituteId || leave.preferred_substitute_id;
    let targetSubstituteUser = null;

    if (targetSubstituteId) {
      targetSubstituteUser = INITIAL_USERS.find((u) => u.id === targetSubstituteId);
    }

    let transferResult = null;

    // Automatically perform Task Transfer if substitute selected
    if (targetSubstituteId && targetSubstituteUser) {
      try {
        transferResult = await taskService.transferTasks(
          {
            fromUserId: leave.user_id,
            toUserId: targetSubstituteId,
            startDate: leave.start_date,
            endDate: leave.end_date,
            reason: `Leave: ${leave.reason}`,
          },
          adminUser
        );
      } catch (err) {
        console.warn('Auto task transfer warning during leave approval:', err.message);
      }
    }

    const updated = {
      ...leave,
      status: 'Approved',
      approved_by_name: adminUser.full_name,
      final_substitute_id: targetSubstituteId || null,
      final_substitute_name: targetSubstituteUser ? targetSubstituteUser.full_name : null,
      updated_at: new Date().toISOString(),
    };

    leaves[index] = updated;
    saveStoredLeaves(leaves);

    // Notify Activity Center
    notificationService.notifyLeaveApproved({
      leaveRequest: updated,
      approvedBy: adminUser,
      substituteName: targetSubstituteUser ? targetSubstituteUser.full_name : null,
      transferredCount: transferResult ? transferResult.transferredCount : 0,
    });

    return updated;
  },

  async rejectLeaveRequest(requestId, adminUser, rejectionReason = '') {
    const leaves = getStoredLeaves();
    const index = leaves.findIndex((l) => l.id === requestId);
    if (index === -1) throw new Error('Leave request not found');

    const leave = leaves[index];
    const updated = {
      ...leave,
      status: 'Rejected',
      rejected_by_name: adminUser.full_name,
      rejection_reason: rejectionReason,
      updated_at: new Date().toISOString(),
    };

    leaves[index] = updated;
    saveStoredLeaves(leaves);

    // Notify Activity Center
    notificationService.notifyLeaveRejected({
      leaveRequest: updated,
      rejectedBy: adminUser,
      reason: rejectionReason,
    });

    return updated;
  },
};
