'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area,  } from 'recharts';
import { BarChart3, Download, FileText, TrendingUp, Trophy, Users, CalendarDays, ArrowUpRight, ArrowDownRight,  } from 'lucide-react';

const prestasiPerBulan = [
  { bulan: 'Jan', jumlah: 8 }, { bulan: 'Feb', jumlah: 12 }, { bulan: 'Mar', jumlah: 15 },
  { bulan: 'Apr', jumlah: 10 }, { bulan: 'Mei', jumlah: 18 }, { bulan: 'Jun', jumlah: 22 },
  { bulan: 'Jul', jumlah: 14 }, { bulan: 'Agu', jumlah: 9 }, { bulan: 'Sep', jumlah: 17 },
  { bulan: 'Okt', jumlah: 21 }, { bulan: 'Nov', jumlah: 25 }, { bulan: 'Des', jumlah: 19 },
];

const prestasiPerKategori = [
  { name: 'Akademik', value: 42, color: '#6366f1' },
  { name: 'Teknologi', value: 28, color: '#06b6d4' },
  { name: 'Kewirausahaan', value: 19, color: '#f59e0b' },
  { name: 'Seni & Budaya', value: 15, color: '#ec4899' },
  { name: 'Olahraga', value: 11, color: '#10b981' },
  { name: 'Lainnya', value: 8, color: '#94a3b8' },
];

const prestasiPerTingkat = [
  { tingkat: 'Internasional', jumlah: 14, prev: 10 },
  { tingkat: 'Nasional', jumlah: 58, prev: 49 },
  { tingkat: 'Regional', jumlah: 33, prev: 38 },
  { tingkat: 'Lokal', jumlah: 18, prev: 15 },
];

const topFakultas = [
  { fakultas: 'Teknik', prestasi: 38 },
  { fakultas: 'Kedokteran', prestasi: 29 },
  { fakultas: 'Ekonomi', prestasi: 24 },
  { fakultas: 'MIPA', prestasi: 21 },
  { fakultas: 'Hukum', prestasi: 15 },
  { fakultas: 'Psikologi', prestasi: 12 },
  { fakultas: 'Farmasi', prestasi: 10 },
  { fakultas: 'Sastra', prestasi: 8 },
];

const recentReports = [
  { id: 'r-001', judul: 'Laporan Prestasi Semester Genap 2025/2026', tanggal: '15 Apr 2026', tipe: 'PDF', ukuran: '2.4 MB' },
  { id: 'r-002', judul: 'Rekap Lomba Aktif Q1 2026', tanggal: '1 Apr 2026', tipe: 'Excel', ukuran: '1.1 MB' },
  { id: 'r-003', judul: 'Statistik Mahasiswa Berprestasi 2025', tanggal: '20 Mar 2026', tipe: 'PDF', ukuran: '3.8 MB' },
  { id: 'r-004', judul: 'Laporan Event Kemahasiswaan Maret 2026', tanggal: '5 Mar 2026', tipe: 'PDF', ukuran: '1.7 MB' },
  { id: 'r-005', judul: 'Data Verifikasi Prestasi Februari 2026', tanggal: '28 Feb 2026', tipe: 'Excel', ukuran: '0.9 MB' },
];

const COLORS = prestasiPerKategori.map(d => d.color);

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2">
        <p className="text-xs font-semibold text-slate-700">{label}</p>
        <p className="text-sm font-bold text-indigo-600">{payload[0].value} prestasi</p>
      </div>
    );
  }
  return null;
};

export default function LaporanPage() {
  const [tahun, setTahun] = useState('2026');
  const [periode, setPeriode] = useState('tahunan');

  const totalPrestasi = prestasiPerBulan.reduce((s, d) => s + d.jumlah, 0);

  return (
    <AppLayout activePath="/laporan">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Laporan & Statistik</h1>
            <p className="text-slate-500 text-sm mt-1">Ringkasan data prestasi, lomba, dan aktivitas kemahasiswaan.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={tahun} onChange={e => setTahun(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <select value={periode} onChange={e => setPeriode(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
              <option value="tahunan">Tahunan</option>
              <option value="semester">Per Semester</option>
              <option value="bulanan">Bulanan</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
              <Download size={16} />Ekspor Laporan
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Prestasi', value: totalPrestasi, change: '+18%', up: true, icon: <Trophy size={20} className="text-indigo-600" />, bg: 'bg-indigo-50' },
            { label: 'Mahasiswa Aktif', value: 1247, change: '+5%', up: true, icon: <Users size={20} className="text-cyan-600" />, bg: 'bg-cyan-50' },
            { label: 'Lomba Aktif', value: 24, change: '+3', up: true, icon: <BarChart3 size={20} className="text-amber-600" />, bg: 'bg-amber-50' },
            { label: 'Event Berlangsung', value: 8, change: '-2', up: false, icon: <CalendarDays size={20} className="text-emerald-600" />, bg: 'bg-emerald-50' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>{kpi.icon}</div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Trend prestasi per bulan */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-800">Tren Prestasi per Bulan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Jumlah prestasi yang diverifikasi tiap bulan</p>
              </div>
              <TrendingUp size={18} className="text-indigo-400" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={prestasiPerBulan} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorPrestasi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="jumlah" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorPrestasi)" dot={{ fill: '#6366f1', r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart kategori */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="mb-5">
              <h3 className="font-bold text-slate-800">Distribusi Kategori</h3>
              <p className="text-xs text-slate-500 mt-0.5">Prestasi berdasarkan bidang</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={prestasiPerKategori} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {prestasiPerKategori.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} prestasi`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-1.5">
              {prestasiPerKategori.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Prestasi per tingkat */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="mb-5">
              <h3 className="font-bold text-slate-800">Prestasi per Tingkat</h3>
              <p className="text-xs text-slate-500 mt-0.5">Perbandingan tahun ini vs tahun lalu</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={prestasiPerTingkat} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="tingkat" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="prev" name="Tahun Lalu" fill="#e0e7ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="jumlah" name="Tahun Ini" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top fakultas */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="mb-5">
              <h3 className="font-bold text-slate-800">Top Fakultas Berprestasi</h3>
              <p className="text-xs text-slate-500 mt-0.5">Jumlah prestasi per fakultas</p>
            </div>
            <div className="space-y-3">
              {topFakultas.map((item, idx) => {
                const max = topFakultas[0].prestasi;
                const pct = Math.round((item.prestasi / max) * 100);
                return (
                  <div key={item.fakultas} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-slate-400 text-right flex-shrink-0">{idx + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{item.fakultas}</span>
                        <span className="text-xs font-bold text-indigo-600">{item.prestasi}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent reports */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Laporan Tersimpan</h3>
              <p className="text-xs text-slate-500 mt-0.5">Laporan yang telah digenerate sebelumnya</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <FileText size={15} />Generate Baru
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentReports.map(report => (
              <div key={report.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${report.tipe === 'PDF' ? 'bg-red-50' : 'bg-emerald-50'}`}>
                  <FileText size={18} className={report.tipe === 'PDF' ? 'text-red-500' : 'text-emerald-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{report.judul}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{report.tanggal} · {report.ukuran}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${report.tipe === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{report.tipe}</span>
                <button className="p-2 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0" title="Unduh">
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
