import React from 'react';
import { Users, Mail, Phone, Building2, UserPlus } from 'lucide-react';

export function EmployeeDirectoryPage() {
  const employees = [
    { empId: 'EMP-001', name: 'Amitabh Sharma', designation: 'Senior Software Engineer', dept: 'Engineering', email: 'amitabh@company.com', phone: '+91 98200 99881' },
    { empId: 'EMP-002', name: 'Neha Kapoor', designation: 'Senior Accountant', dept: 'Finance', email: 'neha@company.com', phone: '+91 97110 22334' },
    { empId: 'EMP-003', name: 'Rajesh Verma', designation: 'Sales Manager - West', dept: 'Sales', email: 'rajesh@company.com', phone: '+91 94220 55667' },
    { empId: 'EMP-004', name: 'Pooja Nair', designation: 'HR Executive', dept: 'Human Resources', email: 'pooja@company.com', phone: '+91 98980 44556' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-500" />
            <span>Employee Directory & Staff Profiles</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Full roster of company employees, contact details & designations.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/30 transition-all">
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {employees.map((emp) => (
          <div key={emp.empId} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-2 py-0.5 rounded">
                {emp.empId}
              </span>
              <span className="text-[10px] font-bold text-slate-400">{emp.dept}</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{emp.name}</h3>
              <p className="text-xs text-slate-500">{emp.designation}</p>
            </div>
            <div className="text-xs space-y-1 text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {emp.email}</p>
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {emp.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
