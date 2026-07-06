'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarDays, MapPin, Users, ArrowRight, Maximize2, Zap, ExternalLink, Search } from 'lucide-react';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import AppImage from '@/components/ui/AppImage';
import Lightbox from '@/components/ui/Lightbox';
import { createClient } from '@/lib/supabase/client';

export default function PublicEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string, title: string, id: string} | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.mentor || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || event.type === selectedType || event.tipe === selectedType;
    return matchesSearch && matchesType;
  });

  const types = ['All', ...Array.from(new Set(events.map(e => e.type || e.tipe || 'Event').filter(Boolean)))];

  return (
    <div className="flex-grow bg-slate-50 font-sans flex flex-col min-h-screen overflow-x-hidden">
      <LandingNav />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Jelajahi Semua <span className="text-indigo-600">Event</span> Eksklusif
            </h1>
            <p className="text-lg text-slate-500">
              Tingkatkan wawasan, keahlian, dan jejaring profesional Anda melalui berbagai agenda seminar, workshop, dan bootcamp terbaik kami.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 bg-white p-6 rounded-3xl border border-slate-100 shadow-soft-sm">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari event, narasumber, lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm text-slate-700"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest self-center mr-2">Tipe:</span>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedType === type
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-soft-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl shadow-inner flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Zap size={32} className="text-slate-300" />
              </div>
              <h3 className="text-slate-700 font-extrabold text-lg">Event Tidak Ditemukan</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
                Coba sesuaikan kata kunci pencarian atau filter tipe event yang Anda gunakan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const eventImg = event.poster_url || 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?q=80&w=800&auto=format&fit=crop';
                const tanggalStr = event.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
                const statusColor = event.status === 'done' ? 'bg-slate-500' : 'bg-indigo-600';
                
                return (
                  <div
                    key={event.id}
                    className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Banner Image */}
                    <div 
                      className="relative h-56 overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage({ src: eventImg, alt: event.title, title: event.title, id: event.slug || event.id })}
                    >
                      <AppImage
                        src={eventImg}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      
                      {/* Status Badges */}
                      <div className="absolute top-5 left-5">
                        <span className={`px-3 py-1.5 rounded-xl text-white text-[10px] font-bold uppercase tracking-wider ${statusColor} shadow-lg`}>
                          {event.type || 'Event'}
                        </span>
                      </div>
                      
                      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                          <CalendarDays size={14} />
                          <span className="text-[11px] font-bold">{tanggalStr}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                          <Maximize2 size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex-1 space-y-5">
                        <Link href={`/p/event/${event.slug || event.id}`}>
                          <h3 className="text-xl font-bold text-slate-800 leading-tight line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
                            {event.title}
                          </h3>
                        </Link>
                        
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <MapPin size={14} className="text-indigo-500" />
                            {event.location || 'Online'}
                          </div>
                          {event.mentor && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              <Users size={14} className="text-cyan-500" />
                              {event.mentor}
                            </div>
                          )}
                        </div>
                      </div>

                      <Link 
                        href={event.link_pendaftaran || `/p/event/${event.slug || event.id}`}
                        target={event.link_pendaftaran ? "_blank" : undefined}
                        rel={event.link_pendaftaran ? "noopener noreferrer" : undefined}
                        className="mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-indigo-600 active:scale-95 transition-all shadow-lg hover:shadow-indigo-200"
                      >
                        {event.link_pendaftaran ? 'Daftar Sekarang' : 'Daftar Event'}
                        {event.link_pendaftaran ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
                      </Link>
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
        detailHref={selectedImage ? `/p/event/${selectedImage.id}` : undefined}
      />
    </div>
  );
}
