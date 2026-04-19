'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Swords, Clock, Bookmark, BookmarkCheck, ExternalLink, Tag } from 'lucide-react';

const lombaData = [
  { id: 'lomba-001', nama: 'PKM (Program Kreativitas Mahasiswa)', penyelenggara: 'Kemendikbudristek', kategori: 'Kewirausahaan', tingkat: 'Nasional', deadline: '2025-05-20', hadiah: 'Rp 50.000.000', peserta: 342, color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  { id: 'lomba-002', nama: 'GEMASTIK XVIII — Animasi', penyelenggara: 'Pusat Prestasi Nasional', kategori: 'Teknologi', tingkat: 'Nasional', deadline: '2025-06-10', hadiah: 'Rp 30.000.000', peserta: 189, color: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
  { id: 'lomba-003', nama: 'Olimpiade Sains Mahasiswa Bidang Matematika', penyelenggara: 'Dikti', kategori: 'Akademik', tingkat: 'Nasional', deadline: '2025-05-05', hadiah: 'Beasiswa + Sertifikat', peserta: 521, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { id: 'lomba-004', nama: 'International Business Plan Competition', penyelenggara: 'NUS Singapore', kategori: 'Kewirausahaan', tingkat: 'Internasional', deadline: '2025-07-15', hadiah: 'USD 10,000', peserta: 67, color: 'bg-purple-50 text-purple-700 border-purple-100' },
  { id: 'lomba-005', nama: 'Lomba Karya Tulis Ilmiah Nasional', penyelenggara: 'UNAIR', kategori: 'Akademik', tingkat: 'Nasional', deadline: '2025-05-28', hadiah: 'Rp 15.000.000', peserta: 278, color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { id: 'lomba-006', nama: 'National Robotics Championship', penyelenggara: 'ITS Surabaya', kategori: 'Teknologi', tingkat: 'Nasional', deadline: '2025-06-30', hadiah: 'Rp 25.000.000', peserta: 143, color: 'bg-rose-50 text-rose-700 border-rose-100' },
];

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
    peserta: Math.floor(Math.random() * 100), // Random placeholder for participants
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mappedData.map((lomba) => {
            const days = daysLeft(lomba.deadline);
            const isBookmarked = bookmarked.has(lomba.id);
            const isUrgent = days <= 14;

            return (
              <div
                key={lomba.id}
                className="card p-5 flex flex-col gap-4 hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-800 leading-snug mb-2 line-clamp-2">
                      {lomba.nama}
                    </h3>
                    <p className="text-xs text-slate-500">{lomba.penyelenggara}</p>
                  </div>
                  <button
                    onClick={() => toggleBookmark(lomba.id)}
                    className={`p-2 rounded-xl transition-all duration-150 flex-shrink-0
                      ${isBookmarked ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
                    title={isBookmarked ? 'Hapus bookmark' : 'Simpan lomba ini'}
                  >
                    {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-semibold ${lomba.color}`}>
                    <Tag size={10} />
                    {lomba.kategori}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold
                    ${lomba.tingkat === 'Internasional' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {lomba.tingkat}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 font-medium">Hadiah</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">{lomba.hadiah}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 font-medium">Peserta</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5 tabular-nums">{lomba.peserta} tim</p>
                  </div>
                </div>

                {/* Deadline + CTA */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className={`flex items-center gap-1.5 text-xs font-semibold
                    ${isUrgent ? 'text-red-600' : 'text-slate-600'}`}>
                    <Clock size={13} className={isUrgent ? 'text-red-500' : 'text-slate-400'} />
                    {days === 0 ? 'Hari ini!' : `${days} hari lagi`}
                  </div>
                  <Link
                    href="/sign-up-login"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold 
                      hover:bg-indigo-700 active:scale-95 transition-all duration-150"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {mappedData.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Swords size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-slate-600 font-bold">Belum Ada Lomba Aktif</h3>
            <p className="text-slate-400 text-sm mt-1">Cek kembali nanti untuk kompetisi terbaru.</p>
          </div>
        )}
      </div>
    </section>
  );
}