'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Medal, Filter } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { createClient } from '@/lib/supabase/client';

const achievers = [
  {
    id: 'w-1',
    name: 'Oktavian Ramadhani',
    nim: '12220001',
    prodi: 'Informatika',
    lomba: 'Juara 3 Sayembara Desain Logo Dies Natalis UTP Surakarta Ke 45',
    tahun: '2024',
    juara: 3,
    kategori: 'Seni & Budaya',
    img: '/poster-2.png'
  },
  {
    id: 'w-2',
    name: 'Muhammad Fahrel Yuliyanto',
    nim: '12220002',
    prodi: 'Sistem Informasi',
    lomba: 'Peserta Kompetisi Video Kreatif 4C National Competition',
    tahun: '2024',
    juara: 0,
    kategori: 'Teknologi',
    img: '/poster-1.png'
  },
  {
    id: 'w-3',
    name: 'Febriana Ida Nugraheni',
    nim: '12220003',
    prodi: 'Informatika',
    lomba: 'Caraka Terpilih Kampus Mengajar Angkatan 8 Jawa Tengah',
    tahun: '2024',
    juara: 1,
    kategori: 'Akademik',
    img: '/poster-6.png'
  },
  {
    id: 'w-4',
    name: 'Shandy Aulia Ramadhani',
    nim: '12220004',
    prodi: 'Sistem Informasi',
    lomba: 'Juara 2 Video Favorit BSI Explore 2025',
    tahun: '2025',
    juara: 2,
    kategori: 'Teknologi',
    img: '/poster-4.png'
  }
];

import Lightbox from '@/components/ui/Lightbox';

