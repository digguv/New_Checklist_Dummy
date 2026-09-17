import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, Phone, Mail, CheckCircle2, UserCheck, Lock } from 'lucide-react';
import { useOTDStorage } from '../../hooks/useOTDStorage';
import { STORAGE_KEYS, setData, generateId, getCurrentUser, setCurrentUser, logAuditAction } from '../../services/otdStorageService';
import { SYSTEMS_CONFIG } from '../../config/systemsConfig';

export function EmployeesPage() {
  const employees = useOTDStorage(STORAGE_KEYS.EMPLOYEES, []);
  const currentUser = getCurrentUser();

  const [showModal, setShowModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);

  const ALL_MODULE_IDS = SYSTEMS_CONFIG.map((sys) => sys.id);

  const [form, setForm] = useState({
    code: '',
    name: '',
    department: 'Sales',
    designation: 'Executive',
    userGroup: 'Sales User',
    mobile: '',
    email: '',
    allowedModules: ALL_MODULE_IDS,
    status: 'Active'
  });

  const handleOpenModal = (emp = null) => {
    if (emp) {
      setEditingEmp(emp);
      setForm({
        ...emp,
        allowedModules: emp.allowedModules || ALL_MODULE_IDS
      });
    } else {
      setEditingEmp(null);
      setForm({
        code: `EMP-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        department: 'Sales',
        designation: 'Sales Executive',
        userGroup: 'Sales User',
        mobile: '',
        email: '',
        allowedModules: ALL_MODULE_IDS,
        status: 'Active'
      });
    }
    setShowModal(true);
  };

  const handleToggleModulePermission = (moduleId) => {
    const current = form.allowedModules || [];
    let updated;
    if (current.includes(moduleId)) {
      updated = current.filter((id) => id !== moduleId);
    } else {
      updated = [...current, moduleId];
    }
    setForm({ ...form, allowedModules: updated });
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Employee Name is required');

    let updated;
    if (editingEmp) {
      updated = employees.map((emp) => (emp.id === editingEmp.id ? { ...emp, ...form } : emp));
      logAuditAction('Employee Updated', 'User Master', editingEmp.id, form);
    } else {
      const newEmp = { id: generateId('EMP'), ...form, createdAt: new Date().toISOString() };
      updated = [...employees, newEmp];
      logAuditAction('Employee Created', 'User Master', newEmp.id, form);
    }

    setData(STORAGE_KEYS.EMPLOYEES, updated);

    // If active session user was modified, update active user session in storage
    if (currentUser?.id === editingEmp?.id) {
      setCurrentUser({ ...currentUser, ...form });
    }

    setShowModal(false);
  };

  const handleDeleteEmployee = (id) => {
    if (!window.confirm('Are you sure you want to delete this User?')) return;
    const emp = employees.find((e) => e.id === id);
    const updated = employees.filter((e) => e.id !== id);
    setData(STORAGE_KEYS.EMPLOYEES, updated);
    logAuditAction('Employee Deleted', 'User Master', id, emp);
  };

  const handleSetCurrentUser = (emp) => {
    setCurrentUser(emp);
    logAuditAction('Local User Switched', 'User Session', emp.id, { userName: emp.name });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-extrabold text-xs uppercase tracking-wider border border-rose-500/30">
            Master System
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2">User / Employee Master</h1>
          <p className="text-xs text-slate-400 mt-1">Manage user permissions, roles, and module access controls.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add User / Employee</span>
        </button>
      </div>

      {/* Active Local Session Card */}
      <div className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 p-5 rounded-2xl text-white shadow-md border border-indigo-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center font-extrabold text-indigo-300">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">Active User Testing Session</span>
            <h3 className="font-extrabold text-base">{currentUser?.name || 'Default Admin'}</h3>
            <p className="text-xs text-indigo-200">{currentUser?.designation} • {currentUser?.userGroup || 'Admin'}</p>
          </div>
        </div>
        <div className="text-xs text-indigo-200 bg-indigo-950/60 p-3 rounded-xl border border-indigo-800/40 max-w-sm">
          Allowed Modules: <strong>{currentUser?.allowedModules ? currentUser.allowedModules.length : 'All (Admin)'}</strong> module(s). Switch user below to test permission enforcement.
        </div>
      </div>

      {/* Employee List / Empty State */}
      {employees.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Users Added</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Create user accounts and assign module permissions to restrict system module access.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add User</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => {
            const isActiveUser = currentUser?.id === emp.id || currentUser?.code === emp.code;
            const empModules = emp.allowedModules || ALL_MODULE_IDS;

            return (
              <div
                key={emp.id}
                className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border transition-all shadow-xs space-y-3 relative ${
                  isActiveUser
                    ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{emp.code}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight flex items-center gap-1.5">
                      {emp.name}
                      {isActiveUser && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{emp.designation} • {emp.department}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button onClick={() => handleOpenModal(emp)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteEmployee(emp.id)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-500" /> <strong className="text-slate-700 dark:text-slate-300">Group: {emp.userGroup}</strong>
                  </p>
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-500" /> Permitted Modules ({empModules.length}):
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {SYSTEMS_CONFIG.map((sys) => {
                        const hasPerm = empModules.includes(sys.id);
                        return (
                          <span
                            key={sys.id}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              hasPerm
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'bg-slate-100 text-slate-400 line-through opacity-50'
                            }`}
                          >
                            {sys.shortName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500'}`}>
                    {emp.status}
                  </span>
                  <button
                    onClick={() => handleSetCurrentUser(emp)}
                    disabled={isActiveUser}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      isActiveUser
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    {isActiveUser ? 'Active Session' : 'Switch Session'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EMPLOYEE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
              {editingEmp ? 'Edit User / Employee' : 'Add User / Employee'}
            </h3>
            <form onSubmit={handleSaveEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">User Code *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">User Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="Designation"
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">User Group / Role</label>
                  <select
                    value={form.userGroup}
                    onChange={(e) => setForm({ ...form, userGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Sales User">Sales User</option>
                    <option value="QC User">QC User</option>
                    <option value="Dispatch User">Dispatch User</option>
                    <option value="Accounts User">Accounts User</option>
                  </select>
                </div>
              </div>

              {/* MODULE PERMISSION CHECKBOXES */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-500" /> Module Permissions (Access Control)
                </label>
                <p className="text-[11px] text-slate-400">Only permitted modules will appear in the System Switcher dropdown for this user.</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {SYSTEMS_CONFIG.map((sys) => {
                    const isChecked = (form.allowedModules || []).includes(sys.id);
                    return (
                      <label key={sys.id} className="flex items-center space-x-2 cursor-pointer p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleModulePermission(sys.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{sys.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
