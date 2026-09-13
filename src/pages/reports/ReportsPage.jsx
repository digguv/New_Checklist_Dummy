import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { exportService } from '../../services/exportService';
import { formatDate } from '../../lib/utils';
import { FileSpreadsheet, FileText, Printer, BarChart3, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function ReportsPage() {
  const [activeReportTab, setActiveReportTab] = useState('Employee'); // Employee, Department, TAT, Checklist, Delegation
  const [empReport, setEmpReport] = useState([]);
  const [deptReport, setDeptReport] = useState([]);
  const [tatReport, setTatReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const emp = await reportService.getEmployeePerformanceReport();
      const dept = await reportService.getDepartmentReport();
      const tat = await reportService.getTatReport();

      setEmpReport(emp);
      setDeptReport(dept);
      setTatReport(tat);
    } catch (err) {
      console.error('Failed to load MIS reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (activeReportTab === 'Employee') exportService.exportToCSV(empReport, 'Employee_Performance_Report.csv');
    else if (activeReportTab === 'Department') exportService.exportToCSV(deptReport, 'Department_Performance_Report.csv');
    else if (activeReportTab === 'TAT') exportService.exportToCSV(tatReport, 'Turnaround_Time_TAT_Report.csv');
  };

  const handleExportExcel = () => {
    if (activeReportTab === 'Employee') exportService.exportToExcel(empReport, 'Employee_Performance_Report.xlsx');
    else if (activeReportTab === 'Department') exportService.exportToExcel(deptReport, 'Department_Performance_Report.xlsx');
    else if (activeReportTab === 'TAT') exportService.exportToExcel(tatReport, 'Turnaround_Time_TAT_Report.xlsx');
  };

  const handlePrint = () => {
    exportService.printReport('report-print-area', `${activeReportTab} Performance Report`);
  };

  const reportTabs = ['Employee', 'Department', 'TAT', 'Checklist', 'Delegation'];

  return (
    <div className="space-y-6">
      {/* Top Header & Export Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            MIS Reports & Executive Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Turnaround time (TAT) efficiency, employee performance scores, and department audits
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {reportTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveReportTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeReportTab === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab} Report
          </button>
        ))}
      </div>

      {/* Visual Chart Overview */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          {activeReportTab} Performance Visual Analytics
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeReportTab === 'Department' ? deptReport : empReport}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey={activeReportTab === 'Department' ? 'department' : 'name'} stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="totalTasks" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Total Tasks" />
              <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} name="Completed" />
              <Bar dataKey="overdue" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Overdue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Printable Report Data Table */}
      <div
        id="report-print-area"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden"
      >
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Generating report...</div>
        ) : activeReportTab === 'Employee' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3.5">Emp ID</th>
                  <th className="px-4 py-3.5">Employee Name</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5 text-center">Total</th>
                  <th className="px-4 py-3.5 text-center text-emerald-600">Completed</th>
                  <th className="px-4 py-3.5 text-center text-amber-600">Pending</th>
                  <th className="px-4 py-3.5 text-center text-rose-600">Overdue</th>
                  <th className="px-4 py-3.5 text-center">Completion %</th>
                  <th className="px-4 py-3.5 text-center">On-Time %</th>
                  <th className="px-4 py-3.5 text-right font-extrabold text-indigo-600">Overall Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {empReport.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono text-slate-500 font-semibold">{row.employee_id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{row.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.department}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-800 dark:text-slate-200">{row.totalTasks}</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-600">{row.completed}</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-600">{row.pending}</td>
                    <td className="px-4 py-3 text-center font-bold text-rose-600">{row.overdue}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">{row.completionRate}%</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600">{row.onTimeRate}%</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold rounded-lg border border-indigo-200 dark:border-indigo-800">
                        {row.overallScore} pts
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeReportTab === 'Department' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5 text-center">Total Tasks</th>
                  <th className="px-4 py-3.5 text-center text-emerald-600">Completed</th>
                  <th className="px-4 py-3.5 text-center text-amber-600">Pending</th>
                  <th className="px-4 py-3.5 text-center text-rose-600">Overdue</th>
                  <th className="px-4 py-3.5 text-right font-extrabold">Completion %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {deptReport.map((row) => (
                  <tr key={row.department} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{row.department}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-800 dark:text-slate-200">{row.totalTasks}</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-600">{row.completed}</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-600">{row.pending}</td>
                    <td className="px-4 py-3 text-center font-bold text-rose-600">{row.overdue}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-indigo-600">{row.completionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3.5">Task Code</th>
                  <th className="px-4 py-3.5">Task Title</th>
                  <th className="px-4 py-3.5">Assigned To</th>
                  <th className="px-4 py-3.5">Due Date</th>
                  <th className="px-4 py-3.5">Completed Date</th>
                  <th className="px-4 py-3.5 text-center">TAT (Days)</th>
                  <th className="px-4 py-3.5 text-center">Delay (Days)</th>
                  <th className="px-4 py-3.5 text-right">TAT Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {tatReport.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.task_code}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">{row.title}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.assignedTo}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(row.due_date)}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(row.completion_date)}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-800 dark:text-slate-200">{row.tatDays}d</td>
                    <td className="px-4 py-3 text-center font-bold text-rose-600">{row.delayDays}d</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.tatStatus === 'On Time'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {row.tatStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
