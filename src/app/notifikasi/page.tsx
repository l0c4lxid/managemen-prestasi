'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Bell, CheckCheck, Trash2, Trophy, Swords, CalendarDays, Users, Info, CheckCircle, Clock, Search,  } from 'lucide-react';

type NotifType = 'prestasi' | 'lomba' | 'event' | 'sistem' | 'mahasiswa';
type NotifPriority = 'high' | 'medium' | 'low';

interface Notifikasi {
  id: string;
  judul: string;
  pesan: string;
  tipe: NotifType;
  prioritas: NotifPriority;
  waktu: string;
  dibaca: boolean;
}

const mockNotif: Notifikasi[] = [
  { id: 'n-001', judul: 'Prestasi Baru Menunggu Verifikasi', pesan: 'Andi Pratama mengajukan prestasi "Juara 1 PKM Nasional 2026" dan menunggu verifikasi admin.', tipe: 'prestasi', prioritas: 'high', waktu: '5 menit lalu', dibaca: false },
  { id: 'n-002', judul: 'Deadline Lomba Mendekat', pesan: 'Lomba "Olimpiade Sains Mahasiswa — Matematika" akan berakhir dalam 3 hari (5 Mei 2026).', tipe: 'lomba', prioritas: 'high', waktu: '1 jam lalu', dibaca: false },
  { id: 'n-003', judul: 'Event Baru Ditambahkan', pesan: 'Event "Workshop AI & Machine Learning 2026" telah ditambahkan oleh Budi Santoso. Segera tinjau.', tipe: 'event', prioritas: 'medium', waktu: '3 jam lalu', dibaca: false },
  { id: 'n-004', judul: '3 Prestasi Berhasil Diverifikasi', pesan: 'Prestasi milik Siti Rahayu, Dewi Lestari, dan Hendra Wijaya telah berhasil diverifikasi.', tipe: 'prestasi', prioritas: 'medium', waktu: '5 jam lalu', dibaca: false },
  { id: 'n-005', judul: 'Mahasiswa Baru Terdaftar', pesan: '12 mahasiswa baru dari angkatan 2023 telah berhasil mendaftarkan akun mereka di platform.', tipe: 'mahasiswa', prioritas: 'low', waktu: '1 hari lalu', dibaca: true },
  { id: 'n-006', judul: 'Pembaruan Sistem', pesan: 'Sistem akan menjalani pemeliharaan terjadwal pada Minggu, 21 April 2026 pukul 02.00–04.00 WIB.', tipe: 'sistem', prioritas: 'medium', waktu: '1 hari lalu', dibaca: true },
  { id: 'n-007', judul: 'Prestasi Ditolak — Perlu Revisi', pesan: 'Prestasi "Juara 2 Debat Nasional" milik Fajar Kurniawan ditolak karena dokumen tidak lengkap.', tipe: 'prestasi', prioritas: 'high', waktu: '2 hari lalu', dibaca: true },
  { id: 'n-008', judul: 'Lomba Baru Tersedia', pesan: 'Lomba "International Business Plan Competition" dari NUS Business School telah ditambahkan.', tipe: 'lomba', prioritas: 'low', waktu: '3 hari lalu', dibaca: true },
  { id: 'n-009', judul: 'Laporan Bulanan Siap', pesan: 'Laporan prestasi bulan Maret 2026 telah selesai digenerate dan siap untuk diunduh.', tipe: 'sistem', prioritas: 'low', waktu: '4 hari lalu', dibaca: true },
  { id: 'n-010', judul: 'Event Akan Segera Dimulai', pesan: 'Event "Seminar Kewirausahaan Digital 2026" akan dimulai besok pukul 09.00 WIB. Pastikan persiapan sudah matang.', tipe: 'event', prioritas: 'medium', waktu: '5 hari lalu', dibaca: true },
  { id: 'n-011', judul: 'Kuota Lomba Hampir Penuh', pesan: 'Lomba "National Robotics Championship 2026" sudah terisi 90% kuota. Segera informasikan ke mahasiswa.', tipe: 'lomba', prioritas: 'medium', waktu: '6 hari lalu', dibaca: true },
  { id: 'n-012', judul: 'Backup Data Berhasil', pesan: 'Backup data sistem telah berhasil dilakukan secara otomatis pada 13 April 2026 pukul 00.00 WIB.', tipe: 'sistem', prioritas: 'low', waktu: '1 minggu lalu', dibaca: true },
];

