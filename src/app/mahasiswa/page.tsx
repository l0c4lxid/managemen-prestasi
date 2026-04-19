'use client';
import React, { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';

import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import {
  Search, Plus, Pencil, Trash2, Eye, Filter, Download, RefreshCw,
  ChevronUp, ChevronDown, ChevronsUpDown, GraduationCap, Mail, Phone,
  X, CheckCircle, BookOpen,
} from 'lucide-react';

type MahasiswaStatus = 'active' | 'inactive' | 'alumni';

interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  prodi: string;
  fakultas: string;
  angkatan: string;
  email: string;
  telepon: string;
  ipk: number;
  totalPrestasi: number;
  status: MahasiswaStatus;
}

const mockData: Mahasiswa[] = [
  { id: 'm-001', nim: '2021001001', nama: 'Andi Pratama', prodi: 'Teknik Informatika', fakultas: 'Teknik', angkatan: '2021', email: 'andi.pratama@student.ac.id', telepon: '081234567890', ipk: 3.87, totalPrestasi: 5, status: 'active' },
  { id: 'm-002', nim: '2021001002', nama: 'Siti Rahayu', prodi: 'Manajemen', fakultas: 'Ekonomi', angkatan: '2021', email: 'siti.rahayu@student.ac.id', telepon: '081234567891', ipk: 3.92, totalPrestasi: 8, status: 'active' },
  { id: 'm-003', nim: '2020001003', nama: 'Budi Santoso', prodi: 'Hukum', fakultas: 'Hukum', angkatan: '2020', email: 'budi.santoso@student.ac.id', telepon: '081234567892', ipk: 3.65, totalPrestasi: 3, status: 'active' },
  { id: 'm-004', nim: '2020001004', nama: 'Dewi Lestari', prodi: 'Kedokteran', fakultas: 'Kedokteran', angkatan: '2020', email: 'dewi.lestari@student.ac.id', telepon: '081234567893', ipk: 3.95, totalPrestasi: 12, status: 'active' },
  { id: 'm-005', nim: '2019001005', nama: 'Rizky Firmansyah', prodi: 'Teknik Sipil', fakultas: 'Teknik', angkatan: '2019', email: 'rizky.firmansyah@student.ac.id', telepon: '081234567894', ipk: 3.72, totalPrestasi: 6, status: 'alumni' },
  { id: 'm-006', nim: '2022001006', nama: 'Nurul Hidayah', prodi: 'Psikologi', fakultas: 'Psikologi', angkatan: '2022', email: 'nurul.hidayah@student.ac.id', telepon: '081234567895', ipk: 3.80, totalPrestasi: 4, status: 'active' },
  { id: 'm-007', nim: '2021001007', nama: 'Fajar Kurniawan', prodi: 'Akuntansi', fakultas: 'Ekonomi', angkatan: '2021', email: 'fajar.kurniawan@student.ac.id', telepon: '081234567896', ipk: 3.55, totalPrestasi: 2, status: 'inactive' },
  { id: 'm-008', nim: '2022001008', nama: 'Indah Permata', prodi: 'Farmasi', fakultas: 'Farmasi', angkatan: '2022', email: 'indah.permata@student.ac.id', telepon: '081234567897', ipk: 3.88, totalPrestasi: 7, status: 'active' },
  { id: 'm-009', nim: '2020001009', nama: 'Hendra Wijaya', prodi: 'Teknik Elektro', fakultas: 'Teknik', angkatan: '2020', email: 'hendra.wijaya@student.ac.id', telepon: '081234567898', ipk: 3.70, totalPrestasi: 9, status: 'active' },
  { id: 'm-010', nim: '2019001010', nama: 'Putri Amalia', prodi: 'Sastra Inggris', fakultas: 'Sastra', angkatan: '2019', email: 'putri.amalia@student.ac.id', telepon: '081234567899', ipk: 3.91, totalPrestasi: 11, status: 'alumni' },
  { id: 'm-011', nim: '2023001011', nama: 'Dimas Ardiansyah', prodi: 'Teknik Informatika', fakultas: 'Teknik', angkatan: '2023', email: 'dimas.ardiansyah@student.ac.id', telepon: '081234567800', ipk: 3.60, totalPrestasi: 1, status: 'active' },
  { id: 'm-012', nim: '2022001012', nama: 'Laila Fitri', prodi: 'Biologi', fakultas: 'MIPA', angkatan: '2022', email: 'laila.fitri@student.ac.id', telepon: '081234567801', ipk: 3.78, totalPrestasi: 5, status: 'active' },
];

