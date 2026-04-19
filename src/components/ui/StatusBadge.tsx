import React from 'react';
import { CheckCircle, Clock, XCircle, FileText, Wifi, Archive, Calendar } from 'lucide-react';

type StatusType = 'verified' | 'pending' | 'rejected' | 'draft' | 'active' | 'closed' | 'archived' | 'upcoming' | 'ongoing' | 'done';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const statusConfig: Record<StatusType, { label: string; className: string; icon: React.ReactNode }> = {
  verified: { label: 'Terverifikasi', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100', icon: <CheckCircle size={12} /> },
  pending: { label: 'Menunggu', className: 'bg-amber-50 text-amber-700 border border-amber-100', icon: <Clock size={12} /> },
  rejected: { label: 'Ditolak', className: 'bg-red-50 text-red-700 border border-red-100', icon: <XCircle size={12} /> },
  draft: { label: 'Draf', className: 'bg-slate-50 text-slate-600 border border-slate-200', icon: <FileText size={12} /> },
  active: { label: 'Aktif', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100', icon: <Wifi size={12} /> },
  closed: { label: 'Tutup', className: 'bg-orange-50 text-orange-700 border border-orange-100', icon: <Clock size={12} /> },
  archived: { label: 'Diarsipkan', className: 'bg-slate-50 text-slate-500 border border-slate-200', icon: <Archive size={12} /> },
  upcoming: { label: 'Akan Datang', className: 'bg-blue-50 text-blue-700 border border-blue-100', icon: <Calendar size={12} /> },
  ongoing: { label: 'Berlangsung', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100', icon: <Wifi size={12} /> },
  done: { label: 'Selesai', className: 'bg-slate-50 text-slate-600 border border-slate-200', icon: <CheckCircle size={12} /> },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClass} ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}