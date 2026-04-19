'use client';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Clock, CheckCircle, XCircle, ExternalLink, Star } from 'lucide-react';
import type { Achievement } from '@/types';

const statusCfg = {
  pending: { label: 'Menunggu Verifikasi', cls: 'status-pending', icon: <Clock size={12} /> },
  verified: { label: 'Terverifikasi', cls: 'status-verified', icon: <CheckCircle size={12} /> },
  rejected: { label: 'Ditolak', cls: 'status-rejected', icon: <XCircle size={12} /> },
};

export default function RiwayatPrestasiPage() {
  const { profile } = useAuth();
  const supabase = createClient();
  const [data, setData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  useEffect(() => {
    if (!profile?.id) return;
    const fetch = async () => {
      setLoading(true);
      const { data: rows } = await supabase
        .from('achievements')
        .select('*, competitions:competition_id(title)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      setData((rows as unknown as Achievement[]) || []);
      setLoading(false);
    };
    fetch();
  }, [profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = filter === 'all' ? data : data.filter(d => d.status === filter);
  const counts = { all: data.length, pending: data.filter(d => d.status === 'pending').length, verified: data.filter(d => d.status === 'verified').length, rejected: data.filter(d => d.status === 'rejected').length };

  return (
    <AppLayout activePath="/mahasiswa/riwayat">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Riwayat Prestasi Saya</h1>
          <p className="text-slate-500 text-sm mt-1">Semua submisi prestasi yang pernah Anda kirimkan beserta statusnya.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: 'all', label: 'Total', icon: Star, color: 'text-indigo-600 bg-indigo-50' },
            { key: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-50' },
            { key: 'verified', label: 'Terverifikasi', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
            { key: 'rejected', label: 'Ditolak', icon: XCircle, color: 'text-red-600 bg-red-50' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key as typeof filter)}
              className={`card p-4 flex items-center gap-3 text-left transition-all ${filter === s.key ? 'ring-2 ring-indigo-500' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon size={18} /></div>
              <div><p className="text-2xl font-bold text-slate-800">{counts[s.key as keyof typeof counts]}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200 flex-shrink-0" />
                <div className="flex-1 space-y-2"><div className="h-4 bg-slate-200 rounded w-3/4" /><div className="h-3 bg-slate-100 rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Trophy size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">{filter === 'all' ? 'Belum ada prestasi' : `Tidak ada prestasi ${filter}`}</p>
            <p className="text-xs text-slate-500 mt-1">Mulai dengan submit prestasi pertama Anda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => {
              const sc = statusCfg[item.status];
              return (
                <div key={item.id} className="card p-5 flex items-start gap-4 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : item.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                    <Trophy size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-bold text-slate-800">{item.title}</p>
                        {item.competitions?.title && <p className="text-xs text-slate-500 mt-0.5">{item.competitions.title}</p>}
                      </div>
                      <span className={`${sc.cls} flex items-center gap-1.5 flex-shrink-0`}>
                        {sc.icon}{sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {item.category && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{item.category}</span>}
                      {item.competition_level && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-600">{item.competition_level}</span>}
                      <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      {item.proof_url && (
                        <a href={item.proof_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:underline">
                          <ExternalLink size={10} /> Lihat Bukti
                        </a>
                      )}
                    </div>
                    {item.description && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
