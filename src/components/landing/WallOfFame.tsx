'use client';
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Filter } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { createClient } from '@/lib/supabase/client';

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
  const [posters, setPosters] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchPosters = async () => {
      const { data } = await supabase
        .from('wall_of_fame_posters')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setPosters(data);
      } else {
        // Fallback to static posters if none exist
        setPosters([
          { id: 'static-1', image_url: '/poster-1.png', title: 'Poster 1' },
          { id: 'static-2', image_url: '/poster-2.png', title: 'Poster 2' },
          { id: 'static-3', image_url: '/poster-3.png', title: 'Poster 3' },
          { id: 'static-4', image_url: '/poster-4.png', title: 'Poster 4' },
          { id: 'static-5', image_url: '/poster-5.png', title: 'Poster 5' },
          { id: 'static-6', image_url: '/poster-6.png', title: 'Poster 6' },
          { id: 'static-7', image_url: '/poster-7.png', title: 'Poster 7' },
        ]);
      }
    };
    
    fetchPosters();
  }, []);

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
        {/* Custom Styles for Marquee */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
            width: max-content;
            will-change: transform;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />

        {/* Poster Gallery */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
              <Trophy size={13} />
              Galeri Poster
            </div>
            <h2 className="section-header">Poster Prestasi Kampus</h2>
            <p className="text-slate-500 mt-2 text-sm">Berbagai poster pencapaian dan kompetisi mahasiswa.</p>
          </div>
          
          <div className="overflow-hidden w-full relative group">
            {/* Gradient Fades for Smooth Edges */}
            <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

            <div className="animate-marquee flex gap-6 pb-8 pt-4">
              {/* Set 1 */}
              {posters.map((poster) => (
                <div 
                  key={`poster-1-${poster.id}`} 
                  className="shrink-0 w-[70vw] sm:w-[280px] md:w-[320px] aspect-[1/1.4] relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white transition-transform duration-300 hover:scale-[1.02]"
                >
                  <AppImage
                    src={poster.image_url}
                    alt={poster.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 70vw, 320px"
                  />
                </div>
              ))}
              {/* Set 2 (for seamless loop) */}
              {posters.map((poster) => (
                <div 
                  key={`poster-2-${poster.id}`} 
                  className="shrink-0 w-[70vw] sm:w-[280px] md:w-[320px] aspect-[1/1.4] relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white transition-transform duration-300 hover:scale-[1.02]"
                >
                  <AppImage
                    src={poster.image_url}
                    alt={poster.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 70vw, 320px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

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