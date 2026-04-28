'use client';
import React from 'react';
import AppImage from './AppImage';
import { X, ExternalLink, Download } from 'lucide-react';
import Link from 'next/link';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title?: string;
  detailHref?: string;
}

export default function Lightbox({ isOpen, onClose, src, alt, title, detailHref }: LightboxProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-slate-950/95 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      {/* Header Overlay */}
      <div className="w-full p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex-1 min-w-0 pr-12">
          {title && (
            <h3 className="text-white font-bold text-xl md:text-2xl drop-shadow-md truncate">
              {title}
            </h3>
          )}
        </div>
        <button 
          onClick={onClose}
          className="group p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10 hover:scale-110 active:scale-95"
          aria-label="Close"
        >
          <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Main Content Area */}
      <div 
        className="relative flex-grow w-full flex items-center justify-center p-4 md:p-8 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-w-6xl animate-zoom-in flex items-center justify-center">
          <AppImage 
            src={src} 
            alt={alt} 
            fill 
            style={{ objectFit: 'contain' }}
            className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
            sizes="95vw"
            priority
          />
        </div>
      </div>

      {/* Footer Overlay */}
      <div className="w-full p-8 flex flex-col sm:flex-row items-center justify-center gap-4 z-10 bg-gradient-to-t from-black/50 to-transparent">
        {detailHref && (
          <Link 
            href={detailHref}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
            onClick={onClose}
          >
            <ExternalLink size={20} />
            Lihat Detail Lengkap
          </Link>
        )}
        <a 
          href={src} 
          download 
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all active:scale-95 border border-white/20 backdrop-blur-sm"
        >
          <Download size={20} />
          Download
        </a>
      </div>
    </div>
  );
}
