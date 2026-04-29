'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import {
  Search, Trash2, GraduationCap, Mail, RefreshCw,
  ChevronUp, ChevronDown, ChevronsUpDown, BookOpen, Clock
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import UserFormModal from './components/UserFormModal';

interface MahasiswaStats {
  id: string;
  name: string;
  email: string;
  nim?: string;
  role: string;
  created_at: string;
  total_prestasi: number;
}

type SortField = keyof MahasiswaStats;
type SortDir = 'asc' | 'desc' | null;

export default function MahasiswaPage() {
  const supabase = createClient();
  const [data, setData] = useState<MahasiswaStats[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MahasiswaStats | null>(null);

  const { role } = useAuth();
  const isAdmin = role && role !== 'mahasiswa';
  const isSuperAdmin = role === 'super_admin';
  const canManage = role === 'super_admin' || role === 'admin_prestasi';

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    setLoading(true);
    // Fetch users with role mahasiswa
    let query = supabase.from('users').select('id, name, email, nim, role, created_at');
    if (!isSuperAdmin) {
      query = query.eq('role', 'mahasiswa');
    }
    const { data: users, error: usersError } = await query;

    if (usersError) {
      toast.error('Gagal mengambil data mahasiswa');
      setLoading(false);
      return;
    }

    // Fetch achievement counts
    const { data: achievements } = await supabase
      .from('achievements')
      .select('user_id');

    const counts = (achievements || []).reduce((acc: any, curr) => {
      acc[curr.user_id] = (acc[curr.user_id] || 0) + 1;
      return acc;
    }, {});

    const enriched = (users || []).map(u => ({
      ...u,
      total_prestasi: counts[u.id] || 0
    })) as MahasiswaStats[];

    setData(enriched);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    let result = [...data];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => 
        (d.name?.toLowerCase() || '').includes(q) || 
        (d.nim || '').includes(q) || 
        (d.email?.toLowerCase() || '').includes(q)
      );
    }
    if (sortField && sortDir) {
      result.sort((a, b) => {
        const av = String(a[sortField] || '');
        const bv = String(b[sortField] || '');
        if (sortField === 'total_prestasi') {
          return sortDir === 'asc' ? a.total_prestasi - b.total_prestasi : b.total_prestasi - a.total_prestasi;
        }
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return result;
  }, [data, search, sortField, sortDir]);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    
    // Attempting delete (may require super_admin privileges and RLS policies)
    const { error } = await supabase.from('users').delete().eq('id', deleteTarget);
    
    if (error) {
      toast.error('Gagal menghapus mahasiswa: ' + error.message);
    } else {
      toast.success('Mahasiswa berhasil dihapus');
      setData(prev => prev.filter(d => d.id !== deleteTarget));
    }
    
    setDeleteTarget(null);
    setDeleteLoading(false);
  };

  return (
    <AppLayout activePath="/mahasiswa">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {canManage ? 'Manajemen User' : 'Data Mahasiswa'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {canManage ? 'Kelola data seluruh pengguna sistem.' : 'Lihat data mahasiswa terdaftar.'}
            </p>
          </div>
          {canManage && (
            <button
              onClick={() => { setEditTarget(null); setIsModalOpen(true); }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              + Tambah Pengguna
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center`}>
              <GraduationCap size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-indigo-600">{data.length}</p>
              <p className="text-xs text-slate-500">Total Mahasiswa Terdaftar</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center`}>
              <BookOpen size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-amber-600">{data.reduce((acc, curr) => acc + curr.total_prestasi, 0)}</p>
              <p className="text-xs text-slate-500">Total Prestasi Dicapai</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari nama, NIM, atau email..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <button onClick={() => { fetchMahasiswa(); setSearch(''); setPage(1); }} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors" title="Refresh data">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {([['nim', 'NIM'], ['name', 'Nama'], ['role', 'Role'], ['email', 'Email'], ['created_at', 'Terdaftar Pada'], ['total_prestasi', 'Total Prestasi']] as [SortField, string][]).map(([field, label]) => (
                    <th key={field} className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap cursor-pointer hover:text-slate-800 transition-colors" onClick={() => handleSort(field)}>
                      <div className="flex items-center gap-1.5">{label}<SortIcon field={field} /></div>
                    </th>
                  ))}
                  {canManage && <th className="px-4 py-3 text-right font-semibold text-slate-600">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={canManage ? 7 : 6} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                        <p>Memuat data mahasiswa...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={canManage ? 7 : 6} className="py-16"><EmptyState title="Tidak ada mahasiswa" description="Belum ada data mahasiswa yang sesuai filter." /></td></tr>
                ) : paginated.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{row.nim || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {row.name ? row.name.split(' ').map(n => n[0]).slice(0, 2).join('') : '?'}
                        </div>
                        <span className="font-semibold text-slate-800">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        {row.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-slate-500"><Mail size={14} className="text-slate-400" />{row.email}</span>
                    </td>
                    <td className="px-4 py-3">
                       <span className="flex items-center gap-1.5 text-slate-500"><Clock size={14} className="text-slate-400" />{new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
                        <BookOpen size={12} />{row.total_prestasi} Prestasi
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditTarget(row); setIsModalOpen(true); }} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors" title="Edit">Edit</button>
                          <button onClick={() => setDeleteTarget(row.id)} className="p-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors" title="Hapus"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Pengguna"
        description="Data pengguna ini akan dihapus secara permanen beserta semua datanya. Lanjutkan?"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMahasiswa}
        editData={editTarget}
      />
    </AppLayout>
  );
}
