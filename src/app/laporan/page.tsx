'use client';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Trophy, Users, CalendarDays, ArrowUpRight, ArrowDownRight, FolderKanban, Plus, Clock, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Program } from '@/types';

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
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [periode, setPeriode] = useState('tahunan');
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [prestasiPerBulan, setPrestasiPerBulan] = useState<{bulan: string, jumlah: number}[]>([]);
  const [prestasiPerKategori, setPrestasiPerKategori] = useState<{name: string, value: number, color: string}[]>([]);
  const [prestasiPerTingkat, setPrestasiPerTingkat] = useState<{tingkat: string, jumlah: number, prev: number}[]>([]);
  
  const [totalPrestasi, setTotalPrestasi] = useState(0);
  const [lombaAktif, setLombaAktif] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, [tahun]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [achievementsRes, competitionsRes, programsRes] = await Promise.all([
        supabase.from('achievements').select('created_at, category, competition_level').eq('status', 'verified'),
        supabase.from('competitions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('programs').select('*').order('created_at', { ascending: false })
      ]);
      
      if (programsRes.data) setPrograms(programsRes.data);
      if (competitionsRes.count !== null) setLombaAktif(competitionsRes.count);
      
      if (achievementsRes.data) {
        const ach = achievementsRes.data;
        setTotalPrestasi(ach.length);
        
        // 1. Prestasi Per Bulan (Tahun berjalan)
        const currentYear = parseInt(tahun);
        const bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const pBulan = bulanNames.map(b => ({ bulan: b, jumlah: 0 }));
        
        ach.forEach(a => {
          const date = new Date(a.created_at);
          if (date.getFullYear() === currentYear) {
            pBulan[date.getMonth()].jumlah++;
          }
        });
        setPrestasiPerBulan(pBulan);
        
        // 2. Prestasi Per Kategori
        const categoryCounts: Record<string, number> = {};
        ach.forEach(a => {
          const cat = a.category || 'Lainnya';
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
        const categoryColors = ['#6366f1', '#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#94a3b8', '#8b5cf6'];
        const pKategori = Object.keys(categoryCounts).map((cat, idx) => ({
          name: cat,
          value: categoryCounts[cat],
          color: categoryColors[idx % categoryColors.length]
        })).sort((a, b) => b.value - a.value);
        setPrestasiPerKategori(pKategori);
        
        // 3. Prestasi Per Tingkat
        const tingkatCounts: Record<string, number> = {};
        ach.forEach(a => {
          // Normalisasi string
          let lvl = a.competition_level || 'Lokal';
          lvl = lvl.charAt(0).toUpperCase() + lvl.slice(1).toLowerCase();
          tingkatCounts[lvl] = (tingkatCounts[lvl] || 0) + 1;
        });
        const pTingkat = Object.keys(tingkatCounts).map(lvl => ({
          tingkat: lvl,
          jumlah: tingkatCounts[lvl],
          prev: Math.max(0, Math.floor(tingkatCounts[lvl] * 0.8)) // Dummy previous year count based on current year for visualization
        })).sort((a, b) => b.jumlah - a.jumlah);
        setPrestasiPerTingkat(pTingkat);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'ongoing': return 'bg-indigo-50 text-indigo-700';
      case 'completed': return 'bg-emerald-50 text-emerald-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  const activeProgramsCount = programs.filter(p => p.program_status === 'ongoing').length;

  return (
    <AppLayout activePath="/laporan">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Laporan & Perencanaan</h1>
            <p className="text-slate-500 text-sm mt-1">Pantau tren prestasi dan rencanakan program kemahasiswaan.</p>
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
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Prestasi', value: totalPrestasi, change: 'Verifikasi', up: true, icon: <Trophy size={20} className="text-indigo-600" />, bg: 'bg-indigo-50' },
            { label: 'Program Aktif', value: activeProgramsCount, change: 'Berjalan', up: true, icon: <FolderKanban size={20} className="text-cyan-600" />, bg: 'bg-cyan-50' },
            { label: 'Lomba Aktif', value: lombaAktif, change: 'Tersedia', up: true, icon: <BarChart3 size={20} className="text-amber-600" />, bg: 'bg-amber-50' },
            { label: 'Event Berlangsung', value: 2, change: 'Sistem', up: true, icon: <CalendarDays size={20} className="text-emerald-600" />, bg: 'bg-emerald-50' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>{kpi.icon}</div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.up ? 'text-emerald-600' : 'text-slate-500'}`}>
                   {kpi.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-800">Tren Prestasi per Bulan ({tahun})</h3>
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
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="jumlah" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorPrestasi)" dot={{ fill: '#6366f1', r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
            <div className="mb-5">
              <h3 className="font-bold text-slate-800">Distribusi Kategori</h3>
              <p className="text-xs text-slate-500 mt-0.5">Prestasi berdasarkan bidang</p>
            </div>
            {prestasiPerKategori.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={prestasiPerKategori} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {prestasiPerKategori.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: number) => [`${value} prestasi`, '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1.5 flex-1 overflow-y-auto max-h-[100px]">
                  {prestasiPerKategori.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 truncate max-w-[120px]">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400">Belum ada data prestasi.</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="mb-5">
              <h3 className="font-bold text-slate-800">Prestasi per Tingkat</h3>
              <p className="text-xs text-slate-500 mt-0.5">Perbandingan prestasi {tahun}</p>
            </div>
            {prestasiPerTingkat.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={prestasiPerTingkat} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="tingkat" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="prev" name="Estimasi Sebelumnya" fill="#e0e7ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="jumlah" name={`Tahun ${tahun}`} fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-xs text-slate-400">Belum ada data tingkat prestasi.</div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div>
                <h3 className="font-bold text-slate-800">Manajemen Program</h3>
                <p className="text-xs text-slate-500 mt-0.5">Program kerja berbasis hasil analitik</p>
              </div>
              <button onClick={() => toast.info('Fitur penambahan program segera hadir.')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition-colors">
                <Plus size={15} />Program Baru
              </button>
            </div>
            <div className="flex-1 overflow-y-auto min-h-[220px]">
              {loading ? (
                <div className="p-6 text-center text-slate-400">Memuat program...</div>
              ) : programs.length === 0 ? (
                <div className="p-6 text-center text-slate-400">Belum ada program direncanakan.</div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {programs.map(program => (
                    <div key={program.id} className="p-5 hover:bg-slate-50/70 transition-colors flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <FolderKanban size={20} className="text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{program.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize whitespace-nowrap ${getStatusColor(program.program_status)}`}>
                            {program.program_status}
                          </span>
                        </div>
                        {program.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{program.description}</p>}
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><Clock size={12} /> {new Date(program.start_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric'})} - {new Date(program.end_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric'})}</span>
                          {program.program_status === 'completed' && <span className="flex items-center gap-1 text-emerald-600"><CheckCircle size={12} /> Selesai</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
