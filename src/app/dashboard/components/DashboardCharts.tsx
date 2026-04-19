'use client';
import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { createClient } from '@/lib/supabase/client';

interface TrendData {
  bulan: string;
  diverifikasi: number;
  ditolak: number;
  draf: number;
}

interface KategoriData {
  kategori: string;
  count: number;
}

const CustomTooltipArea = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
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

const CustomTooltipBar = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-soft p-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      <p className="text-indigo-700 font-bold tabular-nums">{payload[0]?.value} prestasi</p>
    </div>
  );
};

export default function DashboardCharts() {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [kategoriData, setKategoriData] = useState<KategoriData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();

      // Generate last 6 months labels
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push({
          full: d.toISOString().substring(0, 7), // YYYY-MM
          label: d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }).replace('.', '')
        });
      }

      // Fetch Trend Data
      const { data: achievements } = await supabase
        .from('achievements')
        .select('status, created_at');

      const trendMap: Record<string, TrendData> = {};
      months.forEach(m => {
        trendMap[m.full] = { bulan: m.label, diverifikasi: 0, ditolak: 0, draf: 0 };
      });

      achievements?.forEach(a => {
        const monthKey = a.created_at.substring(0, 7);
        if (trendMap[monthKey]) {
          if (a.status === 'verified') trendMap[monthKey].diverifikasi++;
          else if (a.status === 'rejected') trendMap[monthKey].ditolak++;
          else if (a.status === 'draft') trendMap[monthKey].draf++;
        }
      });

      setTrendData(Object.values(trendMap));

      // Fetch Category Data
      const { data: catCounts } = await supabase
        .from('achievements')
        .select('kategori')
        .eq('status', 'verified');
      
      const catMap: Record<string, number> = {};
      catCounts?.forEach(c => {
        if (c.kategori) catMap[c.kategori] = (catMap[c.kategori] || 0) + 1;
      });

      const formattedCat = Object.entries(catMap)
        .map(([kategori, count]) => ({ kategori, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      setKategoriData(formattedCat.length > 0 ? formattedCat : [
        { kategori: 'Belum ada data', count: 0 }
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Tren Submisi Prestasi</h3>
            <p className="text-xs text-slate-500 mt-0.5">6 bulan terakhir — diverifikasi, ditolak, draf</p>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {trendData[0]?.bulan} – {trendData[trendData.length - 1]?.bulan}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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