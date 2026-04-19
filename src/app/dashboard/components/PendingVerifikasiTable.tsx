'use client';
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Achievement } from '@/types';

export default function PendingVerifikasiTable() {
  const supabase = createClient();
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('achievements')
      .select('*, users:user_id(name, email, nim), competitions:competition_id(title)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) toast.error('Gagal memuat data');
    else setItems((data as unknown as Achievement[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPending(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVerify = async (id: string, status: 'verified' | 'rejected') => {
    setProcessing(id);
    const { error } = await supabase.from('achievements').update({ status }).eq('id', id);
    if (error) toast.error('Gagal memperbarui status');
    else {
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success(status === 'verified' ? 'Prestasi disetujui!' : 'Prestasi ditolak.');
    }
    setProcessing(null);
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800">Menunggu Verifikasi</h3>
          <p className="text-xs text-slate-500 mt-0.5">{items.length} prestasi perlu ditinjau</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
          <Clock size={12} /> Pending
        </span>
      </div>

      {loading ? (
        <div className="p-6 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center">
          <CheckCircle size={36} className="text-emerald-400 mx-auto mb-3" />
          <p className="font-semibold text-slate-700">Semua sudah diverifikasi</p>
          <p className="text-xs text-slate-500 mt-1">Tidak ada prestasi yang menunggu tinjauan.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {items.map((item) => (
            <div key={item.id} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600 font-bold text-sm">
                {(item.users?.name || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.users?.name || '—'} {item.users?.nim && `· ${item.users.nim}`}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {item.category && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{item.category}</span>
                  )}
                  {item.competition_level && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-600">{item.competition_level}</span>
                  )}
                  {item.proof_url && (
                    <a href={item.proof_url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1 hover:bg-slate-200 transition-colors">
                      <ExternalLink size={9} /> Lihat Bukti
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleVerify(item.id, 'verified')}
                  disabled={processing === item.id}
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                  title="Setujui"
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  onClick={() => handleVerify(item.id, 'rejected')}
                  disabled={processing === item.id}
                  className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                  title="Tolak"
                >
                  <XCircle size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}