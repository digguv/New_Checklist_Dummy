import { INITIAL_NOTIFICATIONS } from './mockData';

const LOCAL_NOTIFS_KEY = 'corporate_system_notifications';

function getStoredNotifications() {
  const stored = localStorage.getItem(LOCAL_NOTIFS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

function saveNotifications(notifs) {
  localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(notifs));
}

export const notificationService = {
  async getNotifications(userId) {
    const all = getStoredNotifications();
    if (!userId) return all;
    return all.filter((n) => n.user_id === userId || !n.user_id);
  },

  async markAsRead(id) {
    const all = getStoredNotifications();
    const index = all.findIndex((n) => n.id === id);
    if (index !== -1) {
      all[index].is_read = true;
      saveNotifications(all);
    }
  },

  async markAllAsRead(userId) {
    const all = getStoredNotifications();
    const updated = all.map((n) => (n.user_id === userId ? { ...n, is_read: true } : n));
    saveNotifications(updated);
  },

  async sendNotification({ userId, title, message, type, linkUrl }) {
    const all = getStoredNotifications();
    const newNotif = {
      id: `notif-${Date.now()}`,
      user_id: userId,
      title,
      message,
      type: type || 'general',
      link_url: linkUrl || '/my-tasks',
      is_read: false,
      created_at: new Date().toISOString(),
    };
    all.unshift(newNotif);
    saveNotifications(all);
    return newNotif;
  },

  // Event Helper Notifications
  async notifyTaskAssigned({ doerId, taskTitle, assignedByName }) {
    return this.sendNotification({
      userId: doerId,
      title: '📋 New Task Assigned',
      message: `${assignedByName} assigned you a new task: "${taskTitle}"`,
      type: 'task_assigned',
      linkUrl: '/my-tasks',
    });
  },

  async notifyTaskEdited({ doerId, taskTitle, editedByName }) {
    return this.sendNotification({
      userId: doerId,
      title: '✏️ Task Updated',
      message: `${editedByName} updated task details for "${taskTitle}"`,
      type: 'task_edited',
      linkUrl: '/my-tasks',
    });
  },

  async notifyTaskDeleted({ doerId, taskTitle, deletedByName }) {
    return this.sendNotification({
      userId: doerId,
      title: '❌ Task Removed',
      message: `${deletedByName} deleted task "${taskTitle}"`,
      type: 'task_deleted',
      linkUrl: '/my-tasks',
    });
  },

  async notifyTaskCompleted({ managerId, taskTitle, doerName }) {
    return this.sendNotification({
      userId: managerId,
      title: '✅ Task Completed',
      message: `${doerName} completed task "${taskTitle}"`,
      type: 'task_completed',
      linkUrl: '/task-assignment',
    });
  },

  async notifyTaskTransferred({ toUserId, fromUserName, taskCount, reason }) {
    return this.sendNotification({
      userId: toUserId,
      title: '🔄 Tasks Transferred (Leave Coverage)',
      message: `${taskCount} task(s) transferred to you from ${fromUserName} due to leave (${reason || 'Leave Delegation'})`,
      type: 'task_transferred',
      linkUrl: '/my-tasks',
    });
  },

  // User Activity Tracking (Login / Logout / Leave)
  async notifyLogin(user) {
    if (!user) return;
    return this.sendNotification({
      userId: null, // Broadcast to activity center
      title: '🟢 User Session Started',
      message: `User ${user.full_name} (${user.role} - ${user.department_name || 'Operations'}) logged into the system.`,
      type: 'user_login',
      linkUrl: '/notifications',
    });
  },

  async notifyLogout(user) {
    if (!user) return;
    return this.sendNotification({
      userId: null, // Broadcast to activity center
      title: '🔴 User Logged Out',
      message: `User ${user.full_name} (${user.role}) logged out of the system.`,
      type: 'user_logout',
      linkUrl: '/notifications',
    });
  },

  async notifyLeaveRequested({ user, startDate, endDate, reason, wantTransfer, preferredSubstituteName }) {
    const transferMsg = wantTransfer && preferredSubstituteName
      ? ` (Requested task transfer to ${preferredSubstituteName})`
      : '';
    return this.sendNotification({
      userId: null,
      title: '✈️ New Leave Request Submitted',
      message: `${user.full_name} submitted a leave request from ${startDate} to ${endDate}. Reason: "${reason}"${transferMsg}`,
      type: 'leave_requested',
      linkUrl: '/leave-requests',
    });
  },

  async notifyLeaveApproved({ leaveRequest, approvedBy, substituteName, transferredCount }) {
    const subMsg = substituteName
      ? ` (Tasks transferred to ${substituteName} - ${transferredCount} task(s))`
      : '';
    return this.sendNotification({
      userId: leaveRequest.user_id,
      title: '✅ Leave Approved',
      message: `Admin ${approvedBy.full_name} approved your leave request for ${leaveRequest.start_date} to ${leaveRequest.end_date}${subMsg}`,
      type: 'leave_approved',
      linkUrl: '/leave-requests',
    });
  },

  async notifyLeaveRejected({ leaveRequest, rejectedBy, reason }) {
    return this.sendNotification({
      userId: leaveRequest.user_id,
      title: '❌ Leave Request Declined',
      message: `Admin ${rejectedBy.full_name} declined your leave request (${leaveRequest.start_date} to ${leaveRequest.end_date}). Reason: ${reason || 'N/A'}`,
      type: 'leave_rejected',
      linkUrl: '/leave-requests',
    });
  },
};
