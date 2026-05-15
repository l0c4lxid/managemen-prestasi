
'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, X } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm, loading }: LogoutConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
              <LogOut size={24} />
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 mb-2">Konfirmasi Keluar</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Apakah Anda yakin ingin keluar dari akun Anda? Sesi Anda akan berakhir dan Anda harus masuk kembali untuk mengakses dashboard.
          </p>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-white transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Ya, Keluar'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
