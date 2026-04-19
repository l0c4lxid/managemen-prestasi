'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';


const pendingData = [
  { id: 'pend-001', nama: 'Aninda Putri Rahayu', nim: '2021310045', prodi: 'Manajemen', lomba: 'PKM-K Nasional 2026', juara: 'Juara 1', tanggal: '18 Apr 2026', kategori: 'Kewirausahaan' },
  { id: 'pend-002', nama: 'Fadhil Zulkarnain', nim: '2022140023', prodi: 'Teknik Informatika', lomba: 'GEMASTIK XVIII Animasi', juara: 'Juara 2', tanggal: '17 Apr 2026', kategori: 'Teknologi' },
  { id: 'pend-003', nama: 'Bagas Suryo Pratama', nim: '2021180034', prodi: 'Hukum', lomba: 'Moot Court Regional', juara: 'Juara 3', tanggal: '16 Apr 2026', kategori: 'Akademik' },
  { id: 'pend-004', nama: 'Nabilah Azzahra', nim: '2022330011', prodi: 'Psikologi', lomba: 'Debat Bahasa Inggris', juara: 'Juara 1', tanggal: '15 Apr 2026', kategori: 'Seni & Budaya' },
  { id: 'pend-005', nama: 'Hendra Wijaksana', nim: '2020150063', prodi: 'Teknik Elektro', lomba: 'Robotics Championship', juara: 'Juara 1', tanggal: '14 Apr 2026', kategori: 'Teknologi' },
  { id: 'pend-006', nama: 'Putri Amalia Sari', nim: '2022360022', prodi: 'Farmasi', lomba: 'Pharmacy Science Expo', juara: 'Juara 2', tanggal: '13 Apr 2026', kategori: 'Sains' },
];

export default function PendingVerifikasiTable() {
  const [items, setItems] = useState(pendingData);
  const [processing, setProcessing] = useState<string | null>(null);

  const handleVerify = async (id: string, action: 'approve' | 'reject') => {
    setProcessing(id);
    // TODO: Backend — PATCH /api/prestasi/:id/verify with { action }
    await new Promise((r) => setTimeout(r, 700));
    setItems((prev) => prev.filter((p) => p.id !== id));
    setProcessing(null);
    if (action === 'approve') {
      toast.success('Prestasi berhasil diverifikasi dan akan tampil di Wall of Fame');
    } else {
      toast.error('Prestasi ditolak. Notifikasi telah dikirim ke mahasiswa.');
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <Clock size={18} className="text-amber-500" />
          <h3 className="text-base font-bold text-slate-800">Menunggu Verifikasi</h3>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold tabular-nums">
            {items.length}
          </span>
        </div>
        <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
          Lihat Semua →
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <CheckCircle size={32} className="text-emerald-400 mb-3" />
          <p className="text-sm font-semibold text-slate-700">Semua submisi sudah diverifikasi!</p>
          <p className="text-xs text-slate-500 mt-1">Tidak ada yang menunggu persetujuan.</p>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mahasiswa</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Lomba</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Juara</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Tanggal</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item) => (
                <tr key={item.id} className="table-row-hover">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800 text-sm">{item.nama}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{item.nim} · {item.prodi}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-slate-700 max-w-[180px] truncate">{item.lomba}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg
                      ${item.juara === 'Juara 1' ? 'bg-amber-100 text-amber-700' :
                        item.juara === 'Juara 2'? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-700'}`}>
                      {item.juara}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="text-xs text-slate-500">{item.tanggal}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                        title="Lihat detail prestasi"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleVerify(item.id, 'approve')}
                        disabled={processing === item.id}
                        className="p-1.5 rounded-lg hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                        title="Verifikasi prestasi ini"
                      >
                        {processing === item.id ? (
                          <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin block" />
                        ) : (
                          <CheckCircle size={15} />
                        )}
                      </button>
                      <button
                        onClick={() => handleVerify(item.id, 'reject')}
                        disabled={processing === item.id}
                        className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Tolak prestasi ini"
                      >
                        <XCircle size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}