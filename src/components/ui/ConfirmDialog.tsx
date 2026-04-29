'use client';
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Hapus',
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-scale-in border border-white overflow-hidden">
        <div className="p-7">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0 shadow-inner">
              <AlertTriangle size={26} className="text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-wider">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{description}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-5 bg-slate-50/50 rounded-b-2xl border-t border-slate-100">
          <button onClick={onClose} className="flex-1 justify-center px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 justify-center px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-red-600/20"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                MEMPROSES…
              </span>
            ) : confirmLabel.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}