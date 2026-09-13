export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
};

export const TASK_TYPES = {
  CHECKLIST: 'checklist',
  DELEGATION: 'delegation',
};

export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  NOT_DONE: 'Not Done',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled',
};

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export const FREQUENCIES = [
  'One Time',
  'Daily',
  'Weekly',
  'Monthly',
  'Quarterly',
  'Half-Yearly',
  'Yearly',
  'Custom',
  'Event Based',
];

export const DEPARTMENTS = [
  { id: 'dept-hr', code: 'HR', name: 'Human Resources' },
  { id: 'dept-sales', code: 'SALES', name: 'Sales & Marketing' },
  { id: 'dept-purchase', code: 'PURCHASE', name: 'Purchase & Logistics' },
  { id: 'dept-accounts', code: 'ACCOUNTS', name: 'Accounts & Finance' },
  { id: 'dept-it', code: 'IT', name: 'Information Technology' },
  { id: 'dept-admin', code: 'ADMIN', name: 'Admin & Facilities' },
  { id: 'dept-ops', code: 'OPS', name: 'Operations' },
];

export const DESIGNATIONS = [
  { id: 'desig-1', title: 'System Administrator', deptId: 'dept-it' },
  { id: 'desig-2', title: 'IT Support Engineer', deptId: 'dept-it' },
  { id: 'desig-3', title: 'Operations Manager', deptId: 'dept-ops' },
  { id: 'desig-4', title: 'Operations Associate', deptId: 'dept-ops' },
  { id: 'desig-5', title: 'HR Manager', deptId: 'dept-hr' },
  { id: 'desig-6', title: 'HR Executive', deptId: 'dept-hr' },
  { id: 'desig-7', title: 'Sales Executive', deptId: 'dept-sales' },
  { id: 'desig-8', title: 'Accounts Officer', deptId: 'dept-accounts' },
];
