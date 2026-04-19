'use client';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Search, Plus, Pencil, Trash2, Eye, Filter, Clock, Download, RefreshCw, ChevronUp, ChevronDown, ChevronsUpDown, Users } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LombaFormModal from './LombaFormModal';
import EmptyState from '@/components/ui/EmptyState';


export type LombaStatus = 'active' | 'closed' | 'archived';

export interface Lomba {
  id: string;
  nama: string;
  penyelenggara: string;
  kategori: string;
  tingkat: string;
  deadline: string;
  hadiah: string;
  peserta: number;
  status: LombaStatus;
  deskripsi: string;
  linkPendaftaran: string;
  tanggalMulai: string;
}

const mockLomba: Lomba[] = [
  { id: 'lmb-001', nama: 'PKM (Program Kreativitas Mahasiswa) 2026', penyelenggara: 'Kemendikbudristek', kategori: 'Kewirausahaan', tingkat: 'Nasional', deadline: '20 Mei 2026', hadiah: 'Rp 50.000.000', peserta: 342, status: 'active', deskripsi: 'Program kreativitas mahasiswa bidang kewirausahaan tingkat nasional.', linkPendaftaran: 'https://simbelmawa.kemdikbud.go.id', tanggalMulai: '1 Mar 2026' },
  { id: 'lmb-002', nama: 'GEMASTIK XVIII — Animasi & Multimedia', penyelenggara: 'Pusat Prestasi Nasional', kategori: 'Teknologi', tingkat: 'Nasional', deadline: '10 Jun 2026', hadiah: 'Rp 30.000.000', peserta: 189, status: 'active', deskripsi: 'Kompetisi animasi dan multimedia tingkat nasional untuk mahasiswa.', linkPendaftaran: 'https://gemastik.kemdikbud.go.id', tanggalMulai: '15 Mar 2026' },
  { id: 'lmb-003', nama: 'Olimpiade Sains Mahasiswa — Matematika', penyelenggara: 'Direktorat Jenderal Pendidikan Tinggi', kategori: 'Akademik', tingkat: 'Nasional', deadline: '5 Mei 2026', hadiah: 'Beasiswa + Sertifikat', peserta: 521, status: 'active', deskripsi: 'Olimpiade sains mahasiswa bidang matematika tingkat nasional.', linkPendaftaran: 'https://osm.kemdikbud.go.id', tanggalMulai: '10 Feb 2026' },
  { id: 'lmb-004', nama: 'International Business Plan Competition', penyelenggara: 'NUS Business School', kategori: 'Kewirausahaan', tingkat: 'Internasional', deadline: '15 Jul 2026', hadiah: 'USD 10,000', peserta: 67, status: 'active', deskripsi: 'Kompetisi rencana bisnis internasional yang diselenggarakan oleh NUS Singapura.', linkPendaftaran: 'https://nus-ibpc.sg', tanggalMulai: '1 Apr 2026' },
  { id: 'lmb-005', nama: 'Lomba Karya Tulis Ilmiah Nasional LKTIN', penyelenggara: 'Universitas Airlangga', kategori: 'Akademik', tingkat: 'Nasional', deadline: '28 Mei 2026', hadiah: 'Rp 15.000.000', peserta: 278, status: 'active', deskripsi: 'Lomba karya tulis ilmiah mahasiswa tingkat nasional.', linkPendaftaran: 'https://lktin.unair.ac.id', tanggalMulai: '1 Mar 2026' },
  { id: 'lmb-006', nama: 'National Robotics Championship 2026', penyelenggara: 'ITS Surabaya', kategori: 'Teknologi', tingkat: 'Nasional', deadline: '30 Jun 2026', hadiah: 'Rp 25.000.000', peserta: 143, status: 'active', deskripsi: 'Kompetisi robotika mahasiswa tingkat nasional oleh ITS.', linkPendaftaran: 'https://nrc.its.ac.id', tanggalMulai: '1 Apr 2026' },
  { id: 'lmb-007', nama: 'Debat Bahasa Inggris Nasional NUDC', penyelenggara: 'Kemendikbudristek', kategori: 'Seni & Budaya', tingkat: 'Nasional', deadline: '15 Apr 2026', hadiah: 'Sertifikat + Piala', peserta: 198, status: 'closed', deskripsi: 'National University Debating Championship.', linkPendaftaran: 'https://nudc.kemdikbud.go.id', tanggalMulai: '1 Feb 2026' },
  { id: 'lmb-008', nama: 'Pharmacy Science Expo 2025', penyelenggara: 'IAI Jawa Tengah', kategori: 'Sains', tingkat: 'Regional', deadline: '1 Mar 2026', hadiah: 'Rp 10.000.000', peserta: 87, status: 'archived', deskripsi: 'Kompetisi sains farmasi tingkat regional Jawa Tengah.', linkPendaftaran: 'https://iai-jateng.org/expo', tanggalMulai: '1 Jan 2026' },
  { id: 'lmb-009', nama: 'Medical Olympiad Indonesia 2026', penyelenggara: 'Ikatan Dokter Indonesia', kategori: 'Sains', tingkat: 'Internasional', deadline: '30 Jun 2026', hadiah: 'Rp 75.000.000', peserta: 94, status: 'active', deskripsi: 'Olimpiade kedokteran internasional yang diselenggarakan oleh IDI.', linkPendaftaran: 'https://moi.idi.or.id', tanggalMulai: '1 Apr 2026' },
  { id: 'lmb-010', nama: 'Civil Engineering Design Competition', penyelenggara: 'Himpunan Ahli Konstruksi Indonesia', kategori: 'Teknologi', tingkat: 'Nasional', deadline: '25 Mei 2026', hadiah: 'Rp 20.000.000', peserta: 156, status: 'active', deskripsi: 'Kompetisi desain teknik sipil tingkat nasional.', linkPendaftaran: 'https://haki.or.id/cedc', tanggalMulai: '15 Feb 2026' },
];

