import React from 'react';
import { Trophy, UserPlus, CheckCircle, XCircle, Swords, CalendarDays } from 'lucide-react';

const activities = [
  { id: 'act-001', type: 'verified', text: 'Prestasi Aninda Putri diverifikasi', sub: 'PKM-K Nasional', time: '5 menit lalu', icon: <CheckCircle size={14} />, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'act-002', type: 'new_user', text: 'Mahasiswa baru terdaftar', sub: 'Bagas Suryo — Hukum 2022', time: '23 menit lalu', icon: <UserPlus size={14} />, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'act-003', type: 'new_prestasi', text: 'Submisi prestasi baru', sub: 'Hendra Wijaksana — Robotics', time: '1 jam lalu', icon: <Trophy size={14} />, color: 'bg-amber-100 text-amber-600' },
  { id: 'act-004', type: 'rejected', text: 'Prestasi ditolak', sub: 'Dokumen sertifikat tidak valid', time: '2 jam lalu', icon: <XCircle size={14} />, color: 'bg-red-100 text-red-600' },
  { id: 'act-005', type: 'new_lomba', text: 'Lomba baru ditambahkan', sub: 'Medical Olympiad 2026', time: '3 jam lalu', icon: <Swords size={14} />, color: 'bg-cyan-100 text-cyan-600' },
  { id: 'act-006', type: 'new_event', text: 'Event baru dijadwalkan', sub: 'Workshop PKM — 26 Apr', time: '5 jam lalu', icon: <CalendarDays size={14} />, color: 'bg-purple-100 text-purple-600' },
  { id: 'act-007', type: 'verified', text: 'Prestasi Renata Kusuma diverifikasi', sub: 'Olimpiade Akuntansi', time: '6 jam lalu', icon: <CheckCircle size={14} />, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'act-008', type: 'new_prestasi', text: 'Submisi prestasi baru', sub: 'Nabilah Azzahra — Debat', time: '8 jam lalu', icon: <Trophy size={14} />, color: 'bg-amber-100 text-amber-600' },
];

export default function RecentActivity() {
  return (
    <div className="card overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-800">Aktivitas Terbaru</h3>
        <p className="text-xs text-slate-500 mt-0.5">Perubahan real-time di platform</p>
      </div>
      <div className="divide-y divide-slate-50 overflow-y-auto max-h-[420px] scrollbar-thin">
        {activities?.map((act) => (
          <div key={act?.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${act?.color}`}>
              {act?.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 leading-snug">{act?.text}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{act?.sub}</p>
            </div>
            <p className="text-[10px] text-slate-400 font-medium flex-shrink-0 mt-0.5">{act?.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}