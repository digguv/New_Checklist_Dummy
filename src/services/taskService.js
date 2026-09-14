import { INITIAL_TASKS, INITIAL_CHECKLISTS, INITIAL_HISTORY, INITIAL_USERS } from './mockData';
import { notificationService } from './notificationService';
import { holidayService } from './holidayService';

const LOCAL_TASKS_KEY = 'corporate_system_tasks';
const LOCAL_CHECKLISTS_KEY = 'corporate_system_checklists';
const LOCAL_HISTORY_KEY = 'corporate_system_history';

function getStoredTasks() {
  const stored = localStorage.getItem(LOCAL_TASKS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_TASKS;
  }
}

function saveStoredTasks(tasks) {
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
}

function getStoredHistory() {
  const stored = localStorage.getItem(LOCAL_HISTORY_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(INITIAL_HISTORY));
    return INITIAL_HISTORY;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_HISTORY;
  }
}

function saveHistory(event) {
  const history = getStoredHistory();
  const newRecord = {
    id: `hist-${Date.now()}`,
    ...event,
    created_at: new Date().toISOString(),
  };
  history.unshift(newRecord);
  localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));
}

export const taskService = {
  // Fetch tasks with dynamic overdue check & holiday filtering
  async getTasks(filters = {}) {
    let tasks = getStoredTasks();

    // Auto-overdue status check
    const now = new Date();
    tasks = tasks.map((t) => {
      if ((t.status === 'Pending' || t.status === 'In Progress') && new Date(t.due_date) < now) {
        return { ...t, status: 'Overdue' };
      }
      return t;
    });
    saveStoredTasks(tasks);

    // Suppress or flag tasks on Holidays
    if (filters.hideHolidays) {
      tasks = tasks.filter((t) => !holidayService.isHolidayDate(t.due_date));
    }

    // Filter by User Scope
    if (filters.user) {
      const { role, id, department_name } = filters.user;
      if (role === 'EMPLOYEE') {
        tasks = tasks.filter((t) => t.assigned_to === id);
      } else if (role === 'MANAGER') {
        tasks = tasks.filter(
          (t) => t.department_name === department_name || t.assigned_by === id || t.assigned_to === id
        );
      }
    }

    // Filter by Search Query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.task_code.toLowerCase().includes(query) ||
          (t.assigned_to_name && t.assigned_to_name.toLowerCase().includes(query)) ||
          (t.assigned_by_name && t.assigned_by_name.toLowerCase().includes(query))
      );
    }

    // Filter by Status
    if (filters.status && filters.status !== 'All') {
      tasks = tasks.filter((t) => t.status === filters.status);
    }

    // Filter by Priority
    if (filters.priority && filters.priority !== 'All') {
      tasks = tasks.filter((t) => t.priority === filters.priority);
    }

    // Filter by Task Type (checklist vs delegation)
    if (filters.taskType && filters.taskType !== 'All') {
      tasks = tasks.filter((t) => t.type === filters.taskType);
    }

    // Filter by Frequency
    if (filters.frequency && filters.frequency !== 'All') {
      tasks = tasks.filter((t) => t.frequency === filters.frequency);
    }

    // Filter by Department
    if (filters.department && filters.department !== 'All') {
      tasks = tasks.filter((t) => t.department_name === filters.department);
    }

    // Filter by Doer
    if (filters.doerId && filters.doerId !== 'All') {
      tasks = tasks.filter((t) => t.assigned_to === filters.doerId);
    }

    return tasks;
  },

  async getTaskById(id) {
    const tasks = getStoredTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');

    const history = getStoredHistory().filter((h) => h.task_id === id);
    return { ...task, history };
  },

  // Multi-Doer Task Assignment Engine
  async createTaskAssignment(formData, currentUser) {
    const tasks = getStoredTasks();
    const createdTasks = [];

    // Frequency Routing Logic: "One Time" -> Delegation; any other -> Checklist
    const isOneTime = formData.frequency === 'One Time';
    const taskType = isOneTime ? 'delegation' : 'checklist';

    const doers = formData.doers || []; // array of { id, name }

    for (const doer of doers) {
      const taskCode = isOneTime
        ? `DEL-2026-${Math.floor(100 + Math.random() * 900)}`
        : `TSK-CHK-${Math.floor(1000 + Math.random() * 9000)}`;

      const newTask = {
        id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: taskType,
        task_code: taskCode,
        title: formData.title,
        description: formData.description || '',
        department_id: formData.department_id,
        department_name: formData.department_name || 'Operations',
        assigned_by: currentUser.id,
        assigned_by_name: currentUser.full_name,
        assigned_to: doer.id,
        assigned_to_name: doer.name,
        priority: formData.priority || 'Medium',
        frequency: formData.frequency || 'One Time',
        start_date: formData.start_date || new Date().toISOString().split('T')[0],
        due_date: new Date(formData.due_date).toISOString(),
        original_due_date: new Date(formData.due_date).toISOString(),
        status: 'Pending',
        required_attachment: Boolean(formData.required_attachment),
        reminder_enabled: Boolean(formData.reminder_enabled),
        completion_date: null,
        completion_remarks: '',
        attachment_url: formData.attachment_url || null,
        created_at: new Date().toISOString(),
      };

      tasks.unshift(newTask);
      createdTasks.push(newTask);

      saveHistory({
        task_id: newTask.id,
        performed_by_name: currentUser.full_name,
        action: 'Task Assigned',
        details: `Task assigned to ${doer.name} (Frequency: ${formData.frequency}) due on ${new Date(
          formData.due_date
        ).toLocaleDateString()}`,
      });

      // Trigger realtime notification
      notificationService.notifyTaskAssigned({
        doerId: doer.id,
        taskTitle: newTask.title,
        assignedByName: currentUser.full_name,
      });
    }

    saveStoredTasks(tasks);
    return createdTasks;
  },

  async updateTask(taskId, updateData, currentUser) {
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) throw new Error('Task not found');

    const oldTask = tasks[index];

    // Re-route type if frequency changes
    let taskType = oldTask.type;
    if (updateData.frequency) {
      taskType = updateData.frequency === 'One Time' ? 'delegation' : 'checklist';
    }

    const updated = {
      ...oldTask,
      ...updateData,
      type: taskType,
      updated_at: new Date().toISOString(),
    };

    tasks[index] = updated;
    saveStoredTasks(tasks);

    saveHistory({
      task_id: taskId,
      performed_by_name: currentUser.full_name,
      action: 'Task Details Updated',
      details: `Task details edited by ${currentUser.full_name}`,
    });

    // Notify Doer
    notificationService.notifyTaskEdited({
      doerId: updated.assigned_to,
      taskTitle: updated.title,
      editedByName: currentUser.full_name,
    });

    return updated;
  },

  async deleteTask(taskId, currentUser) {
    const tasks = getStoredTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');

    const filtered = tasks.filter((t) => t.id !== taskId);
    saveStoredTasks(filtered);

    saveHistory({
      task_id: taskId,
      performed_by_name: currentUser.full_name,
      action: 'Task Deleted',
      details: `Task ${task.task_code} deleted by ${currentUser.full_name}`,
    });

    // Notify Doer
    notificationService.notifyTaskDeleted({
      doerId: task.assigned_to,
      taskTitle: task.title,
      deletedByName: currentUser.full_name,
    });
  },

  async updateTaskStatus(taskId, newStatus, payload = {}, currentUser) {
    const tasks = getStoredTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task not found');

    const oldTask = tasks[taskIndex];
    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === 'Completed' || newStatus === 'Not Done') {
      updateData.completion_date = new Date().toISOString();
      updateData.completion_remarks = payload.remarks || '';
      if (payload.attachment_url) updateData.proof_doc_url = payload.attachment_url;
      if (payload.proof_image_url) updateData.proof_image_url = payload.proof_image_url;
      if (payload.proof_doc_url) updateData.proof_doc_url = payload.proof_doc_url;
    }

    tasks[taskIndex] = { ...oldTask, ...updateData };
    saveStoredTasks(tasks);

    saveHistory({
      task_id: taskId,
      performed_by_name: currentUser ? currentUser.full_name : 'System User',
      action: `Status Updated to ${newStatus}`,
      details: `Status changed from ${oldTask.status} to ${newStatus}. Remarks: ${payload.remarks || 'None'}`,
    });

    // Send Completion Notification to Assigner / Manager
    if (newStatus === 'Completed') {
      notificationService.notifyTaskCompleted({
        managerId: oldTask.assigned_by,
        taskTitle: oldTask.title,
        doerName: currentUser ? currentUser.full_name : oldTask.assigned_to_name,
      });
    }

    return tasks[taskIndex];
  },

  async getChecklists() {
    const tasks = getStoredTasks();
    return tasks.filter((t) => t.type === 'checklist');
  },

  // Leave Delegation / Task Transfer Engine
  async transferTasks({ fromUserId, toUserId, startDate, endDate, reason }, currentUser) {
    const tasks = getStoredTasks();
    const fromUser = INITIAL_USERS.find((u) => u.id === fromUserId);
    const toUser = INITIAL_USERS.find((u) => u.id === toUserId);

    if (!fromUser || !toUser) throw new Error('Selected employees not found');
    if (fromUserId === toUserId) throw new Error('Cannot transfer tasks to the same user');

    const start = startDate ? new Date(startDate) : new Date('1970-01-01');
    const end = endDate ? new Date(endDate + 'T23:59:59') : new Date('2099-12-31');

    let transferredCount = 0;

    const updatedTasks = tasks.map((task) => {
      if (
        task.assigned_to === fromUserId &&
        task.status !== 'Completed' &&
        task.status !== 'Not Done'
      ) {
        const taskDueDate = new Date(task.due_date);
        if (taskDueDate >= start && taskDueDate <= end) {
          transferredCount++;

          saveHistory({
            task_id: task.id,
            performed_by_name: currentUser ? currentUser.full_name : 'System Admin',
            action: 'Task Transferred (Leave Delegation)',
            details: `Transferred from ${fromUser.full_name} to ${toUser.full_name} due to leave (${startDate || 'Any'} to ${endDate || 'Any'}). Reason: ${reason || 'On Leave'}`,
          });

          return {
            ...task,
            assigned_to: toUser.id,
            assigned_to_name: toUser.full_name,
            transferred_from: fromUser.id,
            transferred_from_name: fromUser.full_name,
            transfer_reason: reason || 'Leave Delegation',
            updated_at: new Date().toISOString(),
          };
        }
      }
      return task;
    });

    if (transferredCount === 0) {
      throw new Error('No active or pending tasks found for this user in the specified date range.');
    }

    saveStoredTasks(updatedTasks);

    // Send notification to substitute user
    notificationService.notifyTaskTransferred({
      toUserId: toUser.id,
      fromUserName: fromUser.full_name,
      taskCount: transferredCount,
      reason,
    });

    return {
      transferredCount,
      fromUserName: fromUser.full_name,
      toUserName: toUser.full_name,
    };
  },
};
