import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid, differenceInDays } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr, formatPattern = 'dd MMM yyyy') {
  if (!dateStr) return 'N/A';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    if (!isValid(date)) return 'N/A';
    return format(date, formatPattern);
  } catch (e) {
    return 'N/A';
  }
}

export function formatDateTime(dateStr) {
  return formatDate(dateStr, 'dd MMM yyyy, hh:mm a');
}

export function getStatusBadgeStyle(status) {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'In Progress':
      return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    case 'Pending':
      return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'Overdue':
      return 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse';
    case 'Not Done':
      return 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
    case 'Cancelled':
      return 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400 border-gray-200 dark:border-zinc-700';
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200';
  }
}

export function getPriorityBadgeStyle(priority) {
  switch (priority) {
    case 'Critical':
      return 'bg-rose-600 text-white shadow-sm';
    case 'High':
      return 'bg-orange-500 text-white shadow-sm';
    case 'Medium':
      return 'bg-amber-500 text-white shadow-sm';
    case 'Low':
      return 'bg-slate-500 text-white shadow-sm';
    default:
      return 'bg-slate-500 text-white';
  }
}

export function calculateTAT(assignedDate, dueDate, completedDate) {
  if (!assignedDate || !dueDate) return { tatDays: 0, delayDays: 0, status: 'On Time' };
  
  const end = completedDate ? new Date(completedDate) : new Date();
  const due = new Date(dueDate);
  const start = new Date(assignedDate);
  
  const totalDays = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const delayDays = Math.max(0, Math.ceil((end - due) / (1000 * 60 * 60 * 24)));
  
  return {
    tatDays: totalDays,
    delayDays,
    status: delayDays > 0 ? 'Delayed' : 'On Time'
  };
}

export function calculatePerformanceScore({ completedOnTime, completedLate, overdueCount, totalTasks }) {
  if (!totalTasks || totalTasks === 0) return 100;
  // On time = 100 points each, Late = 60 points each, Overdue = 0 points
  const rawScore = ((completedOnTime * 100) + (completedLate * 60)) / totalTasks;
  return Math.min(100, Math.max(0, Math.round(rawScore)));
}
