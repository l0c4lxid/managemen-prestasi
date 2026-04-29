import React from 'react';
import { Trophy } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5 text-indigo-400 border border-indigo-100 shadow-inner">
        {icon ?? <Trophy size={28} />}
      </div>
      <h3 className="text-base font-bold text-slate-700 mb-2 uppercase tracking-wider">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6 font-medium">{description}</p>
      {action}
    </div>
  );
}