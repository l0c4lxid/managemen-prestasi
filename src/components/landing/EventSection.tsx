'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, MapPin, Users, ArrowRight, Mic2, Maximize2 } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import Lightbox from '@/components/ui/Lightbox';

export default function EventSection({ initialData = [] }: { initialData?: any[] }) {
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string, title: string, id: string} | null>(null);
  const events = initialData;

  return (
    <section id="event" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-bold uppercase tracking-widest mb-4">
              <CalendarDays size={12} />
              Event & Workshop
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Workshop & <span className="text-cyan-600">Seminar</span> Edukatif
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Tingkatkan wawasan dan keahlianmu melalui berbagai event menarik yang menghadirkan pembicara ahli di bidangnya.
            </p>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((rawEvent) => {
              // Map DB fields to component format
              const event = {
                id: rawEvent.id,
                nama: rawEvent.title,
                img: rawEvent.poster_url || '/placeholder-event.png',
                tanggal: new Date(rawEvent.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                lokasi: rawEvent.location || 'Kampus Solo',
                mentor: rawEvent.mentor || 'Staf UBSI',
                kapasitas: rawEvent.quota || 100,
                peserta: rawEvent.registered_count || 0, // Assuming we might have this later
                tipe: rawEvent.type || 'Event',
                status: rawEvent.status,
                color: rawEvent.status === 'done' ? 'bg-slate-500' : 'bg-indigo-600'
              };

              const fillPct = Math.min(100, Math.round((event.peserta / (event.kapasitas || 100)) * 100));
              const isAlmostFull = fillPct >= 80 && event.status !== 'done';
              const isDone = event.status === 'done' || event.status === 'finished';

              return (
                <div
                  key={event.id}
                  className={`group flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 ${isDone ? 'opacity-90 grayscale-[0.3]' : ''}`}
                >
                  {/* Banner image */}
                  <div 
                    className="relative h-44 overflow-hidden cursor-pointer bg-slate-50"
                    onClick={() => setSelectedImage({ src: event.img, alt: event.nama, title: event.nama, id: event.id })}
                  >
                    <AppImage
                      src={event.img}
                      alt={`Banner event ${event.nama}`}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 288px, 25vw"
                    />
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider ${event.color}`}>
                        {event.tipe}
                      </span>
                      {isDone && (
                        <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                          Selesai
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white bg-black/20 backdrop-blur-md px-2 py-1 rounded-md">
                      <CalendarDays size={12} />
                      <span className="text-[10px] font-bold">{event.tanggal}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex-1 space-y-4">
                      <Link href={`/p/event/${event.id}`}>
                        <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
                          {event.nama}
                        </h3>
                      </Link>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-[11px] text-slate-500">
                          <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                          <span className="truncate">{event.lokasi}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <Users size={13} className="text-slate-400 flex-shrink-0" />
                          <span className="truncate">{event.mentor}</span>
                        </div>
                      </div>

                      {/* Capacity bar - Only show if not done */}
                      {!isDone && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Kapasitas</span>
                            <span className={`text-[11px] font-bold ${isAlmostFull ? 'text-red-600' : 'text-slate-700'}`}>
                              {event.peserta}/{event.kapasitas}
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${isAlmostFull ? 'bg-red-500' : 'bg-indigo-500'}`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                          {isAlmostFull && <p className="text-[10px] text-red-500 font-bold mt-1 text-right">Hampir Penuh!</p>}
                        </div>
                      )}
                      
                      {isDone && (
                        <div className="pt-2">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Status</p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 italic">Event ini telah berakhir.</p>
                        </div>
                      )}
                    </div>

                    <Link 
                      href={`/p/event/${event.id}`}
                      className={`mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                        isDone 
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-50' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                      }`}
                    >
                      {isDone ? 'Lihat Dokumentasi' : 'Lihat Detail'}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <CalendarDays size={40} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-slate-500 font-bold">Belum Ada Event Terdekat</h3>
            <p className="text-slate-400 text-sm mt-1">Nantikan workshop dan seminar menarik lainnya.</p>
          </div>
        )}
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