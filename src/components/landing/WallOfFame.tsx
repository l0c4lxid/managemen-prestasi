'use client';
import React, { useState } from 'react';
import { Trophy, Medal, Filter } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

const achievers: any[] = [];

const tahunOptions = ['Semua', '2026', '2025'];
const kategoriOptions = ['Semua', 'Akademik', 'Non-Akademik', 'Teknologi', 'Sains', 'Seni & Budaya'];

const juaraBadge = (juara: number) => {
  if (juara === 1) return { label: 'Juara 1', className: 'badge-gold', icon: <Trophy size={11} /> };
  if (juara === 2) return { label: 'Juara 2', className: 'badge-silver', icon: <Medal size={11} /> };
  return { label: 'Juara 3', className: 'badge-bronze', icon: <Medal size={11} /> };
};

export default function WallOfFame({ initialData = [] }: { initialData?: any[] }) {
  const [tahun, setTahun] = useState('Semua');
  const [kategori, setKategori] = useState('Semua');

  // Map supabase data to our local format
  const mappedData = initialData.map((item, i) => ({
    id: item.id,
    name: item.users?.name || 'Mahasiswa',
    nim: item.users?.nim || '-',
    prodi: item.category || 'Mahasiswa',
    lomba: item.title,
    tahun: new Date(item.created_at).getFullYear().toString(),
    juara: (i % 3) + 1,
    kategori: item.category || 'Akademik',
    img: item.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.users?.name || 'M')}&background=random`
  }));

  const filtered = mappedData.filter((a) => {
    const matchTahun = tahun === 'Semua' || a.tahun === tahun;
    const matchKategori = kategori === 'Semua' || a.kategori === kategori;
    return matchTahun && matchKategori;
  });

  return (
    <section id="wall-of-fame" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold mb-3">
              <Trophy size={13} />
              Hall of Fame
            </div>
            <h2 className="section-header">Mahasiswa Berprestasi</h2>
            <p className="text-slate-500 mt-2 text-sm">Raih prestasi terbaik, jadilah inspirasi bagi sesama.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <div className="flex gap-1 flex-wrap">
              {tahunOptions.map((t) => (
                <button
                  key={`filter-tahun-${t}`}
                  onClick={() => setTahun(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                    ${tahun === t ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              {kategoriOptions.map((k) => (
                <button
                  key={`filter-kat-${k}`}
                  onClick={() => setKategori(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                    ${kategori === k ? 'bg-cyan-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-cyan-300 hover:text-cyan-600'}`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((a) => {
            const badge = juaraBadge(a.juara);
            return (
              <div
                key={a.id}
                className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden 
                  shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <AppImage
                    src={a.img}
                    alt={`Foto ${a.name}, mahasiswa berprestasi juara ${a.juara} lomba ${a.lomba}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-bold leading-tight">{a.lomba}</p>
                    <p className="text-white/70 text-[10px] mt-0.5">{a.prodi}</p>
                  </div>
                  {/* Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={badge.className}>
                      {badge.icon}
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{a.name}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{a.prodi}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400 font-mono">{a.nim}</span>
                    <span className="text-[10px] text-slate-400">{a.tahun}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Trophy size={36} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Belum ada prestasi untuk filter ini</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="text-center mt-10">
            <button className="btn-outline">
              Lihat Semua Prestasi
            </button>
          </div>
        )}
      </div>
    </section>
  );
}