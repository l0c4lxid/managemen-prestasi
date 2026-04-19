'use client';
import React from 'react';
import { 
  X, Swords, Calendar, Trophy, Globe, Tag, 
  ExternalLink, FileText, CheckCircle2, Info,
  MapPin, User, Clock
} from 'lucide-react';
import { Lomba } from '../page';

interface LombaDetailModalProps {
  lomba: Lomba | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LombaDetailModal({ lomba, isOpen, onClose }: LombaDetailModalProps) {
  if (!lomba || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 animate-scale-up flex flex-col lg:flex-row">
        {/* Left Side: Poster & Key Stats */}
        <div className="lg:w-1/3 bg-slate-50 border-r border-slate-100 flex flex-col">
          <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[400px] overflow-hidden">
            {lomba.poster_url ? (
              <img src={lomba.poster_url} alt={lomba.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-indigo-100 bg-indigo-50">
                <Swords size={80} strokeWidth={1} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
          </div>

          <div className="p-6 space-y-4 flex-1">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <Trophy size={16} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Hadiah</p>
                  <p className="text-sm font-bold text-slate-800">{lomba.prize || 'Sertifikat'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-rose-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deadline</p>
                  <p className="text-sm font-bold text-slate-800">
                    {lomba.deadline ? new Date(lomba.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <Globe size={16} className="text-cyan-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tingkat</p>
                  <p className="text-sm font-bold text-slate-800">{lomba.tingkat || 'Nasional'}</p>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider mb-4">
              <Tag size={12} />
              {lomba.kategori || 'Kompetisi'}
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight mb-2">{lomba.title}</h2>
            <p className="text-lg text-slate-500 font-medium">{lomba.organizer || 'Penyelenggara tidak disebutkan'}</p>
          </div>

          <div className="space-y-8">
            {/* Deskripsi */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <h3 className="text-lg font-bold text-slate-800">Deskripsi Lomba</h3>
              </div>
              <div className="text-slate-600 leading-relaxed space-y-4">
                {lomba.description ? (
                  <p className="whitespace-pre-wrap">{lomba.description}</p>
                ) : (
                  <p className="italic text-slate-400">Tidak ada deskripsi tersedia.</p>
                )}
              </div>
            </section>

            {/* Syarat & Ketentuan */}
            {lomba.syarat_ketentuan && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-bold text-slate-800">Syarat & Ketentuan</h3>
                </div>
                <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100">
                  <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                    {lomba.syarat_ketentuan}
                  </div>
                </div>
              </section>
            )}

            {/* Cara Pendaftaran */}
            {lomba.cara_pendaftaran && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  <h3 className="text-lg font-bold text-slate-800">Cara Pendaftaran</h3>
                </div>
                <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                    {lomba.cara_pendaftaran}
                  </div>
                </div>
              </section>
            )}

            {/* CTA */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              {lomba.link ? (
                <a 
                  href={lomba.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  <ExternalLink size={18} />
                  Daftar Lewat Website Resmi
                </a>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-100 text-slate-400 font-bold cursor-not-allowed">
                  <Info size={18} />
                  Link pendaftaran belum tersedia
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
