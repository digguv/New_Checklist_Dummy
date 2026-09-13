import { taskService } from './taskService';
import { calculateTAT, calculatePerformanceScore } from '../lib/utils';
import { INITIAL_USERS } from './mockData';

export const reportService = {
  async getEmployeePerformanceReport() {
    const tasks = await taskService.getTasks();
    const users = INITIAL_USERS;

    return users.map(user => {
      const userTasks = tasks.filter(t => t.assigned_to === user.id);
      const totalTasks = userTasks.length;
      const completed = userTasks.filter(t => t.status === 'Completed').length;
      const pending = userTasks.filter(t => t.status === 'Pending').length;
      const inProgress = userTasks.filter(t => t.status === 'In Progress').length;
      const overdue = userTasks.filter(t => t.status === 'Overdue').length;

      let completedOnTime = 0;
      let completedLate = 0;

      userTasks.forEach(t => {
        if (t.status === 'Completed') {
          const tatInfo = calculateTAT(t.start_date, t.due_date, t.completion_date);
          if (tatInfo.status === 'On Time') completedOnTime++;
          else completedLate++;
        }
      });

      const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 100;
      const onTimeRate = completed > 0 ? Math.round((completedOnTime / completed) * 100) : 100;
      const overdueRate = totalTasks > 0 ? Math.round((overdue / totalTasks) * 100) : 0;

      const overallScore = calculatePerformanceScore({
        completedOnTime,
        completedLate,
        overdueCount: overdue,
        totalTasks
      });

      return {
        id: user.id,
        employee_id: user.employee_id,
        name: user.full_name,
        department: user.department_name,
        role: user.role,
        totalTasks,
        completed,
        pending,
        inProgress,
        overdue,
        completedOnTime,
        completedLate,
        completionRate,
        onTimeRate,
        overdueRate,
        overallScore
      };
    });
  },

  async getDepartmentReport() {
    const tasks = await taskService.getTasks();
    const depts = [
      'Operations',
      'Information Technology',
      'Sales & Marketing',
      'Accounts & Finance',
      'Human Resources',
      'Purchase & Logistics'
    ];

    return depts.map(deptName => {
      const deptTasks = tasks.filter(t => t.department_name === deptName);
      const total = deptTasks.length;
      const completed = deptTasks.filter(t => t.status === 'Completed').length;
      const pending = deptTasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
      const overdue = deptTasks.filter(t => t.status === 'Overdue').length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;

      return {
        department: deptName,
        totalTasks: total,
        completed,
        pending,
        overdue,
        completionRate
      };
    });
  },

  async getTatReport() {
    const tasks = await taskService.getTasks();
    return tasks.map(t => {
      const tat = calculateTAT(t.start_date, t.due_date, t.completion_date);
      return {
        id: t.id,
        task_code: t.task_code,
        title: t.title,
        type: t.type,
        assignedTo: t.assigned_to_name || 'N/A',
        department: t.department_name || 'Operations',
        start_date: t.start_date,
        due_date: t.due_date,
        completion_date: t.completion_date,
        tatDays: tat.tatDays,
        delayDays: tat.delayDays,
        tatStatus: tat.status,
        status: t.status
      };
    });
  },

  async getDashboardMetrics() {
    const tasks = await taskService.getTasks();
    const users = INITIAL_USERS;

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.is_active).length;
    const totalChecklists = tasks.filter(t => t.type === 'checklist').length;
    const totalDelegations = tasks.filter(t => t.type === 'delegation').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const overdueTasks = tasks.filter(t => t.status === 'Overdue').length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    return {
      totalUsers,
      activeUsers,
      totalChecklists,
      totalDelegations,
      pendingTasks,
      completedTasks,
      overdueTasks,
      totalTasks,
      completionRate
    };
  }
};
