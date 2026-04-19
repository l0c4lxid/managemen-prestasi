'use client';
import React from 'react';
import { 
  X, Calendar, Clock, MapPin, Users, Mic2, 
  ExternalLink, Info, CheckCircle2, Globe, Tag
} from 'lucide-react';
import { EventItem } from '../page';

interface EventDetailModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister?: (id: string) => void;
  isRegistered?: boolean;
}

export default function EventDetailModal({ 
  event, isOpen, onClose, onRegister, isRegistered 
}: EventDetailModalProps) {
  if (!event || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 animate-scale-up flex flex-col lg:flex-row">
        {/* Left Side: Poster & Info */}
        <div className="lg:w-1/3 bg-slate-50 border-r border-slate-100 flex flex-col">
          <div className="relative aspect-video lg:aspect-auto lg:h-[400px] overflow-hidden">
            {event.poster_url ? (
              <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-cyan-100 bg-cyan-50">
                <Calendar size={80} strokeWidth={1} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
          </div>

          <div className="p-6 space-y-4 flex-1">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-cyan-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tanggal</p>
                  <p className="text-sm font-bold text-slate-800">
                    {event.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Waktu</p>
                  <p className="text-sm font-bold text-slate-800">{event.time || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-rose-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lokasi</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{event.location || 'Online'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 lg:p-10">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-bold uppercase tracking-wider mb-4">
              <Tag size={12} />
              {event.type || 'Event'}
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight mb-2">{event.title}</h2>
          </div>

          <div className="space-y-8">
            {/* Deskripsi */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-6 bg-cyan-600 rounded-full" />
                <h3 className="text-lg font-bold text-slate-800">Tentang Kegiatan</h3>
              </div>
              <div className="text-slate-600 leading-relaxed space-y-4">
                {event.description ? (
                  <p className="whitespace-pre-wrap">{event.description}</p>
                ) : (
                  <p className="italic text-slate-400">Tidak ada deskripsi tersedia.</p>
                )}
              </div>
            </section>

            {/* Narasumber */}
            {event.mentor && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                  <h3 className="text-lg font-bold text-slate-800">Narasumber / Mentor</h3>
                </div>
                <div className="flex items-center gap-4 bg-purple-50/50 rounded-2xl p-4 border border-purple-100">
                  <div className="w-12 h-12 rounded-full bg-white border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                    <Mic2 size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{event.mentor}</p>
                    <p className="text-xs text-slate-500">{event.mentor_role || 'Expert Speaker'}</p>
                    {event.institusi_narasumber && (
                      <p className="text-[10px] font-semibold text-purple-600 mt-1">{event.institusi_narasumber}</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Kuota */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                <h3 className="text-lg font-bold text-slate-800">Kuota & Partisipasi</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">Maksimal Peserta</span>
                  </div>
                  <span className="text-lg font-extrabold text-slate-900">{event.quota}</span>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              {onRegister && (
                <button
                  onClick={() => onRegister(event.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg 
                    ${isRegistered 
                      ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700' 
                      : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'}`}
                >
                  {isRegistered ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                  {isRegistered ? 'Terdaftar (Batal?)' : 'Daftar Sekarang'}
                </button>
              )}
              
              {event.link_pendaftaran && (
                <a 
                  href={event.link_pendaftaran} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all"
                >
                  <ExternalLink size={18} />
                  Link Eksternal
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
