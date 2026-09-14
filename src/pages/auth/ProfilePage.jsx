import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_USERS } from '../../services/mockData';
import { leaveService } from '../../services/leaveService';
import { User, Mail, Save, CheckCircle2, Calendar, Plane, Send, AlertCircle, Clock, UserCheck, Camera, Upload } from 'lucide-react';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [savedMessage, setSavedMessage] = useState('');
  const fileInputRef = useRef(null);

  // Leave Form States
  const [reason, setReason] = useState('');
  const [leaveDays, setLeaveDays] = useState('1 Day');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [wantTransfer, setWantTransfer] = useState(true);
  const [preferredSubstituteId, setPreferredSubstituteId] = useState('');
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [leaveError, setLeaveError] = useState('');
  const [leaveSuccess, setLeaveSuccess] = useState('');

  // Leave History
  const [myLeaves, setMyLeaves] = useState([]);

  useEffect(() => {
    if (user?.id) {
      setFullName(user.full_name || '');
      setMobile(user.mobile || '');
      setAvatarUrl(user.avatar_url || '');
      loadMyLeaves();
      const fallback = INITIAL_USERS.find((u) => u.id !== user.id);
      if (fallback) setPreferredSubstituteId(fallback.id);
    }
  }, [user]);

  const loadMyLeaves = async () => {
    try {
      const data = await leaveService.getLeaveRequests({ userId: user.id });
      setMyLeaves(data);
    } catch (err) {
      console.error('Failed to load leave history:', err);
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile({ full_name: fullName, mobile, avatar_url: avatarUrl });
    setSavedMessage('Profile & picture updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setLeaveError('');
    setLeaveSuccess('');

    if (!reason.trim()) {
      setLeaveError('Please enter reason for leaving.');
      return;
    }
    if (!startDate || !endDate) {
      setLeaveError('Please select both Start Date and End Date.');
      return;
    }

    if (wantTransfer && !preferredSubstituteId) {
      setLeaveError('Please select an employee to transfer your tasks to.');
      return;
    }

    setLeaveSubmitting(true);
    try {
      await leaveService.createLeaveRequest(
        {
          reason,
          leave_days: leaveDays,
          start_date: startDate,
          end_date: endDate,
          want_transfer: wantTransfer,
          preferred_substitute_id: preferredSubstituteId,
        },
        user
      );

      setLeaveSuccess('Leave request submitted successfully! Awaiting Admin Approval.');
      setReason('');
      setLeaveDays('1 Day');
      loadMyLeaves();
      setTimeout(() => setLeaveSuccess(''), 4000);
    } catch (err) {
      setLeaveError(err.message || 'Failed to submit leave request.');
    } finally {
      setLeaveSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">User Profile & Leave Portal</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your account profile, submit leave requests, and set task transfer preferences
        </p>
      </div>

      {/* Grid: Profile Card & Leave Request Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: User Profile Details */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-5 h-fit">
          <div className="text-center space-y-3">
            {/* Interactive Avatar with Upload Camera Overlay */}
            <div className="relative w-24 h-24 mx-auto group">
              <img
                src={avatarUrl || user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.full_name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md transition-all group-hover:opacity-90"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-transform hover:scale-110"
                title="Change Profile Picture"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{user?.full_name}</h2>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{user?.designation || user?.role}</p>
              <span className="text-[10px] font-mono text-slate-400 block mt-1">{user?.employee_id} • {user?.department_name}</span>
            </div>
          </div>

          {savedMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{savedMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Profile Image URL (Or Upload Above)</label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                />
                <Upload
                  className="w-3.5 h-3.5 absolute right-2.5 top-3 text-slate-400 cursor-pointer hover:text-indigo-600"
                  onClick={() => fileInputRef.current?.click()}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Email</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </form>
        </div>

        {/* Right: Leave Request Form (Requirement #1) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Submit Leave Request</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Request leave and optionally nominate a substitute employee for task transfer
                </p>
              </div>
            </div>

            {leaveError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2 border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{leaveError}</span>
              </div>
            )}

            {leaveSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{leaveSuccess}</span>
              </div>
            )}

            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              {/* Prefilled Auto User Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  User Name (Auto-Prefilled)
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.full_name || ''}
                  className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 rounded-xl cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason of Leaving *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter detailed reason for leave (e.g., Family Function, Sick Leave, Urgent Work)..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Day of Leave *</label>
                  <select
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white font-semibold"
                  >
                    <option value="Half Day">Half Day</option>
                    <option value="1 Day">1 Day</option>
                    <option value="2 Days">2 Days</option>
                    <option value="3 Days">3 Days</option>
                    <option value="4+ Days">4+ Days (Long Leave)</option>
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white font-semibold"
                  />
                </div>
              </div>

              {/* Requirement #1 Prompt: Task Transfer Preference */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="block text-xs font-extrabold text-slate-900 dark:text-white">
                  Kya aap apna task kisi user ko transfer karna chahte hain? *
                </label>
                <div className="flex items-center space-x-6 text-xs font-semibold">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="wantTransfer"
                      checked={wantTransfer === true}
                      onChange={() => setWantTransfer(true)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-slate-800 dark:text-slate-200">Yes, Transfer My Tasks</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="wantTransfer"
                      checked={wantTransfer === false}
                      onChange={() => setWantTransfer(false)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-slate-600 dark:text-slate-400">No, Keep Tasks Pending</span>
                  </label>
                </div>

                {wantTransfer && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Select Preferred Substitute Employee *
                    </label>
                    <select
                      value={preferredSubstituteId}
                      onChange={(e) => setPreferredSubstituteId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white font-bold"
                    >
                      {INITIAL_USERS.filter((u) => u.id !== user?.id).map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.full_name} ({u.role} - {u.department_name})
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block mt-1">
                      Note: Admin can verify or modify this substitute selection during approval.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={leaveSubmitting}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{leaveSubmitting ? 'Submitting Request...' : 'Submit Leave Request'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* User's Submitted Leave Requests History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>My Leave Request History</span>
            </h3>

            {myLeaves.length === 0 ? (
              <p className="text-xs text-slate-400">No past leave requests submitted yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {myLeaves.map((l) => (
                  <div key={l.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 dark:text-white">{l.leave_days}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 dark:text-slate-300 font-mono">
                          {l.start_date} to {l.end_date}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">{l.reason}</p>
                      {l.want_transfer && l.preferred_substitute_name && (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded font-semibold">
                          <UserCheck className="w-3 h-3" />
                          <span>Substitute: {l.final_substitute_name || l.preferred_substitute_name}</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          l.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : l.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {l.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
