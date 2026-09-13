import React from 'react';
import { getStatusBadgeStyle, getPriorityBadgeStyle } from '../../lib/utils';

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {status || 'Pending'}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadgeStyle(
        priority
      )}`}
    >
      {priority || 'Medium'}
    </span>
  );
}