type SortField = keyof Lomba;
type SortDir = 'asc' | 'desc' | null;

export default function LombaTable() {
  const [data, setData] = useState<Lomba[]>(mockLomba);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<LombaStatus | 'all'>('all');
  const [filterKategori, setFilterKategori] = useState('all');
  const [filterTingkat, setFilterTingkat] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('deadline');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Lomba | null>(null);

  const kategoriOptions = Array.from(new Set(mockLomba.map((d) => d.kategori)));
  const tingkatOptions = Array.from(new Set(mockLomba.map((d) => d.tingkat)));

  const filtered = useMemo(() => {
    let result = [...data];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) => d.nama.toLowerCase().includes(q) || d.penyelenggara.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') result = result.filter((d) => d.status === filterStatus);
    if (filterKategori !== 'all') result = result.filter((d) => d.kategori === filterKategori);
    if (filterTingkat !== 'all') result = result.filter((d) => d.tingkat === filterTingkat);
    if (sortField && sortDir) {
      result.sort((a, b) => {
        const av = String(a[sortField]);
        const bv = String(b[sortField]);
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return result;
  }, [data, search, filterStatus, filterKategori, filterTingkat, sortField, sortDir]);

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

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    // TODO: Backend — DELETE /api/lomba/:id
    await new Promise((r) => setTimeout(r, 700));
    setData((prev) => prev.filter((d) => d.id !== deleteTarget));
    setDeleteLoading(false);
    setDeleteTarget(null);
    toast.success('Lomba berhasil dihapus dari sistem');
  };

  const handleSave = (item: Lomba) => {
    if (editItem) {
      setData((prev) => prev.map((d) => (d.id === item.id ? item : d)));
      toast.success('Data lomba berhasil diperbarui');
    } else {
      setData((prev) => [item, ...prev]);
      toast.success('Lomba baru berhasil ditambahkan');
    }
    setFormOpen(false);
    setEditItem(null);
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
                placeholder="Cari nama lomba atau penyelenggara…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value as LombaStatus | 'all'); setPage(1); }}
                className="input-field py-2 text-sm w-auto min-w-[120px]"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="closed">Tutup</option>
                <option value="archived">Diarsipkan</option>
              </select>
              <select
                value={filterKategori}
                onChange={(e) => { setFilterKategori(e.target.value); setPage(1); }}
                className="input-field py-2 text-sm w-auto min-w-[130px]"
              >
                <option value="all">Semua Kategori</option>
                {kategoriOptions.map((k) => <option key={`lk-${k}`} value={k}>{k}</option>)}
              </select>
              <select
                value={filterTingkat}
                onChange={(e) => { setFilterTingkat(e.target.value); setPage(1); }}
                className="input-field py-2 text-sm w-auto min-w-[130px]"
              >
                <option value="all">Semua Tingkat</option>
                {tingkatOptions.map((t) => <option key={`lt-${t}`} value={t}>{t}</option>)}
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
                Tambah Lomba
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{filtered.length} lomba</span>
            {(['active', 'closed', 'archived'] as const).map((s) => {
              const count = data.filter((d) => d.status === s).length;
              return (
                <span key={`lstat-${s}`} className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${s === 'active' ? 'bg-emerald-500' : s === 'closed' ? 'bg-orange-500' : 'bg-slate-400'}`} />
                  {count} {s === 'active' ? 'aktif' : s === 'closed' ? 'tutup' : 'diarsipkan'}
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
                await new Promise((r) => setTimeout(r, 400));
                const count = selected.size;
                setData((prev) => prev.filter((d) => !selected.has(d.id)));
                setSelected(new Set());
                toast.success(`${count} lomba berhasil dihapus`);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
            >
              <Trash2 size={13} />
              Hapus Terpilih
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
                  { label: 'Nama Lomba', field: 'nama' as SortField },
                  { label: 'Penyelenggara', field: 'penyelenggara' as SortField },
                  { label: 'Kategori', field: 'kategori' as SortField },
                  { label: 'Tingkat', field: 'tingkat' as SortField },
                  { label: 'Deadline', field: 'deadline' as SortField },
                  { label: 'Hadiah', field: 'hadiah' as SortField },
                  { label: 'Peserta', field: 'peserta' as SortField },
                  { label: 'Status', field: 'status' as SortField },
                  { label: 'Aksi', field: null },
                ].map((col) => (
                  <th
                    key={`lth-${col.label}`}
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
                  <td colSpan={10}>
                    <EmptyState
                      title="Tidak ada lomba ditemukan"
                      description="Tambahkan lomba baru atau ubah filter pencarian."
                      action={
                        <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="btn-primary text-sm">
                          <Plus size={15} /> Tambah Lomba Pertama
                        </button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr key={item.id} className={`table-row-hover ${selected.has(item.id) ? 'bg-indigo-50/60' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 min-w-[220px]">
                      <p className="font-semibold text-slate-800 text-sm max-w-[220px] truncate">{item.nama}</p>
                    </td>
                    <td className="px-4 py-3 min-w-[160px]">
                      <p className="text-sm text-slate-600 max-w-[160px] truncate">{item.penyelenggara}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold
                        ${item.tingkat === 'Internasional' ? 'bg-purple-100 text-purple-700' : item.tingkat === 'Nasional' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                        {item.tingkat}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className={`${item.status === 'active' ? 'text-amber-500' : 'text-slate-400'}`} />
                        <span className="text-sm text-slate-700">{item.deadline}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm font-semibold text-slate-800">{item.hadiah}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-slate-400" />
                        <span className="text-sm tabular-nums text-slate-700">{item.peserta}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors" title="Lihat detail">
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => { setEditItem(item); setFormOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-indigo-100 text-slate-400 hover:text-indigo-700 transition-colors"
                          title="Edit lomba"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                          title="Hapus lomba ini"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Menampilkan {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} dari {filtered.length} lomba
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
                key={`lpage-${i + 1}`}
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

      <LombaFormModal
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
        title="Hapus Lomba"
        description="Lomba ini akan dihapus secara permanen. Seluruh data peserta terkait juga akan terpengaruh."
        confirmLabel="Hapus Lomba"
      />
    </>
  );
}