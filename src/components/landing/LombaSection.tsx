'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Swords, Clock, Bookmark, BookmarkCheck, ExternalLink, Tag } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

function daysLeft(deadline: string): number {
  const now = new Date('2026-04-19');
  const d = new Date(deadline);
  return Math.max(0, Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function LombaSection({ initialData = [] }: { initialData?: any[] }) {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const mappedData = initialData.map(item => ({
    id: item.id,
    nama: item.title,
    penyelenggara: item.organizer || 'Kampus',
    kategori: item.category || 'Akademik',
    tingkat: item.level || 'Nasional',
    deadline: item.deadline,
    hadiah: item.prize || 'Sertifikat',
    peserta: Math.floor(Math.random() * 50) + 10,
    img: item.poster_url || "https://img.rocket.new/generatedImages/rocket_gen_img_1c76a5ca9-1763300171126.png",
    color: item.category === 'Non-Akademik' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
  }));

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="lomba" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
              <Swords size={13} />
              Lomba Aktif
            </div>
            <h2 className="section-header">Kompetisi Tersedia</h2>
            <p className="text-slate-500 mt-2 text-sm">Temukan lomba yang sesuai dengan bidang dan minatmu.</p>
          </div>
          <Link href="/lomba-management" className="hidden sm:flex btn-ghost text-indigo-700 hover:bg-indigo-50">
            Lihat Semua
            <ExternalLink size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappedData.map((lomba) => {
            const days = daysLeft(lomba.deadline);
            const isBookmarked = bookmarked.has(lomba.id);
            const isUrgent = days <= 14;

            return (
              <div
                key={lomba.id}
                className="card overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-200 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <AppImage 
                    src={lomba.img} 
                    alt={lomba.nama} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={() => toggleBookmark(lomba.id)}
                      className={`p-2 rounded-xl backdrop-blur-md shadow-sm transition-all duration-200
                        ${isBookmarked ? 'bg-white text-indigo-600 scale-110' : 'bg-white/80 text-slate-500 hover:bg-white hover:text-indigo-600'}`}
                      title={isBookmarked ? 'Hapus bookmark' : 'Simpan lomba ini'}
                    >
                      {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 z-10">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${lomba.color} border-none`}>
                      {lomba.kategori}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-800 leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {lomba.nama}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">{lomba.penyelenggara}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Hadiah</p>
                        <p className="text-xs font-bold text-slate-700 mt-1 truncate">{lomba.hadiah}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Tingkat</p>
                        <p className="text-xs font-bold text-slate-700 mt-1">{lomba.tingkat}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className={`flex items-center gap-1.5 text-xs font-bold
                      ${isUrgent ? 'text-rose-600' : 'text-slate-500'}`}>
                      <Clock size={14} className={isUrgent ? 'animate-pulse' : ''} />
                      {days === 0 ? 'Hari ini!' : `${days} hari lagi`}
                    </div>
                    <Link
                      href={`/lomba-management`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-indigo-600 transition-colors"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {mappedData.length === 0 && (
          <div className="text-center py-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Swords size={32} className="text-slate-300" />
            </div>
            <h3 className="text-slate-700 font-extrabold text-lg">Belum Ada Lomba Aktif</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
              Saat ini belum ada kompetisi yang dibuka. Cek kembali secara berkala!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}