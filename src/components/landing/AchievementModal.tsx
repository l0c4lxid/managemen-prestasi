'use client';
import React from 'react';
import { X, Trophy, Medal, MapPin, Calendar, User, Bookmark, Share2, GraduationCap } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    id: string;
    name: string;
    nim: string;
    prodi: string;
    lomba: string;
    tahun: string;
    juara: number;
    kategori: string;
    img: string;
    description?: string;
    rank?: string;
    document_url?: string;
    year?: string;
  } | null;
}

export default function AchievementModal({ isOpen, onClose, achievement }: AchievementModalProps) {
  if (!isOpen || !achievement) return null;

  const juaraBadge = (juara: number) => {
    if (juara === 1) return { label: 'Juara 1', className: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Trophy size={16} className="text-amber-600" /> };
    if (juara === 2) return { label: 'Juara 2', className: 'bg-slate-100 text-slate-700 border-slate-200', icon: <Medal size={16} className="text-slate-500" /> };
    if (juara === 3) return { label: 'Juara 3', className: 'bg-orange-100 text-orange-700 border-orange-200', icon: <Medal size={16} className="text-orange-600" /> };
    return { label: 'Pemenang', className: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: <Trophy size={16} className="text-indigo-600" /> };
  };

  const badge = juaraBadge(achievement.juara);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative group bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-scale-in border border-white">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all active:scale-90 shadow-xl opacity-0 group-hover:opacity-100"
        >
          <X size={20} />
        </button>

        {/* Left Side - Image/Visual */}
        <div className="relative w-full md:w-5/12 h-64 md:h-auto bg-slate-100 overflow-hidden group">
          <AppImage
            src={achievement.img}
            alt={achievement.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${badge.className} border text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg`}>
              {badge.icon}
              {badge.label}
            </div>
            <h3 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
              {achievement.lomba}
            </h3>
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto scrollbar-thin">
          <div className="space-y-10">
            {/* Student Info */}
            <div className="flex items-center gap-5 pb-8 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner">
                <User size={30} />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 leading-tight mb-1">{achievement.name}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{achievement.nim}</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                    <GraduationCap size={14} />
                    {achievement.prodi}
                  </div>
                </div>
              </div>
            </div>

            {/* Content / Description */}
            <div className="space-y-6">
              <div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Detail Pencapaian</h5>
                <p className="text-slate-600 leading-relaxed font-medium text-base">
                  {achievement.description || "Mahasiswa Universitas BSI Kampus Solo berhasil meraih prestasi membanggakan dalam kompetisi ini. Pencapaian ini merupakan bukti dedikasi dan kerja keras dalam mengasah kompetensi di bidangnya."}
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                    <Calendar size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Tahun</span>
                  </div>
                  <p className="text-sm font-black text-slate-800">{achievement.year || achievement.tahun}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                    <Bookmark size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Kategori</span>
                  </div>
                  <p className="text-sm font-black text-slate-800">{achievement.kategori}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              {(achievement.document_url || achievement.proof_url) && (
                <a 
                  href={achievement.document_url || achievement.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white text-xs uppercase tracking-widest font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  <Bookmark size={16} />
                  {achievement.document_url ? 'Lihat Dokumen Bukti' : 'Lihat Sertifikat'}
                </a>
              )}
              <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-slate-100 text-slate-500 text-xs uppercase tracking-widest font-black hover:bg-slate-50 transition-all active:scale-95">
                <Share2 size={16} />
                Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
