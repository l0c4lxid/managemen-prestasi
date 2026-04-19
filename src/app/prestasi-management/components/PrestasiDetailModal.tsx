'use client';
import React from 'react';
import { X, CheckCircle, XCircle, FileText, Trophy } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import type { Prestasi } from './PrestasiTable';

interface Props {
  item: Prestasi;
  onClose: () => void;
}

export default function PrestasiDetailModal({ item, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-soft-lg w-full max-w-lg animate-scale-in">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Trophy size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Detail Prestasi</h2>
            <p className="text-xs font-mono text-slate-400">{item.id}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <StatusBadge status={item.status} />
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Mahasiswa */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Mahasiswa</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Nama</p>
                <p className="font-semibold text-slate-800 mt-0.5">{item.nama}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">NIM</p>
                <p className="font-mono font-semibold text-slate-800 mt-0.5">{item.nim}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Program Studi</p>
                <p className="font-medium text-slate-700 mt-0.5">{item.prodi}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Angkatan</p>
                <p className="font-medium text-slate-700 mt-0.5">{item.angkatan}</p>
              </div>
            </div>
          </div>

          {/* Lomba */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Lomba & Prestasi</p>
            <div className="space-y-2.5 text-sm">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Nama Lomba</p>
                <p className="font-semibold text-slate-800 mt-0.5">{item.lomba}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Penyelenggara</p>
                  <p className="font-medium text-slate-700 mt-0.5">{item.penyelenggara}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Tanggal</p>
                  <p className="font-medium text-slate-700 mt-0.5">{item.tanggal}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Kategori</p>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-xs font-medium mt-0.5">{item.kategori}</span>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Tingkat</p>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold mt-0.5
                    ${item.tingkat === 'Internasional' ? 'bg-purple-100 text-purple-700' : item.tingkat === 'Nasional' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    {item.tingkat}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Peringkat</p>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold mt-0.5
                  ${item.juara === 'Juara 1' ? 'bg-amber-100 text-amber-700' : item.juara === 'Juara 2' ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-700'}`}>
                  {item.juara}
                </span>
              </div>
            </div>
          </div>

          {/* Sertifikat + Catatan */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium flex-1
              ${item.sertifikat ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
              {item.sertifikat ? <CheckCircle size={15} /> : <XCircle size={15} />}
              {item.sertifikat ? 'Sertifikat tersedia' : 'Sertifikat belum diunggah'}
            </div>
            {item.sertifikat && (
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition-colors">
                <FileText size={14} />
                Lihat File
              </button>
            )}
          </div>

          {item.catatan && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs font-bold text-amber-700 mb-1">Catatan Admin</p>
              <p className="text-sm text-amber-800">{item.catatan}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="btn-ghost border border-slate-200">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}