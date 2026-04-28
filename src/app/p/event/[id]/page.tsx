'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AppImage from '@/components/ui/AppImage';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import Lightbox from '@/components/ui/Lightbox';
import { ArrowLeft, CalendarDays, MapPin, Users, Clock, UserCheck, Link as LinkIcon, Mic2, Maximize2 } from 'lucide-react';

export default function PublicEventPage({ params }: { params: Promise<{ id: string }> }) {
  const [event, setEvent] = useState<any>(null);
  const [currentPeserta, setCurrentPeserta] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params;
      const supabase = createClient();
      
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (eventError || !eventData) {
        setEvent(null);
        setLoading(false);
        return;
      }

      setEvent(eventData);

      const { count: registeredCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);

      setCurrentPeserta(registeredCount || 0);
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

  if (!event) {
    notFound();
  }

  const fillPct = Math.min(100, Math.round((currentPeserta / (event.quota || 100)) * 100));
  const isFull = currentPeserta >= (event.quota || 100);

  const getStatusBadge = () => {
    switch (event.status) {
      case 'upcoming':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">Akan Datang</span>;
      case 'ongoing':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">Sedang Berlangsung</span>;
      case 'done':
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">Selesai</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">Dibatalkan</span>;
      default:
        return null;
    }
  };

  const isExpired = () => {
    return event.status === 'done' || event.status === 'cancelled';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <LandingNav />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6">
            <Link href="/#event" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
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
              {event.poster_url ? (
                <>
                  {/* Blurred Background */}
                  <div className="absolute inset-0 scale-110 blur-2xl opacity-50">
                    <AppImage 
                      src={event.poster_url} 
                      alt="" 
                      fill 
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  {/* Main Image */}
                  <div className="relative h-full w-full flex items-center justify-center p-4">
                    <AppImage 
                      src={event.poster_url} 
                      alt={event.title} 
                      fill 
                      style={{ objectFit: 'contain' }}
                      className="group-hover:scale-[1.02] transition-transform duration-700 shadow-2xl rounded-lg"
                    />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CalendarDays size={64} className="text-slate-300" />
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
                  <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">
                    {event.type || 'Event'}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  {event.title}
                </h1>
                <div className="flex items-center gap-2 text-slate-300 mt-2 text-sm font-medium">
                  <MapPin size={14} />
                  <span>{event.location || 'Online'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* Left Content (Details) */}
              <div className="md:col-span-2 p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Tentang Event Ini</h3>
                <div className="prose prose-slate prose-sm max-w-none text-slate-600">
                  {event.description ? (
                    <div dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <p className="italic">Tidak ada deskripsi tersedia.</p>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.mentor && (
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Narasumber</p>
                        <p className="text-sm font-bold text-slate-800">{event.mentor}</p>
                        {(event.mentor_role || event.institusi_narasumber) && (
                          <p className="text-xs text-slate-500">
                            {[event.mentor_role, event.institusi_narasumber].filter(Boolean).join(' - ')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Lokasi</p>
                        <p className="text-sm font-bold text-slate-800">{event.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {event.syarat_ketentuan && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Syarat & Ketentuan</h3>
                    <div className="prose prose-slate prose-sm max-w-none text-slate-600">
                      <div dangerouslySetInnerHTML={{ __html: event.syarat_ketentuan.replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                )}
                
                {event.cara_pendaftaran && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Cara Pendaftaran</h3>
                    <div className="prose prose-slate prose-sm max-w-none text-slate-600">
                      <div dangerouslySetInnerHTML={{ __html: event.cara_pendaftaran.replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar (Info & CTA) */}
              <div className="p-6 md:p-8 bg-slate-50/50">
                <div className="space-y-6">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal</p>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-indigo-500" />
                      <span className="font-semibold text-sm text-slate-700">
                        {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    {event.end_date && (
                      <p className="text-xs text-slate-500 mt-1 pl-6">
                        s.d. {new Date(event.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>

                  {event.time && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Waktu (WIB)</p>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-indigo-500" />
                        <span className="font-semibold text-sm text-slate-700">
                          {event.time}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kuota Peserta</p>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-slate-700">
                        {currentPeserta} / {event.quota || 100}
                      </span>
                      {isFull && <span className="text-[10px] font-bold text-red-600 uppercase">Penuh</span>}
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-indigo-500'}`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                    <Link 
                      href="/event-management" 
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold transition-all
                        ${isExpired() || isFull
                          ? 'bg-slate-400 cursor-not-allowed hover:bg-slate-400' 
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200'}`}
                    >
                      Daftar Event
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
        src={event.poster_url || ''}
        alt={event.title}
        title={event.title}
      />
    </div>
  );
}
