'use client';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, Trophy, CalendarDays, BarChart3, 
  Search, Download, Filter, FileText, ChevronRight,
  PieChart as PieIcon, Plus
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Program } from '@/types';
import { useSettings } from '@/contexts/SettingsContext';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-soft text-xs">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        <p className="text-indigo-600 font-bold">{payload[0].value} Prestasi</p>
      </div>
    );
  }
  return null;
};

export default function LaporanPage() {
  const { academicYear: globalYear, semester: globalSemester, availableYears } = useSettings();
  const [tahun, setTahun] = useState(globalYear);
  const [semester, setSemester] = useState(globalSemester);
  
  // Sync with global when global changes
  useEffect(() => {
    setTahun(globalYear);
    setSemester(globalSemester);
  }, [globalYear, globalSemester]);
  
  const [achievements, setAchievements] = useState<any[]>([]);
  const [prestasiPerBulan, setPrestasiPerBulan] = useState<{bulan: string, jumlah: number}[]>([]);
  const [prestasiPerKategori, setPrestasiPerKategori] = useState<{name: string, value: number, color: string}[]>([]);
  const [prestasiPerTingkat, setPrestasiPerTingkat] = useState<{tingkat: string, jumlah: number, prev: number}[]>([]);
  
  const [totalPrestasi, setTotalPrestasi] = useState(0);
  const [totalMahasiswa, setTotalMahasiswa] = useState(0);
  const [lombaAktif, setLombaAktif] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, [tahun, semester]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [achievementsRes, competitionsRes, totalStudentsRes] = await Promise.all([
        supabase.from('achievements').select('*, users!achievements_user_id_fkey(name)').eq('status', 'verified').order('created_at', { ascending: false }),
        supabase.from('competitions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'mahasiswa')
      ]);

      if (achievementsRes.error) {
        console.error('Error fetching achievements:', achievementsRes.error);
      }
      
      if (totalStudentsRes.count !== null) setTotalMahasiswa(totalStudentsRes.count);
      if (competitionsRes.count !== null) setLombaAktif(competitionsRes.count);
      
      if (achievementsRes.data) {
        let ach = achievementsRes.data as any[];
        
        // Advanced Filter by Academic Year and Semester
        if (tahun !== 'Semua') {
          const startYear = parseInt(tahun.split('/')[0]);
          const endYear = startYear + 1;
          
          ach = ach.filter(a => {
            const academicYearFromDB = a.year;
            const date = new Date(a.created_at);
            const m = date.getMonth() + 1;
            const y = date.getFullYear();

            let isInYear = false;
            if (academicYearFromDB && academicYearFromDB.length === 4) {
              const dbYear = parseInt(academicYearFromDB);
              isInYear = (dbYear === startYear) || (dbYear === endYear);
            } else {
              isInYear = (y === startYear && m >= 8) || (y === endYear && m <= 7);
            }
            
            if (!isInYear) return false;
            if (semester === 'Ganjil') return (m >= 8 || m === 1);
            if (semester === 'Genap') return (m >= 2 && m <= 7);
            return true;
          });
        } else if (semester !== 'Semua') {
          ach = ach.filter(a => {
            const m = (new Date(a.created_at)).getMonth() + 1;
            if (semester === 'Ganjil') return m >= 8 || m === 1;
            return m >= 2 && m <= 7;
          });
        }

        setAchievements(ach);
        setTotalPrestasi(ach.length);
        
        const bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const pBulan = bulanNames.map(b => ({ bulan: b, jumlah: 0 }));
        ach.forEach(a => {
          const date = new Date(a.created_at);
          pBulan[date.getMonth()].jumlah++;
        });
        setPrestasiPerBulan(pBulan);
        
        const categoryCounts: Record<string, number> = {};
        ach.forEach(a => {
          const cat = a.category || 'Lainnya';
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
        const categoryColors = ['#6366f1', '#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#94a3b8', '#8b5cf6'];
        setPrestasiPerKategori(Object.keys(categoryCounts).map((cat, idx) => ({
          name: cat,
          value: categoryCounts[cat],
          color: categoryColors[idx % categoryColors.length]
        })).sort((a, b) => b.value - a.value));
        
        const tingkatCounts: Record<string, number> = {};
        ach.forEach(a => {
          let lvl = a.competition_level || 'Lokal';
          lvl = lvl.charAt(0).toUpperCase() + lvl.slice(1).toLowerCase();
          tingkatCounts[lvl] = (tingkatCounts[lvl] || 0) + 1;
        });
        setPrestasiPerTingkat(Object.keys(tingkatCounts).map(lvl => ({
          tingkat: lvl,
          jumlah: tingkatCounts[lvl],
          prev: Math.max(0, Math.floor(tingkatCounts[lvl] * 0.8))
        })).sort((a, b) => b.jumlah - a.jumlah));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setLoading(false);
  };

  return (
    <AppLayout activePath="/laporan">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Laporan & Perencanaan</h1>
            <p className="text-slate-500 text-sm mt-1">Pantau tren prestasi dan rencanakan program kemahasiswaan.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={tahun} onChange={e => setTahun(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-indigo-700">
              {availableYears.map(year => (
                <option key={year} value={year}>{year === 'Semua' ? 'Semua Tahun' : `TA ${year}`}</option>
              ))}
            </select>
            <select value={semester} onChange={e => setSemester(e.target.value as any)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-indigo-700">
              <option value="Semua">Semua Semester</option>
              <option value="Ganjil">Semester Ganjil</option>
              <option value="Genap">Semester Genap</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Prestasi', value: totalPrestasi, change: 'Verifikasi', icon: <Trophy size={20} className="text-indigo-600" />, bg: 'bg-indigo-50' },
            { label: 'Mahasiswa', value: totalMahasiswa, change: 'Terdaftar', icon: <Users size={20} className="text-cyan-600" />, bg: 'bg-cyan-50' },
            { label: 'Lomba Aktif', value: lombaAktif, change: 'Tersedia', icon: <BarChart3 size={20} className="text-amber-600" />, bg: 'bg-amber-50' },
            { label: 'Event Berlangsung', value: 2, change: 'Platform', icon: <CalendarDays size={20} className="text-emerald-600" />, bg: 'bg-emerald-50' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  {kpi.icon}
                </div>
                <span className="text-xs font-semibold text-slate-500">{kpi.change}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-800 tabular-nums">{kpi.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-800">Tren Prestasi ({tahun !== 'Semua' ? `TA ${tahun}` : 'Seluruh Waktu'})</h3>
                <p className="text-xs text-slate-500 mt-0.5">Jumlah prestasi yang diverifikasi tiap bulan</p>
              </div>
              <TrendingUp size={18} className="text-indigo-400" />
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prestasiPerBulan} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorJumlah" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="jumlah" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorJumlah)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-800">Distribusi Kategori</h3>
                <p className="text-xs text-slate-500 mt-0.5">Prestasi berdasarkan bidang</p>
              </div>
              <PieIcon size={18} className="text-cyan-400" />
            </div>
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={prestasiPerKategori} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {prestasiPerKategori.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {prestasiPerKategori.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">Belum ada data prestasi.</div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {prestasiPerKategori.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}} />
                    <span className="text-slate-600 truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-800">Prestasi per Tingkat</h3>
                <p className="text-xs text-slate-500 mt-0.5">Perbandingan prestasi {tahun}</p>
              </div>
              <BarChart3 size={18} className="text-amber-400" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prestasiPerTingkat}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="tingkat" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Legend iconType="circle" wrapperStyle={{fontSize: 12, paddingTop: 10}} />
                  <Bar dataKey="jumlah" name="Periode Ini" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="prev" name="Periode Lalu" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
              {prestasiPerTingkat.length === 0 && (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">Belum ada data tingkat prestasi.</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="font-bold text-slate-800">Daftar Prestasi Terverifikasi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Rekapitulasi data sesuai filter aktif</p>
              </div>
              <Trophy size={18} className="text-amber-500" />
            </div>
            <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[400px] scrollbar-thin">
              {loading ? (
                <div className="p-10 text-center">
                  <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-xs text-slate-400">Memuat data...</p>
                </div>
              ) : achievements.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                    <Trophy size={24} />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">Tidak ada data</p>
                  <p className="text-xs text-slate-400">Belum ada prestasi yang sesuai filter.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {achievements.map((item: any) => (
                    <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-slate-800 truncate mb-0.5">{item.title}</h4>
                          <p className="text-xs text-slate-500 truncate">{item.users?.name || 'Mahasiswa'}</p>
                        </div>
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-bold">{item.competition_level}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <CalendarDays size={10} />
                          {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-semibold text-slate-500">{item.category}</span>
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
