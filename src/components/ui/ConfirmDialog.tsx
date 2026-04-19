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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-soft-lg w-full max-w-md animate-scale-in">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={22} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-b-2xl border-t border-slate-100">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center border border-slate-200">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn-danger flex-1 justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menghapus…
              </span>
            ) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}