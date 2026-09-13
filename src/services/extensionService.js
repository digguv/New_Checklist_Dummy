import { INITIAL_EXTENSIONS } from './mockData';
import { taskService } from './taskService';

const LOCAL_EXTENSIONS_KEY = 'corporate_system_extensions';
const LOCAL_TASKS_KEY = 'corporate_system_tasks';
const LOCAL_HISTORY_KEY = 'corporate_system_history';

function getStoredExtensions() {
  const stored = localStorage.getItem(LOCAL_EXTENSIONS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_EXTENSIONS_KEY, JSON.stringify(INITIAL_EXTENSIONS));
    return INITIAL_EXTENSIONS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_EXTENSIONS;
  }
}

function saveStoredExtensions(extensions) {
  localStorage.setItem(LOCAL_EXTENSIONS_KEY, JSON.stringify(extensions));
}

export const extensionService = {
  async getExtensions() {
    return getStoredExtensions();
  },

  async requestExtension(requestData, currentUser) {
    const extensions = getStoredExtensions();

    const newRequest = {
      id: `ext-${Date.now()}`,
      task_id: requestData.task_id,
      task_code: requestData.task_code || 'TSK-00',
      task_title: requestData.task_title || 'Task Extension Request',
      requested_by: currentUser.id,
      requested_by_name: currentUser.full_name,
      current_due_date: requestData.current_due_date,
      requested_due_date: new Date(requestData.requested_due_date).toISOString(),
      reason: requestData.reason,
      attachment_url: requestData.attachment_url || null,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };

    extensions.unshift(newRequest);
    saveStoredExtensions(extensions);

    // Save history
    const history = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]');
    history.unshift({
      id: `hist-${Date.now()}`,
      task_id: requestData.task_id,
      performed_by_name: currentUser.full_name,
      action: 'Extension Requested',
      details: `Requested new due date ${new Date(requestData.requested_due_date).toLocaleDateString()}. Reason: ${requestData.reason}`,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));

    return newRequest;
  },

  async reviewExtension(extensionId, status, reviewRemarks, managerUser) {
    const extensions = getStoredExtensions();
    const index = extensions.findIndex(e => e.id === extensionId);
    if (index === -1) throw new Error('Extension request not found');

    const ext = extensions[index];
    ext.status = status;
    ext.reviewed_by = managerUser.id;
    ext.reviewed_by_name = managerUser.full_name;
    ext.reviewed_at = new Date().toISOString();
    ext.review_remarks = reviewRemarks || '';

    extensions[index] = ext;
    saveStoredExtensions(extensions);

    // If approved, update current due date on task (preserving original_due_date)
    if (status === 'Approved') {
      const tasks = JSON.parse(localStorage.getItem(LOCAL_TASKS_KEY) || '[]');
      const taskIndex = tasks.findIndex(t => t.id === ext.task_id);
      if (taskIndex !== -1) {
        tasks[taskIndex].due_date = ext.requested_due_date;
        if (tasks[taskIndex].status === 'Overdue') {
          tasks[taskIndex].status = 'In Progress';
        }
        localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
      }
    }

    // Save history
    const history = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]');
    history.unshift({
      id: `hist-${Date.now()}`,
      task_id: ext.task_id,
      performed_by_name: managerUser.full_name,
      action: `Extension ${status}`,
      details: `${status} by ${managerUser.full_name}. ${reviewRemarks ? `Remarks: ${reviewRemarks}` : ''}`,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));

    return ext;
  }
};
