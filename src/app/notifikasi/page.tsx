'use client';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Bell, CheckCheck, Trash2, Trophy, Swords, CalendarDays, Info, CheckCircle, Clock, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Notification } from '@/types';

type FilterType = 'all' | string;

const typeConfig: Record<string, { icon: React.ReactNode; bg: string; color: string; label: string }> = {
  submit: { icon: <Trophy size={16} />, bg: 'bg-amber-50', color: 'text-amber-600', label: 'Prestasi' },
  verification: { icon: <CheckCircle size={16} />, bg: 'bg-emerald-50', color: 'text-emerald-600', label: 'Verifikasi' },
  lomba: { icon: <Swords size={16} />, bg: 'bg-indigo-50', color: 'text-indigo-600', label: 'Lomba' },
  event: { icon: <CalendarDays size={16} />, bg: 'bg-cyan-50', color: 'text-cyan-600', label: 'Event' },
  system: { icon: <Info size={16} />, bg: 'bg-slate-100', color: 'text-slate-500', label: 'Sistem' },
};

export default function NotifikasiPage() {
  const { profile } = useAuth();
  const supabase = createClient();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch] = useState('');

  const fetchNotifs = async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });
    setNotifs((data as Notification[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotifs(); }, [profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    if (!profile?.id) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile.id).eq('is_read', false);
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    toast.success('Semua notifikasi ditandai dibaca');
  };

  const deleteNotif = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

  const clearRead = async () => {
    if (!profile?.id) return;
    await supabase.from('notifications').delete().eq('user_id', profile.id).eq('is_read', true);
    setNotifs(prev => prev.filter(n => !n.is_read));
    toast.success('Notifikasi terbaca dihapus');
  };

  const filtered = notifs.filter(n => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    if (filterRead === 'unread' && n.is_read) return false;
    if (filterRead === 'read' && !n.is_read) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !(n.body || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notifs.filter(n => !n.is_read).length;
  const types = Array.from(new Set(notifs.map(n => n.type)));

  return (
    <AppLayout activePath="/notifikasi">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Notifikasi</h1>
              {unreadCount > 0 && <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold">{unreadCount} baru</span>}
            </div>
            <p className="text-slate-500 text-sm mt-1">Pantau semua aktivitas dan pembaruan platform.</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <CheckCheck size={15} />Tandai Semua Dibaca
              </button>
            )}
            <button onClick={clearRead} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-100 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 size={15} />Hapus Sudah Dibaca
            </button>
          </div>
        </div>

        {/* Stats tabs */}
        <div className="flex flex-wrap gap-2">
          {[{ key: 'all', label: 'Semua', count: notifs.length }, ...types.map(t => ({ key: t, label: typeConfig[t]?.label || t, count: notifs.filter(n => n.type === t).length }))].map(tab => (
            <button key={tab.key} onClick={() => setFilterType(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${filterType === tab.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              {tab.label} <span className={`text-xs px-1.5 rounded-full ${filterType === tab.key ? 'bg-white/20' : 'bg-slate-100'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari notifikasi..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" />
          </div>
          <select value={filterRead} onChange={e => setFilterRead(e.target.value as typeof filterRead)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            <option value="all">Semua</option>
            <option value="unread">Belum Dibaca</option>
            <option value="read">Sudah Dibaca</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2"><div className="h-3.5 bg-slate-200 rounded w-3/4" /><div className="h-3 bg-slate-100 rounded w-1/2" /></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center"><Bell size={24} className="text-slate-400" /></div>
              <p className="font-semibold text-slate-600">Tidak ada notifikasi</p>
              <p className="text-sm text-slate-400">Semua notifikasi sudah dibaca atau tidak ada yang sesuai filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map(notif => {
                const tc = typeConfig[notif.type] || typeConfig.system;
                return (
                  <div key={notif.id}
                    className={`flex items-start gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors cursor-pointer group ${!notif.is_read ? 'bg-indigo-50/30' : ''}`}
                    onClick={() => !notif.is_read && markAsRead(notif.id)}
                  >
                    <div className={`w-10 h-10 rounded-xl ${tc.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <span className={tc.color}>{tc.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-semibold ${!notif.is_read ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</p>
                          {!notif.is_read && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.is_read && (
                            <button onClick={e => { e.stopPropagation(); markAsRead(notif.id); }} className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Tandai dibaca"><CheckCircle size={14} /></button>
                          )}
                          <button onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Hapus"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      {notif.body && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.body}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${tc.bg} ${tc.color}`}>{tc.label}</span>
                        {notif.created_at && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Clock size={10} />{new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
