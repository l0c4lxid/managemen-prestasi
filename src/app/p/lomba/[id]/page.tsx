'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AppImage from '@/components/ui/AppImage';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import Lightbox from '@/components/ui/Lightbox';
import { ArrowLeft, Swords, Clock, Calendar, Trophy, Tag, Link as LinkIcon, AlertCircle, Maximize2 } from 'lucide-react';

export default function PublicLombaPage({ params }: { params: Promise<{ id: string }> }) {
  const [lomba, setLomba] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params;
      const supabase = createClient();
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        setLomba(null);
      } else {
        setLomba(data);
      }
      setLoading(false);
    };
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lomba) {
    notFound();
  }

  const getStatusBadge = () => {
    switch (lomba.status) {
      case 'active':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">Aktif</span>;
      case 'closed':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full border border-orange-200">Tutup</span>;
      case 'archived':
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">Diarsipkan</span>;
      default:
        return null;
    }
  };

  const getDeadlineText = () => {
    if (!lomba.deadline) return 'Tidak ada deadline';
    const deadlineDate = new Date(lomba.deadline);
    const diffTime = deadlineDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Telah Berakhir';
    if (diffDays === 0) return 'Berakhir Hari Ini';
    return `${diffDays} hari lagi`;
  };

  const isExpired = () => {
    if (!lomba.deadline) return false;
    return new Date(lomba.deadline).getTime() < new Date().getTime();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col transition-colors duration-300">
      <LandingNav />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <Link href="/#lomba" className="inline-flex items-center gap-2.5 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all group">
              <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-soft group-hover:scale-110 transition-transform">
                <ArrowLeft size={18} />
              </div>
              <span className="uppercase tracking-widest text-xs">Kembali ke Beranda</span>
            </Link>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden">
            {/* Banner Area */}
            <div 
              className="relative h-72 md:h-[32rem] w-full bg-slate-200 cursor-pointer group overflow-hidden"
              onClick={() => setIsLightboxOpen(true)}
            >
              {lomba.poster_url ? (
                <>
                  {/* Blurred Background */}
                  <div className="absolute inset-0 scale-110 blur-3xl opacity-40">
                    <AppImage 
                      src={lomba.poster_url} 
                      alt="" 
                      fill 
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  {/* Main Image */}
                  <div className="relative h-full w-full flex items-center justify-center p-4 md:p-8">
                    <AppImage 
                      src={lomba.poster_url} 
                      alt={lomba.title} 
                      fill 
                      style={{ objectFit: 'contain' }}
                      className="group-hover:scale-[1.03] transition-transform duration-1000 shadow-2xl rounded-2xl"
                    />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <Swords size={80} className="text-slate-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              
              {/* Zoom Indicator */}
              <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-xl">
                  <Maximize2 size={24} />
                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  {getStatusBadge()}
                  <span className="px-3.5 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg shadow-indigo-600/20">
                    {lomba.kategori || 'Akademik'}
                  </span>
                  <span className="px-3.5 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/20 uppercase tracking-widest">
                    {lomba.tingkat || 'Nasional'}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight drop-shadow-lg max-w-3xl">
                  {lomba.title}
                </h1>
                {lomba.organizer && (
                  <p className="text-slate-200 mt-4 font-bold text-sm md:text-base flex items-center gap-2">
                    <span className="w-6 h-[2px] bg-indigo-500 rounded-full" />
                    {lomba.organizer}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* Left Content (Details) */}
              <div className="md:col-span-2 p-8 md:p-12">
                <div className="space-y-12">
                  <section>
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-widest text-sm border-l-4 border-indigo-600 pl-4">
                      Deskripsi Lomba
                    </h3>
                    <div className="prose prose-slate prose-base max-w-none text-slate-600 leading-relaxed font-medium">
                      {lomba.description ? (
                        <div dangerouslySetInnerHTML={{ __html: lomba.description.replace(/\n/g, '<br/>') }} />
                      ) : (
                        <p className="italic opacity-50">Tidak ada deskripsi tersedia.</p>
                      )}
                    </div>
                  </section>

                  {lomba.syarat_ketentuan && (
                    <section>
                      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-widest text-sm border-l-4 border-indigo-600 pl-4">
                        Syarat & Ketentuan
                      </h3>
                      <div className="prose prose-slate prose-base max-w-none text-slate-600 leading-relaxed font-medium">
                        <div dangerouslySetInnerHTML={{ __html: lomba.syarat_ketentuan.replace(/\n/g, '<br/>') }} />
                      </div>
                    </section>
                  )}
                  
                  {lomba.cara_pendaftaran && (
                    <section>
                      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-widest text-sm border-l-4 border-indigo-600 pl-4">
                        Cara Pendaftaran
                      </h3>
                      <div className="prose prose-slate prose-base max-w-none text-slate-600 leading-relaxed font-medium">
                        <div dangerouslySetInnerHTML={{ __html: lomba.cara_pendaftaran.replace(/\n/g, '<br/>') }} />
                      </div>
                    </section>
                  )}
                </div>
              </div>

              {/* Right Sidebar (Info & CTA) */}
              <div className="p-8 md:p-10 bg-slate-50/50">
                <div className="space-y-8 sticky top-28">
                  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-soft">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Informasi Pendaftaran</p>
                    <div className="space-y-5">
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-xl ${isExpired() ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'}`}>
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className={`font-bold text-base leading-tight ${isExpired() ? 'text-red-600' : 'text-slate-800'}`}>
                            {getDeadlineText()}
                          </p>
                          {lomba.deadline && (
                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                              Hingga {new Date(lomba.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          )}
                        </div>
                      </div>

                      {lomba.tanggal_mulai && (
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-base leading-tight text-slate-800">
                              Mulai Pelaksanaan
                            </p>
                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                              {new Date(lomba.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      )}

                      {lomba.prize && (
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500">
                            <Trophy size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-base leading-tight text-slate-800">
                              Hadiah Utama
                            </p>
                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                              {lomba.prize}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {lomba.link && (
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-soft">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Link Eksternal</p>
                      <a 
                        href={lomba.link.startsWith('http') ? lomba.link : `https://${lomba.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                            <LinkIcon size={18} />
                          </div>
                          <span className="font-bold text-sm text-slate-700 group-hover:text-indigo-600 transition-colors">Website Resmi</span>
                        </div>
                        <div className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                          <ArrowLeft size={16} className="rotate-180" />
                        </div>
                      </a>
                    </div>
                  )}

                  <div className="pt-2">
                    <Link 
                      href="/lomba-management" 
                      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.15em] transition-all
                        ${isExpired() || lomba.status !== 'active' 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 hover:-translate-y-1 active:scale-95'}`}
                    >
                      Daftar Sekarang
                    </Link>
                    <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest leading-loose">
                      Login diperlukan untuk akses sistem pendaftaran
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <LandingFooter />

      <Lightbox 
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        src={lomba.poster_url || ''}
        alt={lomba.title}
        title={lomba.title}
      />
    </div>
  );
}
