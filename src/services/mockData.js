export const INITIAL_USERS = [
  {
    id: 'usr-admin-1',
    employee_id: 'EMP-1001',
    full_name: 'Vikramaditya Sharma',
    email: 'admin@corporate.com',
    role: 'ADMIN',
    department_id: 'dept-it',
    department_name: 'Information Technology',
    designation: 'System Administrator',
    mobile: '+91 98765 43210',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_active: true,
  },
  {
    id: 'usr-manager-1',
    employee_id: 'EMP-1002',
    full_name: 'Ananya Roy',
    email: 'manager@corporate.com',
    role: 'MANAGER',
    department_id: 'dept-ops',
    department_name: 'Operations',
    designation: 'Operations Manager',
    mobile: '+91 98765 43211',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    is_active: true,
  },
  {
    id: 'usr-emp-1',
    employee_id: 'EMP-1003',
    full_name: 'Rahul Verma',
    email: 'employee@corporate.com',
    role: 'EMPLOYEE',
    department_id: 'dept-ops',
    department_name: 'Operations',
    designation: 'Operations Associate',
    mobile: '+91 98765 43212',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_active: true,
  },
  {
    id: 'usr-emp-2',
    employee_id: 'EMP-1004',
    full_name: 'Priya Sharma',
    email: 'priya@corporate.com',
    role: 'EMPLOYEE',
    department_id: 'dept-sales',
    department_name: 'Sales & Marketing',
    designation: 'Sales Executive',
    mobile: '+91 98765 43213',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    is_active: true,
  },
  {
    id: 'usr-emp-3',
    employee_id: 'EMP-1005',
    full_name: 'Siddharth Mehta',
    email: 'siddharth@corporate.com',
    role: 'EMPLOYEE',
    department_id: 'dept-accounts',
    department_name: 'Accounts & Finance',
    designation: 'Accounts Officer',
    mobile: '+91 98765 43214',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_active: true,
  }
];

export const INITIAL_CHECKLISTS = [];

export const INITIAL_TASKS = [];

export const INITIAL_EXTENSIONS = [];

export const INITIAL_NOTIFICATIONS = [];

export const INITIAL_HISTORY = [];

export const INITIAL_SETTINGS = {
  company_name: 'Acme Corporate Corp',
  company_logo: '',
  date_format: 'dd/MM/yyyy',
  time_format: '12h',
  default_priority: 'Medium',
  default_reminder: '1 Day Before',
  require_remarks_on_not_done: true,
  require_proof_attachment: false,
  extension_approval_required: true,
  on_time_score: 100,
  late_deduction_per_day: 10,
  overdue_score: 0,
};
