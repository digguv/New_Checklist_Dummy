import { INITIAL_USERS } from './mockData';

const LOCAL_USERS_KEY = 'corporate_system_users';

function getStoredUsers() {
  const stored = localStorage.getItem(LOCAL_USERS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_USERS;
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export const userService = {
  async getUsers() {
    return getStoredUsers();
  },

  async createUser(userData) {
    const users = getStoredUsers();
    const newUser = {
      id: `usr-${Date.now()}`,
      employee_id: userData.employee_id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: userData.full_name,
      email: userData.email,
      mobile: userData.mobile || '',
      role: userData.role || 'EMPLOYEE',
      department_id: userData.department_id || 'dept-ops',
      department_name: userData.department_name || 'Operations',
      designation: userData.designation || 'Associate',
      self_assign_enabled: userData.self_assign_enabled !== undefined ? userData.self_assign_enabled : true,
      is_active: true,
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      created_at: new Date().toISOString(),
    };

    users.unshift(newUser);
    saveStoredUsers(users);
    return newUser;
  },

  async updateUser(userId, updateData) {
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    users[index] = { ...users[index], ...updateData };
    saveStoredUsers(users);
    return users[index];
  },

  async deleteUser(userId) {
    const users = getStoredUsers();
    const filtered = users.filter((u) => u.id !== userId);
    saveStoredUsers(filtered);
  },

  async toggleSelfAssign(userId) {
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    users[index].self_assign_enabled = !users[index].self_assign_enabled;
    saveStoredUsers(users);
    return users[index];
  },

  async toggleUserStatus(userId) {
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    users[index].is_active = !users[index].is_active;
    saveStoredUsers(users);
    return users[index];
  },
};
