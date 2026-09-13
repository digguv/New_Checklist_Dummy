import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS, TASK_PRIORITY } from '../../config/constants';
import { INITIAL_USERS } from '../../services/mockData';
import { ArrowLeft, Send } from 'lucide-react';

export function CreateDelegationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState('dept-sales');
  const [assignedTo, setAssignedTo] = useState(INITIAL_USERS[3].id);
  const [priority, setPriority] = useState('High');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [reminders, setReminders] = useState({ system: true, email: true, whatsapp: false });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dueDate) {
      alert('Please select a due date for the delegation task.');
      return;
    }

    setLoading(true);
    try {
      const assignedUserObj = INITIAL_USERS.find((u) => u.id === assignedTo);
      const selectedDept = DEPARTMENTS.find((d) => d.id === departmentId);

      await taskService.createDelegation(
        {
          title,
          description,
          department_id: departmentId,
          department_name: selectedDept?.name || 'Sales & Marketing',
          assigned_to: assignedTo,
          assigned_to_name: assignedUserObj?.full_name || 'Priya Sharma',
          priority,
          start_date: startDate,
          due_date: dueDate,
          attachment_url: attachmentUrl,
          reminder_setting: reminders,
        },
        user
      );

      navigate('/my-tasks');
    } catch (err) {
      alert(err.message || 'Failed to create delegation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/my-tasks')}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Delegate One-Time Task
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Assign individual operational or ad-hoc tasks to team members with due dates
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Prepare Q3 Monthly Sales Performance Analysis Report"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Description & Deliverables</label>
          <textarea
            rows={4}
            placeholder="Specify clear requirements, expected deliverables, and guidelines..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department *</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assign To Employee *</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            >
              {INITIAL_USERS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.role} - {u.department_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority Level *</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            >
              {Object.values(TASK_PRIORITY).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date *</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Attachment File URL (Optional)</label>
          <input
            type="url"
            placeholder="https://example.com/spec.pdf"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Reminders Toggle */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Notification & Reminder Channels</p>
          <div className="flex items-center space-x-6 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={reminders.system}
                onChange={(e) => setReminders((prev) => ({ ...prev, system: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">In-App System Bell</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={reminders.email}
                onChange={(e) => setReminders((prev) => ({ ...prev, email: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Email Alert</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={reminders.whatsapp}
                onChange={(e) => setReminders((prev) => ({ ...prev, whatsapp: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">WhatsApp Alert (Cloud API)</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/my-tasks')}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center space-x-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Delegating...' : 'Assign Delegation Task'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
