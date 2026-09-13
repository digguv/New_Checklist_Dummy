import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { PriorityBadge } from '../../components/common/StatusBadge';
import { ListTodo, Plus, Calendar, CheckCircle2, User } from 'lucide-react';

export function ChecklistListPage() {
  const { isAdmin, isManager } = useAuth();
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    setLoading(true);
    try {
      const data = await taskService.getChecklists();
      setChecklists(data);
    } catch (err) {
      console.error('Failed to load checklists:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Checklist Masters & Recurrence Templates
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage recurring workflow checklists and automatic task generation
          </p>
        </div>

        {(isAdmin || isManager) && (
          <Link
            to="/checklist/create"
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Checklist</span>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading checklists...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {checklists.map((chk) => (
            <div
              key={chk.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {chk.checklist_code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">{chk.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{chk.description}</p>
                </div>
                <PriorityBadge priority={chk.priority} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Frequency</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{chk.frequency}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned To</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{chk.assigned_to_name}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Verification Steps ({chk.items?.length || 0})
                </p>
                <ul className="space-y-1">
                  {chk.items?.map((item) => (
                    <li key={item.id} className="text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{item.item_title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
