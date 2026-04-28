'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Swords, Clock, Trophy, ExternalLink, FileText, ClipboardList, Users, Pencil, Trash2, Plus, CheckCircle2, Calendar, Building2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LombaFormModal from '../components/LombaFormModal';
import { createClient } from '@/lib/supabase/client';
import type { Lomba } from '../page';

interface Registration {
  id: string;
  user_id: string;
  competition_id: string;
  status: string;
  nama_tim: string | null;
  catatan: string | null;
  created_at: string;
  users: {
    name: string;
    email: string;
    nim: string | null;
  } | null;
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: 'Aktif', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  closed: { label: 'Tutup', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  archived: { label: 'Diarsipkan', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  expired: { label: 'Kedaluwarsa', color: 'bg-red-100 text-red-600', dot: 'bg-red-400' },
};

const regStatusConfig: Record<string, { label: string; color: string }> = {
  registered: { label: 'Terdaftar', color: 'bg-blue-100 text-blue-700' },
  attended: { label: 'Hadir', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-600' },
};

export default function LombaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const id = params.id as string;

  const [lomba, setLomba] = useState<Lomba | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'syarat' | 'cara' | 'peserta'>('info');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteRegTarget, setDeleteRegTarget] = useState<string | null>(null);
  const [deleteRegLoading, setDeleteRegLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: comp }, { data: regs }] = await Promise.all([
      supabase.from('competitions').select('*').eq('id', id).single(),
      supabase.from('registrations').select('*, users(name, email, nim)').eq('competition_id', id).order('created_at', { ascending: false }),
    ]);
    if (comp) setLomba(comp as Lomba);
    if (regs) setRegistrations(regs as Registration[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    const { error } = await supabase.from('competitions').delete().eq('id', id);
    if (error) {
      toast.error('Gagal menghapus lomba');
    } else {
      toast.success('Lomba berhasil dihapus');
      router.push('/lomba-management');
    }
    setDeleteLoading(false);
  };

  const handleDeleteReg = async () => {
    if (!deleteRegTarget) return;
    setDeleteRegLoading(true);
    const { error } = await supabase.from('registrations').delete().eq('id', deleteRegTarget);
    if (error) {
      toast.error('Gagal menghapus pendaftar');
    } else {
      setRegistrations(prev => prev.filter(r => r.id !== deleteRegTarget));
      toast.success('Pendaftar berhasil dihapus');
    }
    setDeleteRegLoading(false);
    setDeleteRegTarget(null);
  };

  const handleUpdateRegStatus = async (regId: string, newStatus: string) => {
    const { error } = await supabase.from('registrations').update({ status: newStatus }).eq('id', regId);
    if (error) {
      toast.error('Gagal memperbarui status');
    } else {
      setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: newStatus } : r));
      toast.success('Status pendaftar diperbarui');
    }
  };

  if (loading) {
    return (
      <AppLayout activePath="/lomba-management">
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="card p-6 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-2/3" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            <div className="h-24 bg-slate-100 rounded" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!lomba) {
    return (
      <AppLayout activePath="/lomba-management">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Swords size={48} className="text-slate-300" />
          <p className="text-slate-500 font-medium">Lomba tidak ditemukan</p>
          <button onClick={() => router.push('/lomba-management')} className="btn-primary">Kembali ke Daftar Lomba</button>
        </div>
      </AppLayout>
    );
  }

  const sc = statusConfig[lomba.status] || statusConfig.active;
  const tabs = [
    { key: 'info', label: 'Informasi', icon: FileText },
    { key: 'syarat', label: 'Syarat & Ketentuan', icon: ClipboardList },
    { key: 'cara', label: 'Cara Pendaftaran', icon: CheckCircle2 },
    { key: 'peserta', label: `Peserta (${registrations.length})`, icon: Users },
  ] as const;

  return (
    <AppLayout activePath="/lomba-management">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/lomba-management')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16} />
            Manajemen Lomba
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-700 font-medium truncate max-w-xs">{lomba.title}</span>
        </div>

        {/* Hero Card */}
        <div className="card p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Swords size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${sc.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                  {lomba.kategori && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{lomba.kategori}</span>}
                  {lomba.tingkat && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">{lomba.tingkat}</span>}
                </div>
                <h1 className="text-xl font-bold text-slate-800">{lomba.title}</h1>
                <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <Building2 size={13} />
                  {lomba.organizer || 'Penyelenggara tidak diketahui'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lomba.link && (
                <a href={lomba.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <ExternalLink size={14} />
                  Link Resmi
                </a>
              )}
              <button onClick={() => setEditOpen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-semibold hover:bg-indigo-100 transition-colors">
                <Pencil size={14} />
                Edit
              </button>
              <button onClick={() => setDeleteOpen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors">
                <Trash2 size={14} />
                Hapus
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-orange-500" />
              <div>
                <p className="text-xs text-slate-500">Deadline</p>
                <p className="text-sm font-semibold text-slate-700">
                  {lomba.deadline ? new Date(lomba.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" />
              <div>
                <p className="text-xs text-slate-500">Tanggal Mulai</p>
                <p className="text-sm font-semibold text-slate-700">{lomba.tanggal_mulai || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-500" />
              <div>
                <p className="text-xs text-slate-500">Hadiah</p>
                <p className="text-sm font-semibold text-slate-700 truncate max-w-[120px]">{lomba.prize || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-indigo-500" />
              <div>
                <p className="text-xs text-slate-500">Pendaftar</p>
                <p className="text-sm font-semibold text-slate-700">{registrations.length} mahasiswa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-700' :'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800">Deskripsi Lomba</h2>
            {lomba.description ? (
              <p className="text-sm text-slate-600 leading-relaxed">{lomba.description}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">Belum ada deskripsi.</p>
            )}
          </div>
        )}

        {activeTab === 'syarat' && (
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Syarat & Ketentuan</h2>
              <button onClick={() => setEditOpen(true)} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                <Pencil size={12} /> Edit
              </button>
            </div>
            {lomba.syarat_ketentuan ? (
              <div className="space-y-2">
                {lomba.syarat_ketentuan.split('\n').filter(Boolean).map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-slate-700 leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <ClipboardList size={36} className="text-slate-300" />
                <p className="text-slate-400 text-sm">Belum ada syarat & ketentuan.</p>
                <button onClick={() => setEditOpen(true)} className="btn-primary text-sm">
                  <Plus size={14} /> Tambahkan Syarat & Ketentuan
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cara' && (
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Cara Pendaftaran</h2>
              <button onClick={() => setEditOpen(true)} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                <Pencil size={12} /> Edit
              </button>
            </div>
            {lomba.cara_pendaftaran ? (
              <div className="space-y-3">
                {lomba.cara_pendaftaran.split('\n').filter(Boolean).map((line, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{line.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <CheckCircle2 size={36} className="text-slate-300" />
                <p className="text-slate-400 text-sm">Belum ada cara pendaftaran.</p>
                <button onClick={() => setEditOpen(true)} className="btn-primary text-sm">
                  <Plus size={14} /> Tambahkan Cara Pendaftaran
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'peserta' && (
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800">Daftar Pendaftar</h2>
                <p className="text-xs text-slate-500 mt-0.5">{registrations.length} mahasiswa terdaftar</p>
              </div>
            </div>
            {registrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Users size={40} className="text-slate-300" />
                <p className="text-slate-400 text-sm font-medium">Belum ada mahasiswa yang mendaftar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mahasiswa</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">NIM</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Nama Tim</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tanggal Daftar</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {registrations.map(reg => {
                      const rs = regStatusConfig[reg.status] || regStatusConfig.registered;
                      return (
                        <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                {(reg.users?.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">{reg.users?.name || 'Unknown'}</p>
                                <p className="text-xs text-slate-500">{reg.users?.email || '—'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600">{reg.users?.nim || '—'}</td>
                          <td className="px-4 py-3 text-xs text-slate-600">{reg.nama_tim || '—'}</td>
                          <td className="px-4 py-3 text-xs text-slate-600">
                            {new Date(reg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={reg.status}
                              onChange={e => handleUpdateRegStatus(reg.id, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer ${rs.color}`}
                            >
                              <option value="registered">Terdaftar</option>
                              <option value="attended">Hadir</option>
                              <option value="cancelled">Dibatalkan</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => setDeleteRegTarget(reg.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Hapus">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {lomba && (
        <LombaFormModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={item => { setLomba(item); setEditOpen(false); }}
          editItem={lomba}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus Lomba"
        description="Apakah Anda yakin ingin menghapus lomba ini? Semua data pendaftaran terkait juga akan dihapus."
        confirmLabel="Hapus"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />

      <ConfirmDialog
        open={!!deleteRegTarget}
        title="Hapus Pendaftar"
        description="Apakah Anda yakin ingin menghapus pendaftar ini dari lomba?"
        confirmLabel="Hapus"
        loading={deleteRegLoading}
        onConfirm={handleDeleteReg}
        onClose={() => setDeleteRegTarget(null)}
      />
    </AppLayout>
  );
}
