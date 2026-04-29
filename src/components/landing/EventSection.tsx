'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, MapPin, Users, ArrowRight, Mic2, Maximize2, Zap } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import Lightbox from '@/components/ui/Lightbox';

export default function EventSection({ initialData = [] }: { initialData?: any[] }) {
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string, title: string, id: string} | null>(null);
  
  // Map database fields if necessary
  const processedData = initialData.map(e => ({
    id: e.id,
    nama: e.title || e.nama,
    img: e.poster_url || e.img,
    tanggal: e.date ? new Date(e.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : e.tanggal,
    lokasi: e.location || e.lokasi,
    mentor: e.mentor,
    peserta: e.registered_count || e.peserta || 0,
    kapasitas: e.quota || e.kapasitas || 100,
    tipe: e.type || e.tipe || 'Event',
    color: e.status === 'done' ? 'bg-slate-500' : 'bg-indigo-600'
  }));

  // Use real data or premium fallback data
  const events = processedData.length > 0 ? processedData : [
    {
      id: 'e1',
      nama: 'National Tech Seminar 2026',
      img: 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?q=80&w=800&auto=format&fit=crop',
      tanggal: '24 Mei 2026',
      lokasi: 'Auditorium Pusat',
      mentor: 'Dr. Ahmad Fauzi',
      peserta: 142,
      kapasitas: 200,
      tipe: 'Seminar',
      color: 'bg-indigo-600'
    },
    {
      id: 'e2',
      nama: 'UI/UX Design Bootcamp',
      img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
      tanggal: '12 Juni 2026',
      lokasi: 'Lab Kreatif',
      mentor: 'Sarah Johnson',
      peserta: 45,
      kapasitas: 50,
      tipe: 'Workshop',
      color: 'bg-cyan-600'
    },
    {
      id: 'e3',
      nama: 'Cyber Security Essentials',
      img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
      tanggal: '18 Juli 2026',
      lokasi: 'Virtual Class',
      mentor: 'Alex Rivera',
      peserta: 89,
      kapasitas: 100,
      tipe: 'Bootcamp',
      color: 'bg-emerald-600'
    }
  ];

  return (
    <section id="event" className="py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest mb-4 border border-indigo-100">
              <Zap size={12} className="fill-indigo-600" />
              Agenda Terdekat
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Tingkatkan <span className="text-indigo-600">Skill</span> & Networking
            </h2>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              Ikuti berbagai event eksklusif mulai dari seminar teknologi hingga bootcamp intensif bersama para ahli.
            </p>
          </div>
          <Link href="/event" className="group flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Lihat Semua Event 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const fillPct = Math.min(100, Math.round((event.peserta / (event.kapasitas || 100)) * 100));
            const isAlmostFull = fillPct >= 80;

            return (
              <div
                key={event.id}
                className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Banner image */}
                <div 
                  className="relative h-56 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage({ src: event.img, alt: event.nama, title: event.nama, id: event.id })}
                >
                  <AppImage
                    src={event.img}
                    alt={event.nama}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Status Badges */}
                  <div className="absolute top-5 left-5">
                    <span className={`px-3 py-1.5 rounded-xl text-white text-[10px] font-bold uppercase tracking-wider ${event.color || 'bg-indigo-600 shadow-lg'}`}>
                      {event.tipe}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                      <CalendarDays size={14} />
                      <span className="text-[11px] font-bold">{event.tanggal}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                      <Maximize2 size={18} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex-1 space-y-5">
                    <Link href={`/p/event/${event.id}`}>
                      <h3 className="text-xl font-bold text-slate-800 leading-tight line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
                        {event.nama}
                      </h3>
                    </Link>
                    
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <MapPin size={14} className="text-indigo-500" />
                        {event.lokasi}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <Users size={14} className="text-cyan-500" />
                        {event.mentor}
                      </div>
                    </div>

                    {/* Capacity bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Kapasitas Peserta</span>
                        <span className={`text-xs font-bold ${isAlmostFull ? 'text-red-600' : 'text-slate-700'}`}>
                          {event.peserta}/{event.kapasitas}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isAlmostFull ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-indigo-500'}`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      {isAlmostFull && <p className="text-[10px] text-red-500 font-bold mt-1.5 text-right flex items-center justify-end gap-1"><Mic2 size={10} /> Hampir Penuh!</p>}
                    </div>
                  </div>

                  <Link 
                    href={`/p/event/${event.id}`}
                    className="mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-indigo-600 active:scale-95 transition-all shadow-lg hover:shadow-indigo-200"
                  >
                    Daftar Sekarang
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Lightbox 
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        src={selectedImage?.src || ''}
        alt={selectedImage?.alt || ''}
        title={selectedImage?.title}
        detailHref={selectedImage ? `/p/event/${selectedImage.id}` : undefined}
      />
    </section>
  );
}