'use client';
import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, defs, linearGradient, stop,
} from 'recharts';

const prestasiTrend = [
  { bulan: 'Nov\'25', diverifikasi: 89, ditolak: 8, draf: 12 },
  { bulan: 'Des \'25', diverifikasi: 134, ditolak: 11, draf: 18 },
  { bulan: 'Jan \'26', diverifikasi: 98, ditolak: 6, draf: 9 },
  { bulan: 'Feb \'26', diverifikasi: 156, ditolak: 14, draf: 22 },
  { bulan: 'Mar \'26', diverifikasi: 187, ditolak: 9, draf: 15 },
  { bulan: 'Apr \'26', diverifikasi: 127, ditolak: 7, draf: 11 },
];

const kategoriData = [
  { kategori: 'Teknologi', count: 412 },
  { kategori: 'Akademik', count: 387 },
  { kategori: 'Kewirausahaan', count: 298 },
  { kategori: 'Sains', count: 234 },
  { kategori: 'Seni & Budaya', count: 189 },
  { kategori: 'Olahraga', count: 143 },
];

const CustomTooltipArea = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-soft p-3 text-xs">
      <p className="font-bold text-slate-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={`tip-${p.name}`} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-slate-600">{p.name}:</span>
          <span className="font-bold text-slate-800 tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const CustomTooltipBar = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-soft p-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      <p className="text-indigo-700 font-bold tabular-nums">{payload[0]?.value} prestasi</p>
    </div>
  );
};

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Prestasi trend — spans 2 cols */}
      <div className="xl:col-span-2 card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Tren Submisi Prestasi</h3>
            <p className="text-xs text-slate-500 mt-0.5">6 bulan terakhir — diverifikasi, ditolak, draf</p>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Nov 2025 – Apr 2026</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={prestasiTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradVerified" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradDraft" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltipArea />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
              formatter={(value) => <span className="text-slate-600 font-medium">{value}</span>}
            />
            <Area type="monotone" dataKey="diverifikasi" name="Diverifikasi" stroke="#4F46E5" strokeWidth={2} fill="url(#gradVerified)" dot={false} activeDot={{ r: 4 }} />
            <Area type="monotone" dataKey="draf" name="Draf" stroke="#06B6D4" strokeWidth={2} fill="url(#gradDraft)" dot={false} activeDot={{ r: 4 }} />
            <Area type="monotone" dataKey="ditolak" name="Ditolak" stroke="#f87171" strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 2" activeDot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Prestasi by kategori */}
      <div className="card p-6">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-800">Prestasi per Kategori</h3>
          <p className="text-xs text-slate-500 mt-0.5">Total terverifikasi</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={kategoriData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="kategori" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={90} />
            <Tooltip content={<CustomTooltipBar />} />
            <Bar dataKey="count" name="Prestasi" fill="#4F46E5" radius={[0, 6, 6, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}