const tahunOptions = ['Semua', '2026', '2025', '2024'];
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<any>(null);
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
          { id: 'static-1', image_url: '/poster-1.png', title: 'Prestasi Mahasiswa' },
          { id: 'static-2', image_url: '/poster-2.png', title: 'Prestasi Mahasiswa' },
          { id: 'static-3', image_url: '/poster-3.png', title: 'Prestasi Mahasiswa' },
          { id: 'static-4', image_url: '/poster-4.png', title: 'Prestasi Mahasiswa' },
          { id: 'static-5', image_url: '/poster-5.png', title: 'Prestasi Mahasiswa' },
          { id: 'static-6', image_url: '/poster-6.png', title: 'Prestasi Mahasiswa' },
          { id: 'static-7', image_url: '/poster-7.png', title: 'Prestasi Mahasiswa' },
        ]);
      }
    };
    
    fetchPosters();
  }, []);

  const openLightbox = (poster: any) => {
    setSelectedPoster(poster);
    setIsLightboxOpen(true);
  };

  // Map supabase data to our local format
  const dbData = initialData.map((item, i) => ({
    id: item.id,
    name: item.users?.name || 'Mahasiswa',
    nim: item.users?.nim || '-',
    prodi: item.category || 'Mahasiswa',
    lomba: item.title,
    tahun: new Date(item.created_at).getFullYear().toString(),
    juara: (i % 3) + 1, // Fallback for display
    kategori: item.category || 'Akademik',
    img: item.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.users?.name || 'M')}&background=random`
  }));

  const mappedData = [...achievers, ...dbData];

  const filtered = mappedData.filter((a) => {
    const matchTahun = tahun === 'Semua' || a.tahun === tahun;
    const matchKategori = kategori === 'Semua' || a.kategori === kategori;
    return matchTahun && matchKategori;
  });

  return (
    <section id="prestasi" className="py-20 bg-gradient-to-b from-white to-slate-50 transition-colors">
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
              Galeri Juara
            </div>
            <h2 className="section-header">Galeri Prestasi Mahasiswa</h2>
            <p className="text-slate-500 mt-2 text-sm">Koleksi pencapaian luar biasa dan momen kemenangan mahasiswa Universitas BSI Kampus Solo.</p>
          </div>
          
          <div className="overflow-hidden w-full relative group">
            {/* Gradient Fades for Smooth Edges */}
            <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

            <div className={`animate-marquee flex gap-6 pb-8 pt-4 ${isLightboxOpen ? '[animation-play-state:paused]' : ''}`}>
              {/* Set 1 */}
              {posters.map((poster) => (
                <div 
                  key={`poster-1-${poster.id}`} 
                  onClick={() => openLightbox(poster)}
                  className="shrink-0 w-[70vw] sm:w-[280px] md:w-[320px] aspect-[1/1.4] relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white transition-transform duration-300 hover:scale-[1.05] cursor-pointer group/item"
                >
                  <AppImage
                    src={poster.image_url}
                    alt={poster.title}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 640px) 70vw, 320px"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/30 text-xs font-bold uppercase tracking-wider">Perbesar</span>
                  </div>
                </div>
              ))}
              {/* Set 2 (for seamless loop) */}
              {posters.map((poster) => (
                <div 
                  key={`poster-2-${poster.id}`} 
                  onClick={() => openLightbox(poster)}
                  className="shrink-0 w-[70vw] sm:w-[280px] md:w-[320px] aspect-[1/1.4] relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white transition-transform duration-300 hover:scale-[1.05] cursor-pointer group/item"
                >
                  <AppImage
                    src={poster.image_url}
                    alt={poster.title}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 640px) 70vw, 320px"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/30 text-xs font-bold uppercase tracking-wider">Perbesar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isLightboxOpen && selectedPoster && (
          <Lightbox 
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            src={selectedPoster.image_url}
            alt={selectedPoster.title}
            title={selectedPoster.title}
          />
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mb-3 uppercase tracking-wider">
              <Trophy size={13} />
              Hall of Fame
            </div>
            <h2 className="section-header">Mahasiswa Berprestasi</h2>
            <p className="text-slate-500 mt-2 text-sm">Raih prestasi terbaik, jadilah inspirasi bagi sesama.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Filter size={14} className="text-slate-400" />
            <div className="flex gap-1.5 flex-wrap">
              {tahunOptions.map((t) => (
                <button
                  key={`filter-tahun-${t}`}
                  onClick={() => setTahun(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 uppercase tracking-widest
                    ${tahun === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {kategoriOptions.map((k) => (
                <button
                  key={`filter-kat-${k}`}
                  onClick={() => setKategori(k)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 uppercase tracking-widest
                    ${kategori === k ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' : 'bg-white text-slate-500 border border-slate-200 hover:border-cyan-300 hover:text-cyan-600'}`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filtered.map((a) => {
            const badge = juaraBadge(a.juara);
            return (
              <Link
                key={a.id}
                href={`/p/prestasi/${a.id}`}
                className="group relative bg-white rounded-3xl border border-slate-100 overflow-hidden 
                  shadow-soft hover:shadow-premium hover:-translate-y-2 transition-all duration-300 cursor-pointer block"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <AppImage
                    src={a.img}
                    alt={`Foto ${a.name}, mahasiswa berprestasi juara ${a.juara} lomba ${a.lomba}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest leading-relaxed mb-1 line-clamp-2">{a.lomba}</p>
                    <p className="text-white/60 text-[9px] font-bold uppercase tracking-wider">{a.prodi}</p>
                  </div>
                  {/* Badge */}
                  <div className="absolute top-3 right-3 scale-90 origin-top-right group-hover:scale-100 transition-transform duration-300">
                    <span className={badge.className}>
                      {badge.icon}
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-white transition-colors">
                  <p className="text-sm font-bold text-slate-800 truncate leading-tight mb-1">{a.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-wider">{a.prodi}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400 font-bold tracking-tighter">{a.nim}</span>
                    <span className="text-[10px] text-indigo-500 font-black">{a.tahun}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 mt-10">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-soft">
              <Trophy size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Belum ada prestasi untuk filter ini</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="text-center mt-16">
            <button className="px-8 py-4 rounded-2xl border-2 border-indigo-600 text-indigo-600 text-sm font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-indigo-600/10">
              Lihat Semua Prestasi
            </button>
          </div>
        )}
      </div>
    </section>
  );
}