type SortField = keyof Mahasiswa;
type SortDir = 'asc' | 'desc' | null;

function MahasiswaFormModal({
  open, onClose, editItem, onSave,
}: {
  open: boolean;
  onClose: () => void;
  editItem: Mahasiswa | null;
  onSave: (data: Mahasiswa) => void;
}) {
  const [form, setForm] = useState<Partial<Mahasiswa>>(editItem || {});
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setForm(editItem || {});
  }, [editItem, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({
        id: editItem?.id || `m-${Date.now()}`,
        nim: form.nim || '',
        nama: form.nama || '',
        prodi: form.prodi || '',
        fakultas: form.fakultas || '',
        angkatan: form.angkatan || '',
        email: form.email || '',
        telepon: form.telepon || '',
        ipk: Number(form.ipk) || 0,
        totalPrestasi: Number(form.totalPrestasi) || 0,
        status: (form.status as MahasiswaStatus) || 'active',
      });
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">{editItem ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">NIM</label>
              <input value={form.nim || ''} onChange={e => setForm(p => ({ ...p, nim: e.target.value }))} required className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="2021001001" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Angkatan</label>
              <input value={form.angkatan || ''} onChange={e => setForm(p => ({ ...p, angkatan: e.target.value }))} required className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="2021" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Lengkap</label>
            <input value={form.nama || ''} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} required className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Nama lengkap mahasiswa" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Program Studi</label>
              <input value={form.prodi || ''} onChange={e => setForm(p => ({ ...p, prodi: e.target.value }))} required className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Teknik Informatika" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fakultas</label>
              <input value={form.fakultas || ''} onChange={e => setForm(p => ({ ...p, fakultas: e.target.value }))} required className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Teknik" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <input type="email" value={form.email || ''} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="nama@student.ac.id" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Telepon</label>
              <input value={form.telepon || ''} onChange={e => setForm(p => ({ ...p, telepon: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="08xxxxxxxxxx" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">IPK</label>
              <input type="number" step="0.01" min="0" max="4" value={form.ipk || ''} onChange={e => setForm(p => ({ ...p, ipk: parseFloat(e.target.value) }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="3.75" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
            <select value={form.status || 'active'} onChange={e => setForm(p => ({ ...p, status: e.target.value as MahasiswaStatus }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan...</> : <><CheckCircle size={16} />Simpan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MahasiswaPage() {
  const [data, setData] = useState<Mahasiswa[]>(mockData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<MahasiswaStatus | 'all'>('all');
  const [filterFakultas, setFilterFakultas] = useState('all');
  const [filterAngkatan, setFilterAngkatan] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [sortField, setSortField] = useState<SortField>('nama');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Mahasiswa | null>(null);

  const fakultasOptions = Array.from(new Set(mockData.map(d => d.fakultas)));
  const angkatanOptions = Array.from(new Set(mockData.map(d => d.angkatan))).sort((a, b) => b.localeCompare(a));

  const filtered = useMemo(() => {
    let result = [...data];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => d.nama.toLowerCase().includes(q) || d.nim.includes(q) || d.prodi.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') result = result.filter(d => d.status === filterStatus);
    if (filterFakultas !== 'all') result = result.filter(d => d.fakultas === filterFakultas);
    if (filterAngkatan !== 'all') result = result.filter(d => d.angkatan === filterAngkatan);
    if (sortField && sortDir) {
      result.sort((a, b) => {
        const av = String(a[sortField]);
        const bv = String(b[sortField]);
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return result;
  }, [data, search, filterStatus, filterFakultas, filterAngkatan, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown size={14} className="text-slate-300" />;
    if (sortDir === 'asc') return <ChevronUp size={14} className="text-indigo-500" />;
    if (sortDir === 'desc') return <ChevronDown size={14} className="text-indigo-500" />;
    return <ChevronsUpDown size={14} className="text-slate-300" />;
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map(d => d.id)));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setTimeout(() => {
      setData(prev => prev.filter(d => d.id !== deleteTarget));
      setDeleteTarget(null);
      setDeleteLoading(false);
    }, 600);
  };

  const handleSave = (item: Mahasiswa) => {
    setData(prev => {
      const idx = prev.findIndex(d => d.id === item.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = item; return next; }
      return [item, ...prev];
    });
  };

  const statusMap: Record<MahasiswaStatus, 'active' | 'pending' | 'archived'> = {
    active: 'active', inactive: 'pending', alumni: 'archived',
  };

  const statusLabel: Record<MahasiswaStatus, string> = {
    active: 'Aktif', inactive: 'Tidak Aktif', alumni: 'Alumni',
  };

  const statusClass: Record<MahasiswaStatus, string> = {
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    inactive: 'bg-amber-50 text-amber-700 border border-amber-100',
    alumni: 'bg-slate-50 text-slate-600 border border-slate-200',
  };

  return (
    <AppLayout activePath="/mahasiswa">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Mahasiswa</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola data mahasiswa, status akademik, dan rekam jejak prestasi.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={16} />Ekspor
            </button>
            <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus size={16} />Tambah Mahasiswa
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Mahasiswa', value: data.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Mahasiswa Aktif', value: data.filter(d => d.status === 'active').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Tidak Aktif', value: data.filter(d => d.status === 'inactive').length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Alumni', value: data.filter(d => d.status === 'alumni').length, color: 'text-slate-600', bg: 'bg-slate-100' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <GraduationCap size={20} className={s.color} />
              </div>
              <div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari nama, NIM, atau prodi..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={15} className="text-slate-400" />
              <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as MahasiswaStatus | 'all'); setPage(1); }} className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
                <option value="alumni">Alumni</option>
              </select>
              <select value={filterFakultas} onChange={e => { setFilterFakultas(e.target.value); setPage(1); }} className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                <option value="all">Semua Fakultas</option>
                {fakultasOptions.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <select value={filterAngkatan} onChange={e => { setFilterAngkatan(e.target.value); setPage(1); }} className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                <option value="all">Semua Angkatan</option>
                {angkatanOptions.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <button onClick={() => { setSearch(''); setFilterStatus('all'); setFilterFakultas('all'); setFilterAngkatan('all'); setPage(1); }} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors" title="Reset filter">
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* Bulk actions */}
          {selected.size > 0 && (
            <div className="px-4 py-2.5 bg-indigo-50 border-b border-indigo-100 flex items-center gap-3">
              <span className="text-sm font-semibold text-indigo-700">{selected.size} dipilih</span>
              <button className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-colors flex items-center gap-1.5">
                <Trash2 size={13} />Hapus Terpilih
              </button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-300" />
                  </th>
                  {([['nim', 'NIM'], ['nama', 'Nama'], ['prodi', 'Program Studi'], ['angkatan', 'Angkatan'], ['ipk', 'IPK'], ['totalPrestasi', 'Prestasi'], ['status', 'Status']] as [SortField, string][]).map(([field, label]) => (
                    <th key={field} className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap cursor-pointer hover:text-slate-800 transition-colors" onClick={() => handleSort(field)}>
                      <div className="flex items-center gap-1.5">{label}<SortIcon field={field} /></div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Kontak</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.length === 0 ? (
                  <tr><td colSpan={10} className="py-16"><EmptyState title="Tidak ada mahasiswa" description="Belum ada data mahasiswa yang sesuai filter." /></td></tr>
                ) : paginated.map(row => (
                  <tr key={row.id} className={`hover:bg-slate-50/70 transition-colors ${selected.has(row.id) ? 'bg-indigo-50/40' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleSelect(row.id)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-300" />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{row.nim}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {row.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <span className="font-semibold text-slate-800">{row.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.prodi}</td>
                    <td className="px-4 py-3 text-slate-600">{row.angkatan}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${row.ipk >= 3.75 ? 'text-emerald-600' : row.ipk >= 3.5 ? 'text-indigo-600' : 'text-slate-600'}`}>{row.ipk.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                        <BookOpen size={11} />{row.totalPrestasi}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass[row.status]}`}>
                        {statusLabel[row.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-xs text-slate-500"><Mail size={11} />{row.email}</span>
                        <span className="flex items-center gap-1 text-xs text-slate-400"><Phone size={11} />{row.telepon}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors" title="Lihat detail"><Eye size={15} /></button>
                        <button onClick={() => { setEditItem(row); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors" title="Edit"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteTarget(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Hapus"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-slate-500">Menampilkan {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} dari {filtered.length} mahasiswa</p>
              <div className="flex items-center gap-1">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">‹ Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1).map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-slate-400">…</span>}
                    <button onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{p}</button>
                  </React.Fragment>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next ›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <MahasiswaFormModal open={formOpen} onClose={() => setFormOpen(false)} editItem={editItem} onSave={handleSave} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Mahasiswa"
        message="Data mahasiswa ini akan dihapus secara permanen. Lanjutkan?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </AppLayout>
  );
}
