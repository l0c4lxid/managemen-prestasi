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
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <LandingNav />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6">
            <Link href="/#lomba" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
              <ArrowLeft size={16} />
              Kembali ke Beranda
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft-xl overflow-hidden">
            {/* Banner Area */}
            <div 
              className="relative h-64 md:h-[28rem] w-full bg-slate-200 cursor-pointer group overflow-hidden"
              onClick={() => setIsLightboxOpen(true)}
            >
              {lomba.poster_url ? (
                <>
                  {/* Blurred Background */}
                  <div className="absolute inset-0 scale-110 blur-2xl opacity-50">
                    <AppImage 
                      src={lomba.poster_url} 
                      alt="" 
                      fill 
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  {/* Main Image */}
                  <div className="relative h-full w-full flex items-center justify-center p-4">
                    <AppImage 
                      src={lomba.poster_url} 
                      alt={lomba.title} 
                      fill 
                      style={{ objectFit: 'contain' }}
                      className="group-hover:scale-[1.02] transition-transform duration-700 shadow-2xl rounded-lg"
                    />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Swords size={64} className="text-slate-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Zoom Indicator */}
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                  <Maximize2 size={20} />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {getStatusBadge()}
                  <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full">
                    {lomba.kategori || 'Akademik'}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/10">
                    {lomba.tingkat || 'Nasional'}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  {lomba.title}
                </h1>
                {lomba.organizer && (
                  <p className="text-slate-300 mt-2 font-medium">Penyelenggara: {lomba.organizer}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* Left Content (Details) */}
              <div className="md:col-span-2 p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Deskripsi Lomba</h3>
                <div className="prose prose-slate prose-sm max-w-none text-slate-600">
                  {lomba.description ? (
                    <div dangerouslySetInnerHTML={{ __html: lomba.description.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <p className="italic">Tidak ada deskripsi tersedia.</p>
                  )}
                </div>

                {lomba.syarat_ketentuan && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Syarat & Ketentuan</h3>
                    <div className="prose prose-slate prose-sm max-w-none text-slate-600">
                      <div dangerouslySetInnerHTML={{ __html: lomba.syarat_ketentuan.replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                )}
                
                {lomba.cara_pendaftaran && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Cara Pendaftaran</h3>
                    <div className="prose prose-slate prose-sm max-w-none text-slate-600">
                      <div dangerouslySetInnerHTML={{ __html: lomba.cara_pendaftaran.replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar (Info & CTA) */}
              <div className="p-6 md:p-8 bg-slate-50/50">
                <div className="space-y-6">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status Pendaftaran</p>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className={isExpired() ? 'text-red-500' : 'text-indigo-500'} />
                      <span className={`font-semibold text-sm ${isExpired() ? 'text-red-600' : 'text-slate-700'}`}>
                        {getDeadlineText()}
                      </span>
                    </div>
                    {lomba.deadline && (
                      <p className="text-xs text-slate-500 mt-1 pl-6">
                        Ditutup pada: {new Date(lomba.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>

                  {lomba.tanggal_mulai && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Pelaksanaan</p>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-indigo-500" />
                        <span className="font-semibold text-sm text-slate-700">
                          {new Date(lomba.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )}

                  {lomba.prize && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hadiah</p>
                      <div className="flex items-start gap-2">
                        <Trophy size={16} className="text-amber-500 shrink-0 mt-0.5" />
                        <span className="font-semibold text-sm text-slate-700">
                          {lomba.prize}
                        </span>
                      </div>
                    </div>
                  )}

                  {lomba.link && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Link Referensi</p>
                      <a 
                        href={lomba.link.startsWith('http') ? lomba.link : `https://${lomba.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        <LinkIcon size={14} />
                        Kunjungi Website
                      </a>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-200">
                    <Link 
                      href="/lomba-management" 
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold transition-all
                        ${isExpired() || lomba.status !== 'active' 
                          ? 'bg-slate-400 cursor-not-allowed hover:bg-slate-400' 
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200'}`}
                    >
                      Daftar Kompetisi
                    </Link>
                    <p className="text-center text-[11px] text-slate-500 mt-3">
                      *Akan diarahkan ke sistem akademik (login diperlukan)
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
