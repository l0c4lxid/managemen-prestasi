import React from 'react';
import { Trophy, Users, Swords, Clock, CalendarDays, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const kpiCards = [
  {
    id: 'kpi-prestasi',
    label: 'Prestasi Terverifikasi',
    value: '2.847',
    change: '+127',
    changeLabel: 'bulan ini',
    trend: 'up',
    icon: <Trophy size={22} />,
    color: 'bg-indigo-600',
    bgLight: 'bg-indigo-50',
    textLight: 'text-indigo-600',
    span: 'lg:col-span-2',
    hero: true,
  },
  {
    id: 'kpi-mahasiswa',
    label: 'Mahasiswa Berprestasi',
    value: '1.293',
    change: '+34',
    changeLabel: 'bulan ini',
    trend: 'up',
    icon: <Users size={20} />,
    color: 'bg-cyan-600',
    bgLight: 'bg-cyan-50',
    textLight: 'text-cyan-600',
    span: '',
    hero: false,
  },
  {
    id: 'kpi-lomba',
    label: 'Lomba Aktif',
    value: '24',
    change: '+3',
    changeLabel: 'minggu ini',
    trend: 'up',
    icon: <Swords size={20} />,
    color: 'bg-emerald-600',
    bgLight: 'bg-emerald-50',
    textLight: 'text-emerald-600',
    span: '',
    hero: false,
  },
  {
    id: 'kpi-pending',
    label: 'Menunggu Verifikasi',
    value: '47',
    change: '+12',
    changeLabel: 'sejak kemarin',
    trend: 'down',
    alert: true,
    icon: <Clock size={20} />,
    color: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    textLight: 'text-amber-600',
    span: '',
    hero: false,
  },
  {
    id: 'kpi-event',
    label: 'Event Bulan Ini',
    value: '8',
    change: '3 aktif',
    changeLabel: 'sekarang',
    trend: 'neutral',
    icon: <CalendarDays size={20} />,
    color: 'bg-purple-600',
    bgLight: 'bg-purple-50',
    textLight: 'text-purple-600',
    span: '',
    hero: false,
  },
  {
    id: 'kpi-approval',
    label: 'Tingkat Persetujuan',
    value: '94.2%',
    change: '-1.3%',
    changeLabel: 'dari bulan lalu',
    trend: 'down',
    icon: <TrendingUp size={20} />,
    color: 'bg-slate-600',
    bgLight: 'bg-slate-50',
    textLight: 'text-slate-600',
    span: '',
    hero: false,
  },
];

export default function DashboardBento() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {kpiCards?.map((card) => (
        <div
          key={card?.id}
          className={`card p-5 flex flex-col gap-3 relative overflow-hidden
            ${card?.span}
            ${card?.alert ? 'border-amber-200 bg-amber-50/30' : ''}
            ${card?.hero ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-0' : ''}`}
        >
          {/* Alert indicator */}
          {card?.alert && (
            <div className="absolute top-3 right-3">
              <AlertTriangle size={16} className="text-amber-500" />
            </div>
          )}

          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
            ${card?.hero ? 'bg-white/20 text-white' : `${card?.bgLight} ${card?.textLight}`}`}>
            {card?.icon}
          </div>

          {/* Value */}
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-widest mb-1
              ${card?.hero ? 'text-indigo-200' : 'text-slate-500'}`}>
              {card?.label}
            </p>
            <p className={`tabular-nums font-extrabold
              ${card?.hero ? 'text-4xl text-white' : 'text-3xl text-slate-800'}`}>
              {card?.value}
            </p>
          </div>

          {/* Change */}
          <div className={`flex items-center gap-1.5 text-xs font-semibold
            ${card?.trend === 'up' ? (card?.hero ? 'text-indigo-200' : 'text-emerald-600') :
              card?.trend === 'down' ? (card?.hero ? 'text-red-300' : 'text-red-600') :
              (card?.hero ? 'text-indigo-200' : 'text-slate-500')}`}>
            {card?.trend === 'up' && <TrendingUp size={13} />}
            {card?.trend === 'down' && <TrendingDown size={13} />}
            <span>{card?.change}</span>
            <span className={`font-normal ${card?.hero ? 'text-indigo-300' : 'text-slate-400'}`}>
              {card?.changeLabel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}