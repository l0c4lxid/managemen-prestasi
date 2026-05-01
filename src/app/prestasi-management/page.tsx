'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Search, Filter, CheckCircle, XCircle, Clock, Eye, ExternalLink, RefreshCw, BarChart3, Trophy, Users, Plus, Edit, Trash2, Image as ImageIcon, Loader2, Globe } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import type { Achievement } from '@/types';

type StatusFilter = 'all' | 'pending' | 'verified' | 'rejected';

const statusCfg = {
  pending: { label: 'Menunggu', cls: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-400' },
  verified: { label: 'Terverifikasi', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
  rejected: { label: 'Ditolak', cls: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-400' },
};

export default function PrestasiManagementPage() {
  const supabase = createClient();
  const { role } = useAuth();
  const canVerify = ['super_admin', 'admin_prestasi'].includes(role || '');
  const [data, setData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [detailItem, setDetailItem] = useState<Achievement | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: rows, error } = await supabase
      .from('achievements')
      .select('*, users:user_id(name, email, nim), competitions:competition_id(title)')
      .order('created_at', { ascending: false });
    if (error) toast.error('Gagal memuat data prestasi');
    else setData((rows as unknown as Achievement[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    let r = [...data];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(d => d.title.toLowerCase().includes(q) || (d.users?.name || '').toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') r = r.filter(d => d.status === filterStatus);
    if (filterLevel !== 'all') r = r.filter(d => d.competition_level === filterLevel);
    return r;
  }, [data, search, filterStatus, filterLevel]);

  const handleDeleteRequest = (item: Achievement) => {
    setDeleteConfirm({ id: item.id, title: item.title });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { id } = deleteConfirm;
    setProcessing(id);
    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) toast.error('Gagal menghapus data');
    else {
      setData(prev => prev.filter(d => d.id !== id));
      toast.success('Data prestasi berhasil dihapus');
      setDeleteConfirm(null);
    }
    setProcessing(null);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalForm, setModalForm] = useState({
    id: '',
    user_id: '',
    title: '',
    description: '',
    category: 'Akademik',
    competition_level: 'nasional',
    rank: '',
    proof_url: '',
    document_url: '',
    year: new Date().getFullYear().toString(),
    status: 'pending' as Achievement['status'],
    isNewStudent: false,
    newName: '',
    newNim: '',
    newEmail: '',
    newMajor: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, title: string} | null>(null);
  const [usersList, setUsersList] = useState<{id: string, name: string, nim: string}[]>([]);

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('id, name, nim').eq('role', 'mahasiswa').order('name');
    setUsersList(data || []);
  };

  const openAddModal = () => {
    setModalMode('add');
    setModalForm({ id: '', user_id: '', title: '', description: '', category: 'Akademik', competition_level: 'nasional', rank: '', proof_url: '', document_url: '', year: new Date().getFullYear().toString(), status: 'pending', isNewStudent: false, newName: '', newNim: '', newEmail: '', newMajor: '' });
    setModalOpen(true);
    fetchUsers();
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const openEditModal = (item: Achievement) => {
    setModalMode('edit');
    setModalForm({
      id: item.id,
      user_id: item.user_id,
      title: item.title,
      description: item.description || '',
      category: item.category || 'Akademik',
      competition_level: item.competition_level || 'nasional',
      rank: (item.rank === 0 || item.rank === '0') ? '' : item.rank?.toString() || '',
      proof_url: item.proof_url || '',
      document_url: item.document_url || '',
      year: item.year || new Date(item.created_at).getFullYear().toString(),
      status: item.status,
      isNewStudent: false,
      newName: '',
      newNim: '',
      newEmail: '',
      newMajor: '',
    });
    setModalOpen(true);
    fetchUsers();
    setSelectedFile(null);
    setPreviewUrl(item.proof_url || null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing('modal');
    try {
      let currentProofUrl = modalForm.proof_url;

      // 1. Handle file upload if a file was selected
      if (selectedFile) {
        setUploading(true);
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `achievements/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('posters')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('posters')
          .getPublicUrl(filePath);
        
        currentProofUrl = publicUrl;
      }

      let targetUserId = modalForm.user_id;

      if (modalMode === 'add' && modalForm.isNewStudent) {
        // Create new user first
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            name: modalForm.newName,
            nim: modalForm.newNim,
            email: modalForm.newEmail || `${modalForm.newNim}@bsi.ac.id`,
            role: 'mahasiswa',
            major: modalForm.newMajor,
          })
          .select()
          .single();
        
        if (userError) {
          if (userError.code === '23505') throw new Error('NIM atau Email sudah terdaftar di sistem.');
          throw userError;
        }
        targetUserId = newUser.id;
      }

      if (!targetUserId) throw new Error('Silakan pilih atau input mahasiswa terlebih dahulu.');

      const payload = {
        user_id: targetUserId,
        title: modalForm.title,
        description: modalForm.description || null,
        category: modalForm.category,
        competition_level: modalForm.competition_level,
        rank: modalForm.rank || null,
        proof_url: currentProofUrl || null,
        document_url: modalForm.document_url || null,
        year: modalForm.year,
        status: modalForm.status,
      };

      if (modalMode === 'edit') {
        const { error } = await supabase.from('achievements').update(payload).eq('id', modalForm.id);
        if (error) throw error;
        toast.success('Berhasil memperbarui data');
      } else {
        const { error } = await supabase.from('achievements').insert(payload);
        if (error) throw error;
        toast.success('Berhasil menambahkan data');
      }
      setModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error('Gagal menyimpan data: ' + error.message);
    } finally {
      setProcessing(null);
      setUploading(false);
    }
  };

  const handleVerify = async (id: string, status: 'verified' | 'rejected') => {
    setProcessing(id);
    const { error } = await supabase.from('achievements').update({ status }).eq('id', id);
    if (error) toast.error('Gagal memperbarui status');
    else {
      setData(prev => prev.map(d => d.id === id ? { ...d, status } : d));
      if (detailItem?.id === id) setDetailItem(prev => prev ? { ...prev, status } : null);
      toast.success(status === 'verified' ? '✓ Prestasi diverifikasi!' : '✗ Prestasi ditolak.');
    }
    setProcessing(null);
  };

  const counts = useMemo(() => ({
    total: data.length,
    pending: data.filter(d => d.status === 'pending').length,
    verified: data.filter(d => d.status === 'verified').length,
    rejected: data.filter(d => d.status === 'rejected').length,
  }), [data]);

  const levels = Array.from(new Set(data.map(d => d.competition_level).filter(Boolean)));

  return (
    <AppLayout activePath="/prestasi-management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Prestasi</h1>
            <p className="text-slate-500 text-sm mt-1">Tinjau, verifikasi, dan kelola seluruh submisi prestasi mahasiswa.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="btn-ghost">
              <RefreshCw size={15} /> Refresh
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              <Plus size={16} />
              Tambah Prestasi
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: counts.total, icon: Trophy, color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Pending', value: counts.pending, icon: Clock, color: 'text-amber-600 bg-amber-50' },
            { label: 'Terverifikasi', value: counts.verified, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Ditolak', value: counts.rejected, icon: XCircle, color: 'text-red-600 bg-red-50' },
          ].map(stat => (
            <div key={stat.label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}><stat.icon size={18} /></div>
              <div><p className="text-2xl font-bold text-slate-800">{stat.value}</p><p className="text-xs text-slate-500">{stat.label}</p></div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="card p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="search" placeholder="Cari nama mahasiswa atau judul prestasi…" value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-sm" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-slate-400" />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as StatusFilter)} className="input-field py-2 text-sm w-auto min-w-[130px]">
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="verified">Terverifikasi</option>
                <option value="rejected">Ditolak</option>
              </select>
              <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="input-field py-2 text-sm w-auto min-w-[130px]">
                <option value="all">Semua Tingkat</option>
                {levels.map(l => <option key={l!} value={l!}>{l}</option>)}
              </select>
            </div>
            <p className="text-xs text-slate-500 ml-auto">Menampilkan <span className="font-semibold text-slate-700">{filtered.length}</span> dari {data.length}</p>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="card p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="animate-pulse flex gap-4"><div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-3.5 bg-slate-200 rounded w-3/4" /><div className="h-3 bg-slate-100 rounded w-1/2" /></div></div>)}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mahasiswa</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Prestasi</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tingkat</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center">
                    <Users size={36} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Tidak ada prestasi ditemukan</p>
                  </td></tr>
                ) : filtered.map(item => {
                  const sc = statusCfg[item.status];
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(item.users?.name || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{item.users?.name || '—'}</p>
                            <p className="text-xs text-slate-500">{item.users?.nim || item.users?.email || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {item.proof_url && item.proof_url.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50">
                              <img src={item.proof_url} alt="Prestasi" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                              <Trophy size={14} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 line-clamp-1">{item.title}</p>
                            {item.competitions?.title && <p className="text-xs text-slate-500 truncate">{item.competitions.title}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {item.category ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">{item.category}</span> : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        {item.competition_level ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700">{item.competition_level}</span> : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setDetailItem(item)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors" title="Detail"><Eye size={14} /></button>
                          <button onClick={() => openEditModal(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteRequest(item)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><Trash2 size={14} /></button>
                          {item.proof_url && (
                            <a href={item.proof_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Lihat Bukti"><ExternalLink size={14} /></a>
                          )}
                          {canVerify && (
                            <>
                              {item.status === 'pending' && (
                                <>
                                  <button onClick={() => handleVerify(item.id, 'verified')} disabled={processing === item.id} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50" title="Setujui"><CheckCircle size={14} /></button>
                                  <button onClick={() => handleVerify(item.id, 'rejected')} disabled={processing === item.id} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50" title="Tolak"><XCircle size={14} /></button>
                                </>
                              )}
                              {item.status === 'verified' && (
                                <button onClick={() => handleVerify(item.id, 'rejected')} disabled={processing === item.id} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50" title="Batalkan">
                                  <XCircle size={14} />
                                </button>
                              )}
                              {item.status === 'rejected' && (
                                <button onClick={() => handleVerify(item.id, 'verified')} disabled={processing === item.id} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50" title="Setujui">
                                  <CheckCircle size={14} />
                                </button>
                              )}
                            </>
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

        {/* Detail Modal */}
        {detailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setDetailItem(null)}>
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
              {/* Image Header */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                {detailItem.proof_url && detailItem.proof_url.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                  <img src={detailItem.proof_url} alt={detailItem.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-slate-100">
                    <Trophy size={48} className="mb-2 opacity-20" />
                    <p className="text-xs font-medium uppercase tracking-widest opacity-50">Pratinjau Foto Tidak Tersedia</p>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <button onClick={() => setDetailItem(null)} className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md flex items-center justify-center transition-colors">✕</button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 text-white backdrop-blur-md mb-2 ${statusCfg[detailItem.status].dot.replace('bg-', 'bg-')}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg[detailItem.status].dot}`} />{statusCfg[detailItem.status].label}
                  </span>
                  <h3 className="text-xl font-bold text-white line-clamp-2">{detailItem.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                      {(detailItem.users?.name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{detailItem.users?.name}</p>
                      <p className="text-xs text-slate-500">{detailItem.users?.nim || detailItem.users?.email} · {detailItem.users?.major || 'Mahasiswa'}</p>
                    </div>
                  </div>
                  <Link 
                    href={`/mahasiswa?search=${detailItem.users?.nim || detailItem.users?.name}`}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100 group"
                    title="Edit Profil Mahasiswa"
                  >
                    <Edit size={16} className="group-hover:scale-110 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kategori</p>
                    <p className="text-sm font-semibold text-slate-700">{detailItem.category || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tingkat</p>
                    <p className="text-sm font-semibold text-slate-700 capitalize">{detailItem.competition_level || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tahun</p>
                    <p className="text-sm font-semibold text-slate-700">{detailItem.year || new Date(detailItem.created_at).getFullYear()}</p>
                  </div>
                </div>

                {detailItem.description && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Deskripsi</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{detailItem.description}</p>
                  </div>
                )}

                {detailItem.document_url ? (
                  <div className="pt-4 border-t border-slate-100">
                    <a 
                      href={detailItem.document_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
                    >
                      <ExternalLink size={16} /> Lihat Dokumen Bukti Asli
                    </a>
                  </div>
                ) : detailItem.proof_url && (
                  <div className="pt-4 border-t border-slate-100">
                    <a 
                      href={detailItem.proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
                    >
                      <ExternalLink size={16} /> Lihat Dokumen/Foto Bukti
                    </a>
                  </div>
                )}

                {canVerify && detailItem.status === 'pending' && (
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => handleVerify(detailItem.id, 'rejected')} disabled={processing === detailItem.id} className="flex-1 py-3 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                      <XCircle size={18} /> Tolak
                    </button>
                    <button onClick={() => handleVerify(detailItem.id, 'verified')} disabled={processing === detailItem.id} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2">
                      <CheckCircle size={18} /> Setujui
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Analytics section */}
        <div className="mt-6 card p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-indigo-600" />
            <h3 className="font-bold text-slate-800">Analitik Prestasi</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Akademik', 'Non-Akademik'].map(cat => {
              const count = data.filter(d => d.category === cat && d.status === 'verified').length;
              const total = data.filter(d => d.status === 'verified').length || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={cat} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-2">{cat}</p>
                  <p className="text-2xl font-bold text-slate-800">{count}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{pct}% dari verified</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {modalMode === 'edit' ? 'Edit Data Prestasi' : 'Tambah Prestasi Baru'}
                  </h2>
                  <p className="text-sm text-slate-500">{modalMode === 'edit' ? 'Perbarui informasi pencapaian mahasiswa.' : 'Catat prestasi mahasiswa baru ke dalam sistem.'}</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">✕</button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
                <form id="achievement-form" onSubmit={handleModalSubmit} className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-tight">Data Mahasiswa</label>
                    {modalMode === 'add' && (
                      <button 
                        type="button" 
                        onClick={() => setModalForm(p => ({...p, isNewStudent: !p.isNewStudent}))}
                        className="text-[10px] font-bold text-indigo-600 hover:underline"
                      >
                        {modalForm.isNewStudent ? 'Pilih Mahasiswa Terdaftar' : 'Mahasiswa Belum Terdaftar?'}
                      </button>
                    )}
                    {modalMode === 'edit' && modalForm.user_id && (
                      <Link 
                        href={`/mahasiswa?search=${modalForm.user_id}`}
                        className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink size={10} /> Edit Profil Mahasiswa
                      </Link>
                    )}
                  </div>

                  {modalForm.isNewStudent ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <input 
                          type="text" 
                          placeholder="Nama Lengkap Mahasiswa" 
                          value={modalForm.newName}
                          onChange={e => setModalForm(p => ({...p, newName: e.target.value}))}
                          className="input-field py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <input 
                          type="text" 
                          placeholder="NIM" 
                          value={modalForm.newNim}
                          onChange={e => setModalForm(p => ({...p, newNim: e.target.value}))}
                          className="input-field py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <input 
                          type="text" 
                          placeholder="Program Studi" 
                          value={modalForm.newMajor}
                          onChange={e => setModalForm(p => ({...p, newMajor: e.target.value}))}
                          className="input-field py-2 text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <select 
                      value={modalForm.user_id} 
                      onChange={e => setModalForm(p => ({...p, user_id: e.target.value}))}
                      className="input-field py-2.5 text-sm bg-white"
                      required
                      disabled={modalMode === 'edit'}
                    >
                      <option value="">— Pilih Mahasiswa —</option>
                      {usersList.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.nim})</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul Prestasi *</label>
                  <input 
                    type="text"
                    value={modalForm.title}
                    onChange={e => setModalForm(p => ({...p, title: e.target.value}))}
                    className="input-field py-2.5 text-sm"
                    placeholder="Contoh: Juara 1 Nasional..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kategori *</label>
                  <select 
                    value={modalForm.category}
                    onChange={e => setModalForm(p => ({...p, category: e.target.value}))}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Non-Akademik">Non-Akademik</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Sains">Sains</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tingkat *</label>
                    <select 
                      value={modalForm.competition_level}
                      onChange={e => setModalForm(p => ({...p, competition_level: e.target.value}))}
                      className="input-field py-2.5 text-sm"
                    >
                      <option value="kampus">Kampus</option>
                      <option value="nasional">Nasional</option>
                      <option value="internasional">Internasional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Capaian</label>
                    <input 
                      type="text"
                      value={modalForm.rank === '0' ? '' : modalForm.rank}
                      onChange={e => setModalForm(p => ({...p, rank: e.target.value}))}
                      className="input-field py-2.5 text-sm"
                      placeholder="Juara 1, dll"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tahun</label>
                    <input 
                      type="text"
                      value={modalForm.year}
                      onChange={e => setModalForm(p => ({...p, year: e.target.value}))}
                      className="input-field py-2.5 text-sm"
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Deskripsi Lengkap</label>
                  <textarea 
                    value={modalForm.description}
                    onChange={e => setModalForm(p => ({...p, description: e.target.value}))}
                    className="input-field py-2.5 text-sm min-h-[100px] resize-none"
                    placeholder="Tuliskan detail prestasi. Gunakan format [Nama Tombol][https://link-anda.com] untuk menambahkan tombol link (contoh: [Dokumentasi][https://drive.google.com/xyz])."
                  />
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                    *Gunakan format <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono">[Nama Tombol][URL]</code> untuk memunculkan tombol eksternal. Teks ini tidak akan terlihat di deskripsi.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Foto / Bukti Prestasi</label>
                  <div className="space-y-3">
                    {/* File Upload Area */}
                    <div className="relative group border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl bg-slate-50 transition-colors overflow-hidden aspect-video flex flex-col items-center justify-center">
                      {previewUrl ? (
                        <div className="absolute inset-0 w-full h-full">
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-bold">Klik untuk ganti foto</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                          <p className="text-xs text-slate-500 font-medium">Klik atau seret foto ke sini</p>
                          <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, max 5MB</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status Verifikasi</label>
                  <select 
                    value={modalForm.status}
                    onChange={e => setModalForm(p => ({...p, status: e.target.value as Achievement['status']}))}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="pending">Menunggu Verifikasi</option>
                    <option value="verified">Terverifikasi (Tampil di Landing)</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>
                </form>
              </div>

              {/* Modal Footer (Fixed) */}
              <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  form="achievement-form"
                  type="submit"
                  disabled={!!processing || uploading}
                  className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-60"
                >
                  {processing === 'modal' ? (
                    <><Loader2 size={16} className="animate-spin" /> Menyimpan...</>
                  ) : uploading ? (
                    <><Loader2 size={16} className="animate-spin" /> Mengunggah Foto...</>
                  ) : (
                    <>Simpan Perubahan</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
              onClick={() => setDeleteConfirm(null)} 
            />
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-inner">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Hapus Prestasi?</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">
                  Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-700 italic">"{deleteConfirm.title}"</span>? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={confirmDelete}
                    disabled={!!processing}
                    className="w-full py-4 rounded-2xl bg-red-500 text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {processing === deleteConfirm.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        MENGHAPUS...
                      </div>
                    ) : (
                      'YA, HAPUS SEKARANG'
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="w-full py-4 rounded-2xl bg-slate-50 text-slate-500 text-sm font-bold hover:bg-slate-100 transition-all active:scale-95"
                  >
                    TIDAK, BATALKAN
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </AppLayout>
  );
}