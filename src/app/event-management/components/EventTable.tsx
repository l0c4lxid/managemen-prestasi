'use client';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Search, Plus, Pencil, Trash2, Eye, Filter, MapPin, Users,
  Download, RefreshCw, CalendarDays, ChevronUp, ChevronDown, ChevronsUpDown,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EventFormModal from './EventFormModal';
import EmptyState from '@/components/ui/EmptyState';

export type EventStatus = 'upcoming' | 'ongoing' | 'done';
export type EventTipe = 'Workshop' | 'Seminar' | 'Pelatihan' | 'Coaching' | 'Webinar';

export interface Event {
  id: string;
  nama: string;
  tipe: EventTipe;
  tanggal: string;
  waktu: string;
  lokasi: string;
  narasumber: string;
  institusiNarasumber: string;
  kapasitas: number;
  pendaftar: number;
  status: EventStatus;
  deskripsi: string;
  linkPendaftaran: string;
}

const mockEvents: Event[] = [
  { id: 'evt-001', nama: 'Workshop Penulisan Proposal PKM 2026', tipe: 'Workshop', tanggal: '26 Apr 2026', waktu: '08:00 – 15:00', lokasi: 'Aula Rektorat Lt. 3', narasumber: 'Dr. Haris Setiawan, M.Pd.', institusiNarasumber: 'UNS Surakarta', kapasitas: 60, pendaftar: 45, status: 'upcoming', deskripsi: 'Workshop intensif penulisan proposal PKM untuk mahasiswa yang ingin mengikuti PIMNAS.', linkPendaftaran: 'https://bit.ly/pkm-workshop' },
  { id: 'evt-002', nama: 'Seminar Kewirausahaan Digital 2026', tipe: 'Seminar', tanggal: '3 Mei 2026', waktu: '09:00 – 12:00', lokasi: 'Gedung Serbaguna Kampus A', narasumber: 'Budi Santoso', institusiNarasumber: 'CEO Tokopangan', kapasitas: 150, pendaftar: 112, status: 'upcoming', deskripsi: 'Seminar kewirausahaan digital bersama praktisi bisnis sukses.', linkPendaftaran: 'https://bit.ly/seminar-wirausaha' },
  { id: 'evt-003', nama: 'Pelatihan Desain UI/UX Figma Advanced', tipe: 'Pelatihan', tanggal: '10 Mei 2026', waktu: '13:00 – 17:00', lokasi: 'Lab Komputer Teknik Lt. 2', narasumber: 'Anisa Rahmawati', institusiNarasumber: 'Lead Designer — Gojek', kapasitas: 30, pendaftar: 28, status: 'upcoming', deskripsi: 'Pelatihan desain UI/UX menggunakan Figma untuk level advanced.', linkPendaftaran: 'https://bit.ly/figma-training' },
  { id: 'evt-004', nama: 'Coaching Clinic Persiapan Lomba Nasional', tipe: 'Coaching', tanggal: '17 Mei 2026', waktu: '10:00 – 12:00', lokasi: 'Online via Zoom', narasumber: 'Tim Kemahasiswaan UNS', institusiNarasumber: 'UNS Surakarta', kapasitas: 100, pendaftar: 67, status: 'upcoming', deskripsi: 'Coaching clinic untuk mahasiswa yang akan mengikuti lomba tingkat nasional.', linkPendaftaran: 'https://bit.ly/coaching-lomba' },
  { id: 'evt-005', nama: 'Webinar Karir dan Magang 2026', tipe: 'Webinar', tanggal: '19 Apr 2026', waktu: '14:00 – 16:00', lokasi: 'Online via Zoom', narasumber: 'Yudha Pratama, S.T., M.B.A.', institusiNarasumber: 'HR Manager — Pertamina', kapasitas: 200, pendaftar: 187, status: 'ongoing', deskripsi: 'Webinar tentang tips mendapatkan magang dan karir impian.', linkPendaftaran: 'https://bit.ly/webinar-karir' },
  { id: 'evt-006', nama: 'Workshop Statistika SPSS untuk Penelitian', tipe: 'Workshop', tanggal: '5 Apr 2026', waktu: '09:00 – 16:00', lokasi: 'Lab Komputer Ekonomi', narasumber: 'Prof. Siti Rahayu, Ph.D.', institusiNarasumber: 'Dosen Statistika UNS', kapasitas: 40, pendaftar: 40, status: 'done', deskripsi: 'Workshop penggunaan SPSS untuk analisis data penelitian skripsi.', linkPendaftaran: 'https://bit.ly/spss-workshop' },
  { id: 'evt-007', nama: 'Seminar Nasional Teknologi Informasi', tipe: 'Seminar', tanggal: '28 Mar 2026', waktu: '08:30 – 15:00', lokasi: 'Auditorium Pusat', narasumber: 'Dr. Rizky Firmansyah', institusiNarasumber: 'Peneliti BRIN', kapasitas: 300, pendaftar: 278, status: 'done', deskripsi: 'Seminar nasional perkembangan teknologi informasi terkini.', linkPendaftaran: 'https://bit.ly/snti-2026' },
  { id: 'evt-008', nama: 'Pelatihan Public Speaking & Presentasi', tipe: 'Pelatihan', tanggal: '24 Mei 2026', waktu: '09:00 – 13:00', lokasi: 'Ruang Seminar FIB Lt. 4', narasumber: 'Kartika Dewi, S.Psi.', institusiNarasumber: 'Trainer Komunikasi', kapasitas: 35, pendaftar: 12, status: 'upcoming', deskripsi: 'Pelatihan public speaking untuk meningkatkan kepercayaan diri mahasiswa.', linkPendaftaran: 'https://bit.ly/publicspeaking' },
];