const tipeConfig: Record<NotifType, { icon: React.ReactNode; bg: string; color: string; label: string }> = {
  prestasi: { icon: <Trophy size={16} />, bg: 'bg-amber-50', color: 'text-amber-600', label: 'Prestasi' },
  lomba: { icon: <Swords size={16} />, bg: 'bg-indigo-50', color: 'text-indigo-600', label: 'Lomba' },
  event: { icon: <CalendarDays size={16} />, bg: 'bg-cyan-50', color: 'text-cyan-600', label: 'Event' },
  mahasiswa: { icon: <Users size={16} />, bg: 'bg-emerald-50', color: 'text-emerald-600', label: 'Mahasiswa' },
  sistem: { icon: <Info size={16} />, bg: 'bg-slate-100', color: 'text-slate-500', label: 'Sistem' },
};

const prioritasConfig: Record<NotifPriority, { dot: string; label: string }> = {
  high: { dot: 'bg-red-500', label: 'Penting' },
  medium: { dot: 'bg-amber-400', label: 'Sedang' },
  low: { dot: 'bg-slate-300', label: 'Rendah' },
};

export default function NotifikasiPage() {
  const [notifs, setNotifs] = useState<Notifikasi[]>(mockNotif);
  const [filterTipe, setFilterTipe] = useState<NotifType | 'all'>('all');
  const [filterBaca, setFilterBaca] = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch] = useState('');

  const filtered = notifs.filter(n => {
    if (filterTipe !== 'all' && n.tipe !== filterTipe) return false;
    if (filterBaca === 'unread' && n.dibaca) return false;
    if (filterBaca === 'read' && !n.dibaca) return false;
    if (search && !n.judul.toLowerCase().includes(search.toLowerCase()) && !n.pesan.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notifs.filter(n => !n.dibaca).length;

  const markAsRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, dibaca: true } : n));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, dibaca: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

  const clearRead = () => {
    setNotifs(prev => prev.filter(n => !n.dibaca));
  };

  return (
    <AppLayout activePath="/notifikasi">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Notifikasi</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold">{unreadCount} baru</span>
              )}
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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {([['all', 'Semua', notifs.length, 'bg-slate-100', 'text-slate-700']] as [NotifType | 'all', string, number, string, string][]).concat(
            (Object.entries(tipeConfig) as [NotifType, typeof tipeConfig[NotifType]][]).map(([k, v]) => [k, v.label, notifs.filter(n => n.tipe === k).length, v.bg, v.color])
          ).map(([key, label, count, bg, color]) => (
            <button key={String(key)} onClick={() => setFilterTipe(key as NotifType | 'all')} className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all text-left ${filterTipe === key ? 'border-indigo-200 bg-indigo-50 shadow-sm' : 'border-slate-100 bg-white hover:bg-slate-50'}`}>
              <span className={`text-sm font-semibold ${filterTipe === key ? 'text-indigo-700' : 'text-slate-600'}`}>{label}</span>
              <span className={`text-lg font-bold ${filterTipe === key ? 'text-indigo-600' : color}`}>{count}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari notifikasi..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <select value={filterBaca} onChange={e => setFilterBaca(e.target.value as 'all' | 'unread' | 'read')} className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            <option value="all">Semua</option>
            <option value="unread">Belum Dibaca</option>
            <option value="read">Sudah Dibaca</option>
          </select>
        </div>

        {/* Notification list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Bell size={24} className="text-slate-400" />
              </div>
              <p className="font-semibold text-slate-600">Tidak ada notifikasi</p>
              <p className="text-sm text-slate-400">Semua notifikasi sudah dibaca atau tidak ada yang sesuai filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map(notif => {
                const tc = tipeConfig[notif.tipe];
                const pc = prioritasConfig[notif.prioritas];
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors cursor-pointer group ${!notif.dibaca ? 'bg-indigo-50/30' : ''}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${tc.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <span className={tc.color}>{tc.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-semibold ${!notif.dibaca ? 'text-slate-900' : 'text-slate-700'}`}>{notif.judul}</p>
                          {!notif.dibaca && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.dibaca && (
                            <button onClick={e => { e.stopPropagation(); markAsRead(notif.id); }} className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Tandai dibaca">
                              <CheckCircle size={14} />
                            </button>
                          )}
                          <button onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Hapus">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.pesan}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${tc.bg} ${tc.color}`}>
                          {tc.label}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />{pc.label}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock size={10} />{notif.waktu}
                        </span>
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
