import { DEPARTMENTS, DESIGNATIONS, FREQUENCIES, TASK_PRIORITY, TASK_STATUS } from '../config/constants';

const LOCAL_MASTERS_KEY = 'corporate_system_masters';

function getStoredMasters() {
  const stored = localStorage.getItem(LOCAL_MASTERS_KEY);
  if (!stored) {
    const initial = {
      departments: DEPARTMENTS,
      designations: DESIGNATIONS,
      frequencies: FREQUENCIES,
      priorities: Object.values(TASK_PRIORITY),
      statuses: Object.values(TASK_STATUS),
    };
    localStorage.setItem(LOCAL_MASTERS_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return {
      departments: DEPARTMENTS,
      designations: DESIGNATIONS,
      frequencies: FREQUENCIES,
      priorities: Object.values(TASK_PRIORITY),
      statuses: Object.values(TASK_STATUS),
    };
  }
}

function saveMasters(data) {
  localStorage.setItem(LOCAL_MASTERS_KEY, JSON.stringify(data));
}

export const masterService = {
  async getMasters() {
    return getStoredMasters();
  },

  async addDepartment(name, code) {
    const masters = getStoredMasters();
    const newDept = {
      id: `dept-${Date.now()}`,
      code: code.toUpperCase(),
      name,
      status: 'Active',
    };
    masters.departments.push(newDept);
    saveMasters(masters);
    return newDept;
  },

  async updateDepartment(id, name, code) {
    const masters = getStoredMasters();
    const index = masters.departments.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Department not found');

    masters.departments[index] = {
      ...masters.departments[index],
      name,
      code: code.toUpperCase(),
    };
    saveMasters(masters);
    return masters.departments[index];
  },

  async deleteDepartment(id) {
    const masters = getStoredMasters();
    masters.departments = masters.departments.filter((d) => d.id !== id);
    saveMasters(masters);
  },

  async addDesignation(title, deptId) {
    const masters = getStoredMasters();
    const newDesig = {
      id: `desig-${Date.now()}`,
      title,
      deptId,
      status: 'Active',
    };
    masters.designations.push(newDesig);
    saveMasters(masters);
    return newDesig;
  },

  async updateDesignation(id, title, deptId) {
    const masters = getStoredMasters();
    const index = masters.designations.findIndex((des) => des.id === id);
    if (index === -1) throw new Error('Designation not found');

    masters.designations[index] = {
      ...masters.designations[index],
      title,
      deptId,
    };
    saveMasters(masters);
    return masters.designations[index];
  },

  async deleteDesignation(id) {
    const masters = getStoredMasters();
    masters.designations = masters.designations.filter((des) => des.id !== id);
    saveMasters(masters);
  },
};
