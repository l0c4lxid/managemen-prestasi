'use client';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Search, Filter, Plus, CheckCircle, XCircle, Eye, Pencil, Trash2,
  ChevronUp, ChevronDown, ChevronsUpDown, Download, RefreshCw,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import PrestasiFormModal from './PrestasiFormModal';
import PrestasiDetailModal from './PrestasiDetailModal';
import { SkeletonTable } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';

export type PrestasiStatus = 'verified' | 'pending' | 'rejected' | 'draft';

export interface Prestasi {
  id: string;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: string;
  lomba: string;
  penyelenggara: string;
  kategori: string;
  juara: string;
  tingkat: string;
  tanggal: string;
  sertifikat: boolean;
  status: PrestasiStatus;
  catatan?: string;
}

const mockData: Prestasi[] = [
  { id: 'prs-001', nim: '2021310045', nama: 'Aninda Putri Rahayu', prodi: 'Manajemen', angkatan: '2021', lomba: 'PKM-K Nasional 2026', penyelenggara: 'Kemendikbudristek', kategori: 'Kewirausahaan', juara: 'Juara 1', tingkat: 'Nasional', tanggal: '18 Apr 2026', sertifikat: true, status: 'pending' },
  { id: 'prs-002', nim: '2022140023', nama: 'Fadhil Zulkarnain', prodi: 'Teknik Informatika', angkatan: '2022', lomba: 'GEMASTIK XVIII Animasi', penyelenggara: 'Pusat Prestasi Nasional', kategori: 'Teknologi', juara: 'Juara 2', tingkat: 'Nasional', tanggal: '17 Apr 2026', sertifikat: true, status: 'pending' },
  { id: 'prs-003', nim: '2020250067', nama: 'Renata Kusuma Dewi', prodi: 'Akuntansi', angkatan: '2020', lomba: 'Olimpiade Akuntansi Nasional', penyelenggara: 'IAI', kategori: 'Akademik', juara: 'Juara 1', tingkat: 'Nasional', tanggal: '10 Apr 2026', sertifikat: true, status: 'verified' },
  { id: 'prs-004', nim: '2021180034', nama: 'Bagas Suryo Pratama', prodi: 'Hukum', angkatan: '2021', lomba: 'Moot Court Regional Jawa Tengah', penyelenggara: 'FH UGM', kategori: 'Akademik', juara: 'Juara 3', tingkat: 'Regional', tanggal: '8 Apr 2026', sertifikat: true, status: 'verified' },
  { id: 'prs-005', nim: '2022330011', nama: 'Nabilah Azzahra', prodi: 'Psikologi', angkatan: '2022', lomba: 'Debat Bahasa Inggris Nasional', penyelenggara: 'DIKTI', kategori: 'Seni & Budaya', juara: 'Juara 1', tingkat: 'Nasional', tanggal: '5 Apr 2026', sertifikat: false, status: 'rejected', catatan: 'Sertifikat belum diunggah, harap lengkapi dokumen.' },
  { id: 'prs-006', nim: '2020090056', nama: 'Dimas Eka Nugraha', prodi: 'Teknik Sipil', angkatan: '2020', lomba: 'Civil Engineering Design Expo', penyelenggara: 'HAKI', kategori: 'Teknologi', juara: 'Juara 2', tingkat: 'Nasional', tanggal: '2 Apr 2026', sertifikat: true, status: 'verified' },
  { id: 'prs-007', nim: '2021270029', nama: 'Shinta Maharani', prodi: 'DKV', angkatan: '2021', lomba: 'Lomba Poster Nasional ADGI', penyelenggara: 'ADGI', kategori: 'Seni & Budaya', juara: 'Juara 1', tingkat: 'Nasional', tanggal: '28 Mar 2026', sertifikat: true, status: 'verified' },
  { id: 'prs-008', nim: '2022110078', nama: 'Rizal Maulana Akbar', prodi: 'Ekonomi Pembangunan', angkatan: '2022', lomba: 'Olimpiade Ekonomi Indonesia', penyelenggara: 'ISEI', kategori: 'Akademik', juara: 'Juara 2', tingkat: 'Nasional', tanggal: '25 Mar 2026', sertifikat: true, status: 'pending' },
  { id: 'prs-009', nim: '2021400041', nama: 'Tantri Wulandari', prodi: 'Ilmu Komunikasi', angkatan: '2021', lomba: 'Jurnalis Muda Indonesia', penyelenggara: 'Dewan Pers', kategori: 'Seni & Budaya', juara: 'Juara 3', tingkat: 'Nasional', tanggal: '20 Mar 2026', sertifikat: true, status: 'draft' },
  { id: 'prs-010', nim: '2020150063', nama: 'Hendra Wijaksana', prodi: 'Teknik Elektro', angkatan: '2020', lomba: 'National Robotics Championship', penyelenggara: 'ITS Surabaya', kategori: 'Teknologi', juara: 'Juara 1', tingkat: 'Nasional', tanggal: '15 Mar 2026', sertifikat: true, status: 'pending' },
  { id: 'prs-011', nim: '2022360022', nama: 'Putri Amalia Sari', prodi: 'Farmasi', angkatan: '2022', lomba: 'Pharmacy Science Expo', penyelenggara: 'IAI Jateng', kategori: 'Sains', juara: 'Juara 2', tingkat: 'Regional', tanggal: '10 Mar 2026', sertifikat: true, status: 'verified' },
  { id: 'prs-012', nim: '2021050087', nama: 'Yusuf Hadiyanto', prodi: 'Kedokteran', angkatan: '2021', lomba: 'Medical Olympiad 2026', penyelenggara: 'IDI', kategori: 'Sains', juara: 'Juara 1', tingkat: 'Internasional', tanggal: '5 Mar 2026', sertifikat: true, status: 'verified' },
];

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];
type SortField = keyof Prestasi;
type SortDir = 'asc' | 'desc' | null;

