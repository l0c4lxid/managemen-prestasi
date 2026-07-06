'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swords, Clock, Bookmark, BookmarkCheck, ExternalLink, Maximize2, Search } from 'lucide-react';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import AppImage from '@/components/ui/AppImage';
import Lightbox from '@/components/ui/Lightbox';
import { createClient } from '@/lib/supabase/client';

function daysLeft(deadline: string): number {
  const now = new Date();
  const d = new Date(deadline);
  const nowOnlyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dOnlyDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
  const diffTime = dOnlyDate.getTime() - nowOnlyDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function PublicLombaPage() {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string, title: string, id: string} | null>(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setCompetitions(data);
      }
      setLoading(false);
    };
    fetchCompetitions();
  }, []);

  const filteredCompetitions = competitions.filter(item => {
    const titleMatch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (item.organizer || '').toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory || item.kategori === selectedCategory;
    const levelMatch = selectedLevel === 'All' || (item.level || '').toLowerCase() === selectedLevel.toLowerCase() || (item.tingkat || '').toLowerCase() === selectedLevel.toLowerCase();
    return titleMatch && categoryMatch && levelMatch;
  });

  const categories = ['All', ...Array.from(new Set(competitions.map(c => c.kategori || c.category).filter(Boolean)))];
  const levels = ['All', 'Kampus', 'Regional', 'Nasional', 'Internasional'];

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex-grow bg-slate-50 font-sans flex flex-col min-h-screen overflow-x-hidden">
      <LandingNav />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Temukan & Ikuti <span className="text-indigo-600">Lomba</span> Bergengsi
            </h1>
            <p className="text-lg text-slate-500">
              Kembangkan potensi diri dan raih prestasi maksimal melalui daftar kompetisi nasional maupun internasional dari berbagai bidang keilmuan.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-12 bg-white p-6 rounded-3xl border border-slate-100 shadow-soft-sm">
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari kompetisi, penyelenggara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm text-slate-700"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 items-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tingkat:</span>
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedLevel === lvl
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredCompetitions.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-soft-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl shadow-inner flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Swords size={32} className="text-slate-300" />
              </div>
              <h3 className="text-slate-700 font-extrabold text-lg">Kompetisi Tidak Ditemukan</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
                Coba sesuaikan kata kunci pencarian atau ubah filter kategori dan tingkat yang Anda gunakan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompetitions.map((item) => {
                const days = daysLeft(item.deadline);
                const isBookmarked = bookmarked.has(item.id);
                const isPast = days < 0;
                const isUrgent = !isPast && days <= 3;
                const categoryColor = item.category === 'Non-Akademik' || item.kategori === 'Non-Akademik' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100';
                const itemImg = item.poster_url || "https://img.rocket.new/generatedImages/rocket_gen_img_1c76a5ca9-1763300171126.png";

                return (
                  <div
                    key={item.id}
                    className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image container */}
                    <div 
                      className="relative h-56 overflow-hidden cursor-pointer bg-slate-50"
                      onClick={() => setSelectedImage({ src: itemImg, alt: item.title, title: item.title, id: item.slug || item.id })}
                    >
                      <AppImage 
                        src={itemImg} 
                        alt={item.title} 
                        fill 
                        style={{ objectFit: 'contain' }}
                        className="group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                          <Maximize2 size={24} />
                        </div>
                      </div>
                      
                      <div className="absolute top-3 right-3 z-10" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => toggleBookmark(item.id)}
                          className={`p-2 rounded-xl backdrop-blur-md shadow-sm transition-all duration-200
                            ${isBookmarked ? 'bg-white text-indigo-600 scale-110' : 'bg-white/80 text-slate-500 hover:bg-white hover:text-indigo-600'}`}
                          title={isBookmarked ? 'Hapus bookmark' : 'Simpan lomba ini'}
                        >
                          {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 z-10">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${categoryColor} border-none`}>
                          {item.kategori || item.category || 'Lomba'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex-1">
                        <Link href={`/p/lomba/${item.slug || item.id}`}>
                          <h3 className="text-base font-bold text-slate-800 leading-snug mb-2 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-500 mb-4">{item.organizer || 'Kampus'}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Hadiah</p>
                            <p className="text-xs font-bold text-slate-700 mt-1 truncate">{item.prize || 'Sertifikat'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Tingkat</p>
                            <p className="text-xs font-bold text-slate-700 mt-1">{item.tingkat || item.level || 'Nasional'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className={`flex items-center gap-1.5 text-xs font-bold
                          ${isPast ? 'text-slate-400' : isUrgent ? 'text-rose-600' : 'text-slate-500'}`}>
                          <Clock size={14} className={isUrgent ? 'animate-pulse' : ''} />
                          {isPast ? 'Sudah lewat' : days === 0 ? 'Hari ini!' : `${days} hari lagi`}
                        </div>
                        <Link
                          href={`/p/lomba/${item.slug || item.id}`}
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
          )}

        </div>
      </main>

      <LandingFooter />

      <Lightbox 
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        src={selectedImage?.src || ''}
        alt={selectedImage?.alt || ''}
        title={selectedImage?.title}
        detailHref={selectedImage ? `/p/lomba/${selectedImage.id}` : undefined}
      />
    </div>
  );
}
