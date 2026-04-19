'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, Pencil, Trash2, Plus, CheckCircle2, FileText, ClipboardList, ExternalLink, Mic2, Building2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EventFormModal from '../components/EventFormModal';
import { createClient } from '../../../lib/supabase/client';
import type { EventItem } from '../page';

interface Registration {
  id: string;
  user_id: string;
  event_id: string;
  status: string;
  created_at: string;
  users: {
    name: string;
    email: string;
    nim: string | null;
  } | null;
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  upcoming: { label: 'Akan Datang', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  ongoing: { label: 'Berlangsung', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  done: { label: 'Selesai', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
};

const regStatusConfig: Record<string, { label: string; color: string }> = {
  registered: { label: 'Terdaftar', color: 'bg-blue-100 text-blue-700' },
  attended: { label: 'Hadir', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-600' },
};

const tipeColors: Record<string, string> = {
  Workshop: 'bg-indigo-100 text-indigo-700',
  Seminar: 'bg-emerald-100 text-emerald-700',
  Pelatihan: 'bg-cyan-100 text-cyan-700',
  Coaching: 'bg-purple-100 text-purple-700',
  Webinar: 'bg-amber-100 text-amber-700',
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const id = params.id as string;

  const [event, setEvent] = useState<EventItem | null>(null);
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
    const [{ data: evt }, { data: regs }] = await Promise.all([
      supabase.from('events').select('*').eq('id', id).single(),
      supabase.from('registrations').select('*, users(name, email, nim)').eq('event_id', id).order('created_at', { ascending: false }),
    ]);
    if (evt) setEvent(evt as EventItem);
    if (regs) setRegistrations(regs as Registration[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      toast.error('Gagal menghapus event');
    } else {
      toast.success('Event berhasil dihapus');
      router.push('/event-management');
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
      toast.success('Status peserta diperbarui');
    }
  };

  if (loading) {
    return (
      <AppLayout activePath="/event-management">
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="card p-6 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-2/3" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!event) {
    return (
      <AppLayout activePath="/event-management">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <CalendarDays size={48} className="text-slate-300" />
          <p className="text-slate-500 font-medium">Event tidak ditemukan</p>
          <button onClick={() => router.push('/event-management')} className="btn-primary">Kembali ke Daftar Event</button>
        </div>
      </AppLayout>
    );
  }

  const sc = statusConfig[event.status || 'upcoming'] || statusConfig.upcoming;
  const tabs = [
    { key: 'info', label: 'Informasi', icon: FileText },
    { key: 'syarat', label: 'Syarat & Ketentuan', icon: ClipboardList },
    { key: 'cara', label: 'Cara Pendaftaran', icon: CheckCircle2 },
    { key: 'peserta', label: `Peserta (${registrations.length})`, icon: Users },
  ] as const;

  return (
    <AppLayout activePath="/event-management">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/event-management')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-cyan-600 transition-colors">
            <ArrowLeft size={16} />
            Manajemen Event
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-700 font-medium truncate max-w-xs">{event.title}</span>
        </div>

        {/* Hero Card */}
        <div className="card p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                <CalendarDays size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${sc.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                  {event.type && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tipeColors[event.type] || 'bg-slate-100 text-slate-600'}`}>
                      {event.type}
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold text-slate-800">{event.title}</h1>
                {event.mentor && (
                  <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Mic2 size={13} />
                    {event.mentor}
                    {event.mentor_role && <span className="text-slate-400">— {event.mentor_role}</span>}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {event.link_pendaftaran && (
                <a href={event.link_pendaftaran} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <ExternalLink size={14} />
                  Link Daftar
                </a>
              )}
              <button onClick={() => setEditOpen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-50 text-cyan-700 text-sm font-semibold hover:bg-cyan-100 transition-colors">
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
              <Clock size={16} className="text-cyan-500" />
              <div>
                <p className="text-xs text-slate-500">Tanggal</p>
                <p className="text-sm font-semibold text-slate-700">
                  {event.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-purple-500" />
              <div>
                <p className="text-xs text-slate-500">Waktu</p>
                <p className="text-sm font-semibold text-slate-700">{event.time || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-rose-500" />
              <div>
                <p className="text-xs text-slate-500">Lokasi</p>
                <p className="text-sm font-semibold text-slate-700 truncate max-w-[120px]">{event.location || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-indigo-500" />
              <div>
                <p className="text-xs text-slate-500">Peserta / Kuota</p>
                <p className="text-sm font-semibold text-slate-700">{registrations.length} / {event.quota}</p>
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
                  ? 'border-cyan-600 text-cyan-700' :'border-transparent text-slate-500 hover:text-slate-700'
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
            <h2 className="text-base font-bold text-slate-800">Deskripsi Event</h2>
            {event.description ? (
              <p className="text-sm text-slate-600 leading-relaxed">{event.description}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">Belum ada deskripsi.</p>
            )}
            {event.institusi_narasumber && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Building2 size={14} className="text-slate-400" />
                <span className="text-sm text-slate-600">{event.institusi_narasumber}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'syarat' && (
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Syarat & Ketentuan</h2>
              <button onClick={() => setEditOpen(true)} className="flex items-center gap-1.5 text-xs text-cyan-600 hover:text-cyan-800 font-semibold transition-colors">
                <Pencil size={12} /> Edit
              </button>
            </div>
            {event.syarat_ketentuan ? (
              <div className="space-y-2">
                {event.syarat_ketentuan.split('\n').filter(Boolean).map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
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
              <button onClick={() => setEditOpen(true)} className="flex items-center gap-1.5 text-xs text-cyan-600 hover:text-cyan-800 font-semibold transition-colors">
                <Pencil size={12} /> Edit
              </button>
            </div>
            {event.cara_pendaftaran ? (
              <div className="space-y-3">
                {event.cara_pendaftaran.split('\n').filter(Boolean).map((line, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-7 h-7 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
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
                <h2 className="text-base font-bold text-slate-800">Daftar Peserta</h2>
                <p className="text-xs text-slate-500 mt-0.5">{registrations.length} dari {event.quota} kuota terisi</p>
              </div>
              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (registrations.length / event.quota) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{Math.round((registrations.length / event.quota) * 100)}%</span>
              </div>
            </div>
            {registrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Users size={40} className="text-slate-300" />
                <p className="text-slate-400 text-sm font-medium">Belum ada peserta yang mendaftar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mahasiswa</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">NIM</th>
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
                              <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-xs">
                                {(reg.users?.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">{reg.users?.name || 'Unknown'}</p>
                                <p className="text-xs text-slate-500">{reg.users?.email || '—'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600">{reg.users?.nim || '—'}</td>
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

      {event && (
        <EventFormModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={item => { setEvent(item); setEditOpen(false); }}
          editItem={event}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus Event"
        description="Apakah Anda yakin ingin menghapus event ini? Semua data peserta terkait juga akan dihapus."
        confirmLabel="Hapus"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      <ConfirmDialog
        open={!!deleteRegTarget}
        title="Hapus Peserta"
        description="Apakah Anda yakin ingin menghapus peserta ini dari event?"
        confirmLabel="Hapus"
        variant="danger"
        loading={deleteRegLoading}
        onConfirm={handleDeleteReg}
        onCancel={() => setDeleteRegTarget(null)}
      />
    </AppLayout>
  );
}