export default function PrestasiTable() {
  const [data, setData] = useState<Prestasi[]>(mockData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<PrestasiStatus | 'all'>('all');
  const [filterKategori, setFilterKategori] = useState('all');
  const [filterTingkat, setFilterTingkat] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('tanggal');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Prestasi | null>(null);
  const [detailItem, setDetailItem] = useState<Prestasi | null>(null);

  const kategoriOptions = Array.from(new Set(mockData.map((d) => d.kategori)));
  const tingkatOptions = Array.from(new Set(mockData.map((d) => d.tingkat)));

  const filtered = useMemo(() => {
    let result = [...data];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.nama.toLowerCase().includes(q) ||
          d.nim.includes(q) ||
          d.lomba.toLowerCase().includes(q) ||
          d.prodi.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') result = result.filter((d) => d.status === filterStatus);
    if (filterKategori !== 'all') result = result.filter((d) => d.kategori === filterKategori);
    if (filterTingkat !== 'all') result = result.filter((d) => d.tingkat === filterTingkat);
    if (sortField && sortDir) {
      result.sort((a, b) => {
        const av = a[sortField] as string;
        const bv = b[sortField] as string;
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

  const toggleSelectAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((d) => d.id)));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);

    await new Promise((r) => setTimeout(r, 800));
    setData((prev) => prev.filter((d) => d.id !== deleteTarget));
    setDeleteLoading(false);
    setDeleteTarget(null);
    toast.success('Prestasi berhasil dihapus');
  };

  const handleBulkDelete = async () => {

    await new Promise((r) => setTimeout(r, 600));
    setData((prev) => prev.filter((d) => !selected.has(d.id)));
    const count = selected.size;
    setSelected(new Set());
    toast.success(`${count} prestasi berhasil dihapus`);
  };

  const handleSave = (item: Prestasi) => {
    if (editItem) {
      setData((prev) => prev.map((d) => (d.id === item.id ? item : d)));
      toast.success('Prestasi berhasil diperbarui');
    } else {
      setData((prev) => [item, ...prev]);
      toast.success('Prestasi baru berhasil ditambahkan');
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const handleVerifyInline = async (id: string, action: 'approve' | 'reject') => {

    await new Promise((r) => setTimeout(r, 500));
    setData((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: action === 'approve' ? 'verified' : 'rejected' } : d
      )
    );
    toast.success(action === 'approve' ? 'Prestasi diverifikasi' : 'Prestasi ditolak');
  };

  return (
    <>
      <div className="card overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Cari nama, NIM, lomba, prodi…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value as PrestasiStatus | 'all'); setPage(1); }}
                className="input-field py-2 text-sm w-auto min-w-[130px]"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="verified">Terverifikasi</option>
                <option value="rejected">Ditolak</option>
                <option value="draft">Draf</option>
              </select>
              <select
                value={filterKategori}
                onChange={(e) => { setFilterKategori(e.target.value); setPage(1); }}
                className="input-field py-2 text-sm w-auto min-w-[130px]"
              >
                <option value="all">Semua Kategori</option>
                {kategoriOptions.map((k) => (
                  <option key={`kat-opt-${k}`} value={k}>{k}</option>
                ))}
              </select>
              <select
                value={filterTingkat}
                onChange={(e) => { setFilterTingkat(e.target.value); setPage(1); }}
                className="input-field py-2 text-sm w-auto min-w-[130px]"
              >
                <option value="all">Semua Tingkat</option>
                {tingkatOptions.map((t) => (
                  <option key={`tingkat-opt-${t}`} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                title="Refresh data"
              >
                <RefreshCw size={16} />
              </button>
              <button
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                title="Ekspor ke Excel"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => { setEditItem(null); setFormOpen(true); }}
                className="btn-primary py-2 text-sm"
              >
                <Plus size={16} />
                Tambah Prestasi
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{filtered.length} total</span>
            {(['pending', 'verified', 'rejected', 'draft'] as const).map((s) => {
              const count = data.filter((d) => d.status === s).length;
              return (
                <span key={`stat-count-${s}`} className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${s === 'verified' ? 'bg-emerald-500' : s === 'pending' ? 'bg-amber-500' : s === 'rejected' ? 'bg-red-500' : 'bg-slate-400'}`} />
                  {count} {s === 'verified' ? 'terverifikasi' : s === 'pending' ? 'menunggu' : s === 'rejected' ? 'ditolak' : 'draf'}
                </span>
              );
            })}
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 px-5 py-3 bg-indigo-50 border-b border-indigo-100 animate-slide-up">
            <span className="text-sm font-semibold text-indigo-700">{selected.size} dipilih</span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
            >
              <Trash2 size={13} />
              Hapus Terpilih
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-slate-600 hover:text-slate-800 transition-colors ml-auto"
            >
              Batalkan pilihan
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
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
                  />
                </th>
                {[
                  { label: 'Mahasiswa', field: 'nama' as SortField },
                  { label: 'Lomba', field: 'lomba' as SortField },
                  { label: 'Kategori', field: 'kategori' as SortField },
                  { label: 'Juara', field: 'juara' as SortField },
                  { label: 'Tingkat', field: 'tingkat' as SortField },
                  { label: 'Tanggal', field: 'tanggal' as SortField },
                  { label: 'Sertifikat', field: null },
                  { label: 'Status', field: 'status' as SortField },
                  { label: 'Aksi', field: null },
                ].map((col) => (
                  <th
                    key={`th-${col.label}`}
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
              {loading ? (
                <SkeletonTable rows={8} cols={10} />
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <EmptyState
                      title="Tidak ada prestasi ditemukan"
                      description="Coba ubah filter atau kata kunci pencarian untuk menemukan data prestasi."
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
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <p className="font-semibold text-slate-800 text-sm">{item.nama}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{item.nim} · {item.prodi}</p>
                    </td>
                    <td className="px-4 py-3 min-w-[200px]">
                      <p className="text-sm text-slate-700 max-w-[200px] truncate font-medium">{item.lomba}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{item.penyelenggara}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg
                        ${item.juara === 'Juara 1' ? 'bg-amber-100 text-amber-700' :
                          item.juara === 'Juara 2'? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-700'}`}>
                        {item.juara}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold
                        ${item.tingkat === 'Internasional' ? 'bg-purple-100 text-purple-700' :
                          item.tingkat === 'Nasional'? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                        {item.tingkat}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm text-slate-600">{item.tanggal}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {item.sertifikat ? (
                        <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle size={16} className="text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailItem(item)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          title="Lihat detail prestasi"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => { setEditItem(item); setFormOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-indigo-100 text-slate-400 hover:text-indigo-700 transition-colors"
                          title="Edit prestasi"
                        >
                          <Pencil size={14} />
                        </button>
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleVerifyInline(item.id, 'approve')}
                              className="p-1.5 rounded-lg hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 transition-colors"
                              title="Verifikasi prestasi ini"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              onClick={() => handleVerifyInline(item.id, 'reject')}
                              className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                              title="Tolak prestasi ini"
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setDeleteTarget(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                          title="Hapus prestasi ini — tidak dapat dibatalkan"
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
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Tampilkan</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="input-field py-1 text-sm w-auto"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                <option key={`per-page-${n}`} value={n}>{n}</option>
              ))}
            </select>
            <span>dari {filtered.length} data</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors
                    ${page === pageNum ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {pageNum}
                </button>
              );
            })}
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

      {/* Modals */}
      <PrestasiFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditItem(null); }}
        onSave={handleSave}
        editItem={editItem}
      />

      {detailItem && (
        <PrestasiDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Hapus Prestasi"
        description="Prestasi ini akan dihapus secara permanen dari sistem. Data tidak dapat dipulihkan kembali."
        confirmLabel="Hapus Prestasi"
      />
    </>
  );
}