type SortField = keyof Event;
type SortDir = 'asc' | 'desc' | null;

export default function EventTable() {
  const [data, setData] = useState<Event[]>(mockEvents);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<EventStatus | 'all'>('all');
  const [filterTipe, setFilterTipe] = useState<EventTipe | 'all'>('all');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('tanggal');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Event | null>(null);

  const filtered = useMemo(() => {
    let result = [...data];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) => d.nama.toLowerCase().includes(q) || d.narasumber.toLowerCase().includes(q) || d.lokasi.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') result = result.filter((d) => d.status === filterStatus);
    if (filterTipe !== 'all') result = result.filter((d) => d.tipe === filterTipe);
    if (sortField && sortDir) {
      result.sort((a, b) => {
        const av = String(a[sortField]);
        const bv = String(b[sortField]);
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return result;
  }, [data, search, filterStatus, filterTipe, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown size={13} className="text-slate-300" />;
    if (sortDir === 'asc') return <ChevronUp size={13} className="text-indigo-600" />;
    if (sortDir === 'desc') return <ChevronDown size={13} className="text-indigo-600" />;
    return <ChevronsUpDown size={13} className="text-slate-300" />;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    // TODO: Backend — DELETE /api/events/:id
    await new Promise((r) => setTimeout(r, 700));
    setData((prev) => prev.filter((d) => d.id !== deleteTarget));
    setDeleteLoading(false);
    setDeleteTarget(null);
    toast.success('Event berhasil dihapus');
  };

  const handleSave = (item: Event) => {
    if (editItem) {
      setData((prev) => prev.map((d) => (d.id === item.id ? item : d)));
      toast.success('Data event berhasil diperbarui');
    } else {
      setData((prev) => [item, ...prev]);
      toast.success('Event baru berhasil ditambahkan');
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const tipeColors: Record<EventTipe, string> = {
    Workshop: 'bg-indigo-100 text-indigo-700',
    Seminar: 'bg-emerald-100 text-emerald-700',
    Pelatihan: 'bg-cyan-100 text-cyan-700',
    Coaching: 'bg-purple-100 text-purple-700',
    Webinar: 'bg-amber-100 text-amber-700',
  };

  return (
    <>
      <div className="card overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Cari nama event, narasumber, lokasi…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value as EventStatus | 'all'); setPage(1); }}
                className="input-field py-2 text-sm w-auto min-w-[130px]"
              >
                <option value="all">Semua Status</option>
                <option value="upcoming">Akan Datang</option>
                <option value="ongoing">Berlangsung</option>
                <option value="done">Selesai</option>
              </select>
              <select
                value={filterTipe}
                onChange={(e) => { setFilterTipe(e.target.value as EventTipe | 'all'); setPage(1); }}
                className="input-field py-2 text-sm w-auto min-w-[120px]"
              >
                <option value="all">Semua Tipe</option>
                {(['Workshop', 'Seminar', 'Pelatihan', 'Coaching', 'Webinar'] as EventTipe[]).map((t) => (
                  <option key={`et-${t}`} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors" title="Refresh">
                <RefreshCw size={16} />
              </button>
              <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors" title="Ekspor">
                <Download size={16} />
              </button>
              <button
                onClick={() => { setEditItem(null); setFormOpen(true); }}
                className="btn-primary py-2 text-sm"
              >
                <Plus size={16} />
                Tambah Event
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{filtered.length} event</span>
            {(['upcoming', 'ongoing', 'done'] as const).map((s) => {
              const count = data.filter((d) => d.status === s).length;
              return (
                <span key={`estat-${s}`} className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${s === 'upcoming' ? 'bg-blue-500' : s === 'ongoing' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {count} {s === 'upcoming' ? 'akan datang' : s === 'ongoing' ? 'berlangsung' : 'selesai'}
                </span>
              );
            })}
          </div>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-3 px-5 py-3 bg-indigo-50 border-b border-indigo-100 animate-slide-up">
            <span className="text-sm font-semibold text-indigo-700">{selected.size} dipilih</span>
            <button
              onClick={async () => {
                const count = selected.size;
                setData((prev) => prev.filter((d) => !selected.has(d.id)));
                setSelected(new Set());
                toast.success(`${count} event berhasil dihapus`);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
            >
              <Trash2 size={13} /> Hapus Terpilih
            </button>
            <button onClick={() => setSelected(new Set())} className="text-xs text-slate-600 hover:text-slate-800 transition-colors ml-auto">
              Batalkan
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === paginated.length && paginated.length > 0}
                    onChange={() => {
                      if (selected.size === paginated.length) setSelected(new Set());
                      else setSelected(new Set(paginated.map((d) => d.id)));
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer"
                  />
                </th>
                {[
                  { label: 'Nama Event', field: 'nama' as SortField },
                  { label: 'Tipe', field: 'tipe' as SortField },
                  { label: 'Tanggal & Waktu', field: 'tanggal' as SortField },
                  { label: 'Lokasi', field: 'lokasi' as SortField },
                  { label: 'Narasumber', field: 'narasumber' as SortField },
                  { label: 'Kuota / Pendaftar', field: 'kapasitas' as SortField },
                  { label: 'Status', field: 'status' as SortField },
                  { label: 'Aksi', field: null },
                ].map((col) => (
                  <th
                    key={`eth-${col.label}`}
                    onClick={col.field ? () => toggleSort(col.field!) : undefined}
                    className={`px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap
                      ${col.field ? 'cursor-pointer hover:text-slate-700 select-none' : ''}
                      ${col.label === 'Aksi' ? 'text-right' : ''}`}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.field && <SortIcon field={col.field} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState
                      icon={<CalendarDays size={28} />}
                      title="Tidak ada event ditemukan"
                      description="Tambahkan event baru atau ubah filter pencarian."
                      action={
                        <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="btn-primary text-sm">
                          <Plus size={15} /> Tambah Event Pertama
                        </button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const fillPct = Math.round((item.pendaftar / item.kapasitas) * 100);
                  const isAlmostFull = fillPct >= 90;
                  return (
                    <tr key={item.id} className={`table-row-hover ${selected.has(item.id) ? 'bg-indigo-50/60' : ''}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(item.id)}
                          onChange={() => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (next.has(item.id)) next.delete(item.id);
                              else next.add(item.id);
                              return next;
                            });
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 min-w-[220px]">
                        <p className="font-semibold text-slate-800 text-sm max-w-[220px] truncate">{item.nama}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${tipeColors[item.tipe]}`}>
                          {item.tipe}
                        </span>
                      </td>
                      <td className="px-4 py-3 min-w-[150px]">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <CalendarDays size={13} className="text-slate-400 flex-shrink-0" />
                          <span className="text-sm font-semibold text-slate-700">{item.tanggal}</span>
                        </div>
                        <p className="text-xs text-slate-500 pl-5">{item.waktu}</p>
                      </td>
                      <td className="px-4 py-3 min-w-[160px]">
                        <div className="flex items-start gap-1.5">
                          <MapPin size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-600 max-w-[150px] truncate">{item.lokasi}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 min-w-[180px]">
                        <p className="text-sm font-medium text-slate-800 truncate max-w-[180px]">{item.narasumber}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[180px] mt-0.5">{item.institusiNarasumber}</p>
                      </td>
                      <td className="px-4 py-3 min-w-[140px]">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Users size={13} className="text-slate-400" />
                          <span className={`text-sm font-semibold tabular-nums ${isAlmostFull ? 'text-red-600' : 'text-slate-700'}`}>
                            {item.pendaftar}/{item.kapasitas}
                          </span>
                          {isAlmostFull && (
                            <span className="text-[10px] font-bold text-red-600">PENUH!</span>
                          )}
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isAlmostFull ? 'bg-red-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                            title="Lihat detail event"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => { setEditItem(item); setFormOpen(true); }}
                            className="p-1.5 rounded-lg hover:bg-indigo-100 text-slate-400 hover:text-indigo-700 transition-colors"
                            title="Edit event"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                            title="Hapus event ini — tidak dapat dibatalkan"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Menampilkan {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} dari {filtered.length} event
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
              <button
                key={`epage-${i + 1}`}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors
                  ${page === i + 1 ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <EventFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditItem(null); }}
        onSave={handleSave}
        editItem={editItem}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Hapus Event"
        description="Event ini akan dihapus secara permanen. Data pendaftaran peserta juga akan ikut terhapus."
        confirmLabel="Hapus Event"
      />
    </>
  );
}