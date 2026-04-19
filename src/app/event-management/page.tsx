'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Search, Plus, Filter, RefreshCw, CalendarDays, MapPin, Users,
  Clock, Pencil, Trash2, Eye, LayoutGrid, List, Mic2
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EventFormModal from './components/EventFormModal';
import EmptyState from '@/components/ui/EmptyState';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  date: string;
  end_date: string | null;
  time: string | null;
  location: string | null;
  mentor: string | null;
  mentor_role: string | null;
  institusi_narasumber: string | null;
  quota: number;
  type: string | null;
  status: string | null;
  link_pendaftaran: string | null;
  syarat_ketentuan: string | null;
  cara_pendaftaran: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  upcoming: { label: 'Akan Datang', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  ongoing: { label: 'Berlangsung', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  done: { label: 'Selesai', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
};

const tipeColors: Record<string, string> = {
  Workshop: 'bg-indigo-100 text-indigo-700',
  Seminar: 'bg-emerald-100 text-emerald-700',
  Pelatihan: 'bg-cyan-100 text-cyan-700',
  Coaching: 'bg-purple-100 text-purple-700',
  Webinar: 'bg-amber-100 text-amber-700',
};

export default function EventManagementPage() {
  const router = useRouter();
  const supabase = createClient();
  const { role, profile } = useAuth();
  const isAdmin = role && role !== 'mahasiswa';
  const [data, setData] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(''); 
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTipe, setFilterTipe] = useState('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<EventItem | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [regLoading, setRegLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: rows, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    if (error) {
      toast.error('Gagal memuat data event');
    } else {
      setData(rows || []);
    }
    setLoading(false);
  };

  const fetchRegistrations = async () => {
    if (!profile?.id || isAdmin) return;
    const { data: regs } = await supabase.from('registrations').select('event_id').eq('user_id', profile.id);
    setRegisteredIds(new Set((regs || []).map(r => r.event_id!).filter(Boolean)));
  };

  const handleRegister = async (eventId: string) => {
    if (!profile?.id) return;
    setRegLoading(eventId);
    if (registeredIds.has(eventId)) {
      const { error } = await supabase.from('registrations').delete().eq('user_id', profile.id).eq('event_id', eventId);
      if (!error) { setRegisteredIds(prev => { const s = new Set(prev); s.delete(eventId); return s; }); toast.success('Pendaftaran dibatalkan'); }
    } else {
      const { error } = await supabase.from('registrations').insert({ user_id: profile.id, event_id: eventId, status: 'registered' });
      if (!error) { setRegisteredIds(prev => new Set([...prev, eventId])); toast.success('Berhasil mendaftar event!'); }
    }
    setRegLoading(null);
  };

  useEffect(() => { fetchData(); fetchRegistrations(); }, [profile?.id, role]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    let result = [...data];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(q) ||
        (d.mentor || '').toLowerCase().includes(q) ||
        (d.location || '').toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') result = result.filter(d => d.status === filterStatus);
    if (filterTipe !== 'all') result = result.filter(d => d.type === filterTipe);
    return result;
  }, [data, search, filterStatus, filterTipe]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const { error } = await supabase.from('events').delete().eq('id', deleteTarget);
    if (error) {
      toast.error('Gagal menghapus event');
    } else {
      setData(prev => prev.filter(d => d.id !== deleteTarget));
      toast.success('Event berhasil dihapus');
    }
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  const handleSave = (item: EventItem) => {
    if (editItem) {
      setData(prev => prev.map(d => d.id === item.id ? item : d));
    } else {
      setData(prev => [item, ...prev]);
    }
    setFormOpen(false);
    setEditItem(null);
  };

  return (
    <AppLayout activePath="/event-management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{isAdmin ? 'Manajemen Event' : 'Event & Bootcamp'}</h1>
            <p className="text-slate-500 text-sm mt-1">{isAdmin ? 'Kelola workshop, seminar, dan pelatihan untuk mahasiswa.' : 'Daftar dan ikuti berbagai kegiatan pengembangan diri.'}</p>
          </div>
          {isAdmin && (
            <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="btn-primary">
              <Plus size={16} />
              Tambah Event
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Event', value: data.length, icon: CalendarDays, color: 'text-cyan-600 bg-cyan-50' },
            { label: 'Akan Datang', value: data.filter(d => d.status === 'upcoming').length, icon: Clock, color: 'text-blue-600 bg-blue-50' },
            { label: 'Berlangsung', value: data.filter(d => d.status === 'ongoing').length, icon: Mic2, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Selesai', value: data.filter(d => d.status === 'done').length, icon: Users, color: 'text-slate-600 bg-slate-50' },
          ].map(stat => (
            <div key={stat.label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="card p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Cari nama event, narasumber, lokasi…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-slate-400" />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field py-2 text-sm w-auto min-w-[130px]">
                <option value="all">Semua Status</option>
                <option value="upcoming">Akan Datang</option>
                <option value="ongoing">Berlangsung</option>
                <option value="done">Selesai</option>
              </select>
              <select value={filterTipe} onChange={e => setFilterTipe(e.target.value)} className="input-field py-2 text-sm w-auto min-w-[120px]">
                <option value="all">Semua Tipe</option>
                {['Workshop', 'Seminar', 'Pelatihan', 'Coaching', 'Webinar'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={fetchData} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors" title="Refresh">
                <RefreshCw size={16} />
              </button>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setViewMode('card')} className={`p-2 transition-colors ${viewMode === 'card' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-100 text-slate-500'}`}>
                  <LayoutGrid size={16} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-100 text-slate-500'}`}>
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Menampilkan <span className="font-semibold text-slate-700">{filtered.length}</span> dari {data.length} event
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-5 space-y-3 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-16 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={40} className="text-slate-300" />}
            title="Belum ada event"
            description="Tambahkan event pertama untuk mulai mengelola kegiatan mahasiswa."
            action={<button onClick={() => { setEditItem(null); setFormOpen(true); }} className="btn-primary">Tambah Event</button>}
          />
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(evt => {
              const sc = statusConfig[evt.status || 'upcoming'] || statusConfig.upcoming;
              const tColor = tipeColors[evt.type || ''] || 'bg-slate-100 text-slate-600';
              return (
                <div key={evt.id} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                      <CalendarDays size={18} />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${sc.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-cyan-700 transition-colors">
                      {evt.title}
                    </h3>
                    {evt.type && (
                      <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${tColor}`}>
                        {evt.type}
                      </span>
                    )}
                  </div>

                  {evt.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{evt.description}</p>
                  )}

                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-cyan-500 shrink-0" />
                      {evt.date ? new Date(evt.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      {evt.time && <span className="text-slate-400">• {evt.time}</span>}
                    </div>
                    {evt.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-rose-400 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    )}
                    {evt.mentor && (
                      <div className="flex items-center gap-1.5">
                        <Mic2 size={12} className="text-purple-400 shrink-0" />
                        <span className="truncate">{evt.mentor}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => router.push(`/event-management/${evt.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan-50 text-cyan-700 text-xs font-semibold hover:bg-cyan-100 transition-colors"
                    >
                      <Eye size={13} /> Lihat Detail
                    </button>
                    {isAdmin ? (
                      <>
                        <button onClick={() => { setEditItem(evt); setFormOpen(true); }} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors" title="Edit"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteTarget(evt.id)} className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Hapus"><Trash2 size={14} /></button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRegister(evt.id)}
                        disabled={regLoading === evt.id}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${registeredIds.has(evt.id) ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                      >
                        {registeredIds.has(evt.id) ? 'Terdaftar ✓' : 'Daftar'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Nama Event</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tipe</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Lokasi</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(evt => {
                  const sc = statusConfig[evt.status || 'upcoming'] || statusConfig.upcoming;
                  return (
                    <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800 text-sm">{evt.title}</p>
                        {evt.mentor && <p className="text-xs text-slate-500">{evt.mentor}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tipeColors[evt.type || ''] || 'bg-slate-100 text-slate-600'}`}>
                          {evt.type || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {evt.date ? new Date(evt.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 max-w-[150px] truncate">{evt.location || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit ${sc.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => router.push(`/event-management/${evt.id}`)} className="p-1.5 rounded-lg hover:bg-cyan-50 text-cyan-600 transition-colors" title="Detail">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => { setEditItem(evt); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteTarget(evt.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Hapus">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAdmin && (
        <>
          <EventFormModal open={formOpen} onClose={() => { setFormOpen(false); setEditItem(null); }} onSave={handleSave} editItem={editItem} />
          <ConfirmDialog open={!!deleteTarget} title="Hapus Event" description="Apakah Anda yakin ingin menghapus event ini?" confirmLabel="Hapus" variant="danger" loading={deleteLoading} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        </>
      )}
    </AppLayout>
  );
}