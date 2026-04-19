'use client';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Bookmark, Trash2, ExternalLink, Clock, Swords } from 'lucide-react';
import type { Bookmark as BookmarkType } from '@/types';

export default function BookmarkPage() {
  const { profile } = useAuth();
  const supabase = createClient();
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('bookmarks')
        .select('*, competitions(*)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      setBookmarks((data as unknown as BookmarkType[]) || []);
      setLoading(false);
    };
    fetch();
  }, [profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemove = async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);
    if (error) toast.error('Gagal menghapus bookmark');
    else {
      setBookmarks(prev => prev.filter(b => b.id !== id));
      toast.success('Bookmark dihapus');
    }
  };

  return (
    <AppLayout activePath="/mahasiswa/bookmark">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Bookmark Lomba</h1>
          <p className="text-slate-500 text-sm mt-1">Lomba dan hibah yang Anda simpan untuk referensi mendatang.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="card p-5 space-y-3 animate-pulse"><div className="h-4 bg-slate-200 rounded w-3/4" /><div className="h-3 bg-slate-100 rounded w-1/2" /><div className="h-16 bg-slate-100 rounded" /></div>)}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="card p-12 text-center">
            <Bookmark size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">Belum ada bookmark</p>
            <p className="text-xs text-slate-500 mt-1">Tandai lomba favorit Anda di halaman Cari Lomba.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map(b => {
              const c = b.competitions;
              if (!c) return null;
              const isExpired = c.status === 'expired' || (c.deadline && new Date(c.deadline) < new Date());
              return (
                <div key={b.id} className="card p-5 flex flex-col gap-3 group hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><Swords size={18} /></div>
                    <div className="flex items-center gap-1.5">
                      {isExpired ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">Berakhir</span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Aktif</span>
                      )}
                      <button onClick={() => handleRemove(b.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Hapus Bookmark">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">{c.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{c.organizer || '—'}</p>
                  </div>
                  {c.description && <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.description}</p>}
                  <div className="flex items-center gap-2 flex-wrap">
                    {c.kategori && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">{c.kategori}</span>}
                    {c.tingkat && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700">{c.tingkat}</span>}
                  </div>
                  {c.deadline && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <Clock size={12} className="text-orange-500" />
                      Deadline: {new Date(c.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-auto pt-1">
                    {c.link && (
                      <a href={c.link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors">
                        <ExternalLink size={12} /> Kunjungi
                      </a>
                    )}
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
