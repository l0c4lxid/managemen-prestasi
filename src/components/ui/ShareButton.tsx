'use client';
import React from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  id: string;
  title: string;
}

export default function ShareButton({ id, title }: ShareButtonProps) {
  const handleShare = () => {
    const url = `${window.location.origin}/p/prestasi/${id}`;
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link berhasil disalin ke clipboard!');
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
      title="Bagikan"
    >
      <Share2 size={16} />
    </button>
  );
}
