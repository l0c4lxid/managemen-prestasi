'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Search, Plus, Filter, RefreshCw, Swords, Clock, Trophy, Tag, Globe, Pencil, Trash2, Eye, LayoutGrid, List, Bookmark, BookmarkCheck, Users, BarChart3 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import LombaFormModal from './components/LombaFormModal';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type LombaStatus = 'active' | 'closed' | 'archived';

export interface Lomba {
  id: string; title: string; description: string | null; organizer: string | null;
  kategori: string | null; tingkat: string | null; deadline: string | null;
  prize: string | null; status: string; link: string | null;
  syarat_ketentuan: string | null; cara_pendaftaran: string | null;
  tanggal_mulai: string | null; created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: 'Aktif', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  closed: { label: 'Tutup', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  archived: { label: 'Diarsipkan', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  expired: { label: 'Kedaluwarsa', color: 'bg-red-100 text-red-600', dot: 'bg-red-400' },
};

const kategoriColors: Record<string, string> = {
  Akademik: 'bg-blue-100 text-blue-700',
  'Non-Akademik': 'bg-amber-100 text-amber-700',
};

const tingkatColors: Record<string, string> = {
  Kampus: 'bg-slate-100 text-slate-600', Regional: 'bg-teal-100 text-teal-700',
  Nasional: 'bg-blue-100 text-blue-700', Internasional: 'bg-violet-100 text-violet-700',
};

export default function LombaManagementPage() {
  const router = useRouter();
  const supabase = createClient();
  const { role, profile } = useAuth();
  const isAdmin = role && role !== 'mahasiswa';
  const canManage = ['super_admin', 'admin_lomba'].includes(role || '');
  const [data, setData] = useState<Lomba[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterKategori, setFilterKategori] = useState('all');
  const [filterTingkat, setFilterTingkat] = useState('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Lomba | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState<string | null>(null);
  const [participationCounts, setParticipationCounts] = useState<Record<string, number>>({});

  const fetchData = async () => {
    setLoading(true);
    const { data: rows, error } = await supabase.from('competitions').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Gagal memuat data lomba');
    else setData(rows || []);
    setLoading(false);
  };

  const fetchBookmarks = async () => {
    if (!profile?.id || isAdmin) return;
    const { data: bks } = await supabase.from('bookmarks').select('competition_id').eq('user_id', profile.id);
    setBookmarkedIds(new Set((bks || []).map(b => b.competition_id!).filter(Boolean)));
  };

  const fetchParticipation = async () => {
    if (!isAdmin) return;
    const { data: regs } = await supabase.from('registrations').select('competition_id');
    if (regs) {
      const counts: Record<string, number> = {};
      regs.forEach(r => { if (r.competition_id) counts[r.competition_id] = (counts[r.competition_id] || 0) + 1; });
      setParticipationCounts(counts);
    }
  };

  useEffect(() => { fetchData(); fetchBookmarks(); fetchParticipation(); }, [profile?.id, role]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleBookmark = async (lombaId: string) => {
    if (!profile?.id) return;
    setBookmarkLoading(lombaId);
    if (bookmarkedIds.has(lombaId)) {
      const { error } = await supabase.from('bookmarks').delete().eq('user_id', profile.id).eq('competition_id', lombaId);
      if (!error) { setBookmarkedIds(prev => { const s = new Set(prev); s.delete(lombaId); return s; }); toast.success('Bookmark dihapus'); }
    } else {
      const { error } = await supabase.from('bookmarks').insert({ user_id: profile.id, competition_id: lombaId });
      if (!error) { setBookmarkedIds(prev => new Set([...prev, lombaId])); toast.success('Lomba disimpan!'); }
    }
    setBookmarkLoading(null);
  };

  const filtered = useMemo(() => {
    let result = [...data];
    if (search) { const q = search.toLowerCase(); result = result.filter(d => d.title.toLowerCase().includes(q) || (d.organizer || '').toLowerCase().includes(q)); }
    if (filterStatus !== 'all') result = result.filter(d => d.status === filterStatus);
    if (filterKategori !== 'all') result = result.filter(d => d.kategori === filterKategori);
    if (filterTingkat !== 'all') result = result.filter(d => d.tingkat === filterTingkat);
    return result;
  }, [data, search, filterStatus, filterKategori, filterTingkat]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const { error } = await supabase.from('competitions').delete().eq('id', deleteTarget);
    if (error) toast.error('Gagal menghapus lomba');
    else { setData(prev => prev.filter(d => d.id !== deleteTarget)); toast.success('Lomba berhasil dihapus'); }
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  const handleSave = (item: Lomba) => {
    if (editItem) setData(prev => prev.map(d => d.id === item.id ? item : d));
    else setData(prev => [item, ...prev]);
    setFormOpen(false); setEditItem(null);
  };

  const kategoriOptions = Array.from(new Set(data.map(d => d.kategori).filter(Boolean)));
  const tingkatOptions = Array.from(new Set(data.map(d => d.tingkat).filter(Boolean)));

  return (
    <AppLayout activePath="/lomba-management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{isAdmin ? 'Manajemen Lomba & Hibah' : 'Cari Lomba & Hibah'}</h1>
            <p className="text-slate-500 text-sm mt-1">{isAdmin ? 'Kelola daftar kompetisi, hibah, dan PKM untuk mahasiswa.' : 'Temukan kompetisi dan program hibah yang sesuai dengan minat Anda.'}</p>
          </div>
          {isAdmin && (
            <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="btn-primary">
              <Plus size={16} /> Tambah Lomba
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Lomba', value: data.length, icon: Swords, color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Aktif', value: data.filter(d => d.status === 'active').length, icon: Trophy, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Tutup/Expired', value: data.filter(d => d.status === 'closed' || d.status === 'expired').length, icon: Clock, color: 'text-orange-600 bg-orange-50' },
            isAdmin
              ? { label: 'Total Peserta', value: Object.values(participationCounts).reduce((a, b) => a + b, 0), icon: Users, color: 'text-cyan-600 bg-cyan-50' }
              : { label: 'Disimpan', value: bookmarkedIds.size, icon: Bookmark, color: 'text-purple-600 bg-purple-50' },
          ].map(stat => (
            <div key={stat.label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}><stat.icon size={18} /></div>
              <div><p className="text-2xl font-bold text-slate-800">{stat.value}</p><p className="text-xs text-slate-500">{stat.label}</p></div>
            </div>
          ))}
        </div>

        {/* Admin: participation analytics */}
        {isAdmin && Object.keys(participationCounts).length > 0 && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-indigo-600" />
              <h3 className="font-bold text-slate-800">Analitik Partisipasi</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {data.filter(d => participationCounts[d.id]).slice(0, 4).map(d => (
                <div key={d.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 line-clamp-1">{d.title}</p>
                  <p className="text-xl font-bold text-indigo-600 mt-1">{participationCounts[d.id] || 0}</p>
                  <p className="text-[10px] text-slate-400">pendaftar</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="card p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="search" placeholder="Cari nama lomba atau penyelenggara…" value={search} onChange={e => { setSearch(e.target.value); }} className="input-field pl-9 py-2 text-sm" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-slate-400" />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field py-2 text-sm w-auto min-w-[120px]">
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="closed">Tutup</option>
                <option value="archived">Diarsipkan</option>
                <option value="expired">Kedaluwarsa</option>
              </select>
              <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)} className="input-field py-2 text-sm w-auto min-w-[130px]">
                <option value="all">Semua Kategori</option>
                {kategoriOptions.map(k => <option key={k!} value={k!}>{k}</option>)}
              </select>
              <select value={filterTingkat} onChange={e => setFilterTingkat(e.target.value)} className="input-field py-2 text-sm w-auto min-w-[130px]">
                <option value="all">Semua Tingkat</option>
                {tingkatOptions.map(t => <option key={t!} value={t!}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={fetchData} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors" title="Refresh"><RefreshCw size={16} /></button>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setViewMode('card')} className={`p-2 transition-colors ${viewMode === 'card' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-500'}`}><LayoutGrid size={16} /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-500'}`}><List size={16} /></button>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500">Menampilkan <span className="font-semibold text-slate-700">{filtered.length}</span> dari {data.length} lomba</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-5 space-y-3 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4" /><div className="h-3 bg-slate-100 rounded w-1/2" /><div className="h-16 bg-slate-100 rounded" />
                <div className="flex gap-2"><div className="h-6 bg-slate-100 rounded-full w-20" /><div className="h-6 bg-slate-100 rounded-full w-16" /></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Swords size={40} className="text-slate-300" />} title="Belum ada lomba" description="Belum ada lomba yang sesuai filter." action={canManage ? <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="btn-primary">Tambah Lomba</button> : undefined} />
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(lomba => {
              const sc = statusConfig[lomba.status] || statusConfig.active;
              const kColor = kategoriColors[lomba.kategori || ''] || 'bg-slate-100 text-slate-600';
              const tColor = tingkatColors[lomba.tingkat || ''] || 'bg-slate-100 text-slate-600';
              const isBookmarked = bookmarkedIds.has(lomba.id);
              return (
                <div key={lomba.id} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0"><Swords size={18} /></div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${sc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                      </span>
                      {!isAdmin && (
                        <button
                          onClick={() => toggleBookmark(lomba.id)}
                          disabled={bookmarkLoading === lomba.id}
                          className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                          title={isBookmarked ? 'Hapus Bookmark' : 'Simpan'}
                        >
                          {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">{lomba.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{lomba.organizer || '—'}</p>
                  </div>
                  {lomba.description && <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{lomba.description}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {lomba.kategori && <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${kColor}`}><Tag size={9} className="inline mr-1" />{lomba.kategori}</span>}
                    {lomba.tingkat && <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tColor}`}><Globe size={9} className="inline mr-1" />{lomba.tingkat}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    {lomba.deadline && <span className="flex items-center gap-1"><Clock size={12} className="text-orange-500" />Deadline: {new Date(lomba.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                    {lomba.prize && <span className="flex items-center gap-1 ml-auto"><Trophy size={12} className="text-amber-500" /><span className="truncate max-w-[100px]">{lomba.prize}</span></span>}
                  </div>
                  {canManage && (
                    <div className="flex items-center gap-2 pt-1">
                      <button onClick={() => router.push(`/lomba-management/${lomba.id}`)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"><Eye size={13} /> Lihat</button>
                      <button onClick={() => { setEditItem(lomba); setFormOpen(true); }} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors" title="Edit"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteTarget(lomba.id)} className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Hapus"><Trash2 size={14} /></button>
                    </div>
                  )}
                  {!isAdmin && lomba.link && (
                    <a href={lomba.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors">
                      Daftar Sekarang →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Nama Lomba</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tingkat</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  {isAdmin && <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Peserta</th>}
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(lomba => {
                  const sc = statusConfig[lomba.status] || statusConfig.active;
                  const isBookmarked = bookmarkedIds.has(lomba.id);
                  return (
                    <tr key={lomba.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3"><p className="font-semibold text-slate-800 text-sm">{lomba.title}</p><p className="text-xs text-slate-500">{lomba.organizer}</p></td>
                      <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${kategoriColors[lomba.kategori || ''] || 'bg-slate-100 text-slate-600'}`}>{lomba.kategori || '—'}</span></td>
                      <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tingkatColors[lomba.tingkat || ''] || 'bg-slate-100 text-slate-600'}`}>{lomba.tingkat || '—'}</span></td>
                      <td className="px-4 py-3 text-xs text-slate-600">{lomba.deadline ? new Date(lomba.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit ${sc.color}`}><span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}</span></td>
                      {isAdmin && <td className="px-4 py-3 text-sm text-slate-700 font-semibold">{participationCounts[lomba.id] || 0}</td>}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {canManage ? (
                            <>
                              <button onClick={() => router.push(`/lomba-management/${lomba.id}`)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors" title="Detail"><Eye size={14} /></button>
                              <button onClick={() => { setEditItem(lomba); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Edit"><Pencil size={14} /></button>
                              <button onClick={() => setDeleteTarget(lomba.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Hapus"><Trash2 size={14} /></button>
                            </>
                          ) : (
                            <button onClick={() => toggleBookmark(lomba.id)} disabled={bookmarkLoading === lomba.id} className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`} title={isBookmarked ? 'Hapus Bookmark' : 'Simpan'}>
                              {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                            </button>
                          )}
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

      {canManage && (
        <>
          <LombaFormModal open={formOpen} onClose={() => { setFormOpen(false); setEditItem(null); }} onSave={handleSave} editItem={editItem} />
          <ConfirmDialog open={!!deleteTarget} title="Hapus Lomba" description="Apakah Anda yakin ingin menghapus lomba ini?" confirmLabel="Hapus" variant="danger" loading={deleteLoading} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        </>
      )}
    </AppLayout>
  );
}