'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, CalendarDays, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { EventItem } from '../page';
import Image from 'next/image';

interface FormData {
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  mentor: string;
  institusi_narasumber: string;
  mentor_role: string;
  quota: number;
  status: string;
  description: string;
  link_pendaftaran: string;
  syarat_ketentuan: string;
  cara_pendaftaran: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (item: EventItem) => void;
  editItem: EventItem | null;
}

export default function EventFormModal({ open, onClose, onSave, editItem }: Props) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: editItem ? {
      title: editItem.title,
      type: editItem.type || '',
      date: editItem.date ? editItem.date.split('T')[0] : '',
      time: editItem.time || '',
      location: editItem.location || '',
      mentor: editItem.mentor || '',
      institusi_narasumber: editItem.institusi_narasumber || '',
      mentor_role: editItem.mentor_role || '',
      quota: editItem.quota,
      status: editItem.status || 'upcoming',
      description: editItem.description || '',
      link_pendaftaran: editItem.link_pendaftaran || '',
      syarat_ketentuan: editItem.syarat_ketentuan || '',
      cara_pendaftaran: editItem.cara_pendaftaran || '',
    } : { status: 'upcoming', quota: 50 },
  });

  useEffect(() => {
    if (editItem) {
      reset({
        title: editItem.title,
        type: editItem.type || '',
        date: editItem.date ? editItem.date.split('T')[0] : '',
        time: editItem.time || '',
        location: editItem.location || '',
        mentor: editItem.mentor || '',
        institusi_narasumber: editItem.institusi_narasumber || '',
        mentor_role: editItem.mentor_role || '',
        quota: editItem.quota,
        status: editItem.status || 'upcoming',
        description: editItem.description || '',
        link_pendaftaran: editItem.link_pendaftaran || '',
        syarat_ketentuan: editItem.syarat_ketentuan || '',
        cara_pendaftaran: editItem.cara_pendaftaran || '',
      });
      // @ts-ignore: poster_url exists in DB
      setPreview(editItem.poster_url || null);
    } else {
      reset({ status: 'upcoming', quota: 50 });
      setPreview(null);
    }
  }, [editItem, reset]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Ukuran maksimal banner adalah 5MB'); return; }
    
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `event-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    const { error } = await supabase.storage.from('posters').upload(fileName, file);
    if (error) {
      toast.error('Gagal mengupload banner: ' + error.message);
    } else {
      const { data: urlData } = supabase.storage.from('posters').getPublicUrl(fileName);
      setPreview(urlData.publicUrl);
    }
    setUploading(false);
  };

  const onSubmit = async (data: FormData) => {
    const payload = {
      title: data.title,
      type: data.type,
      date: data.date ? new Date(data.date).toISOString() : null,
      time: data.time,
      location: data.location,
      mentor: data.mentor,
      institusi_narasumber: data.institusi_narasumber,
      mentor_role: data.mentor_role,
      quota: Number(data.quota),
      status: data.status,
      description: data.description,
      link_pendaftaran: data.link_pendaftaran,
      syarat_ketentuan: data.syarat_ketentuan,
      cara_pendaftaran: data.cara_pendaftaran,
      poster_url: preview,
    };

    if (editItem) {
      const { data: updated, error } = await supabase
        .from('events')
        .update(payload)
        .eq('id', editItem.id)
        .select()
        .single();
      if (error) { toast.error('Gagal memperbarui event'); return; }
      toast.success('Data event berhasil diperbarui');
      onSave(updated as EventItem);
    } else {
      const { data: created, error } = await supabase
        .from('events')
        .insert(payload)
        .select()
        .single();
      if (error) { toast.error('Gagal menambahkan event'); return; }
      toast.success('Event baru berhasil ditambahkan');
      onSave(created as EventItem);
    }
    reset();
    setPreview(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-white z-10 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
            <CalendarDays size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{editItem ? 'Edit Event' : 'Tambah Event Baru'}</h2>
            <p className="text-xs text-slate-500">Lengkapi informasi dan banner event</p>
          </div>
          <button onClick={onClose} className="ml-auto p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50/50">
          <form id="event-form" onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Banner Upload */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <ImageIcon size={16} className="text-cyan-500" />
                    Banner / Poster
                  </h3>
                  
                  <div className="relative group rounded-xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 transition-colors aspect-[4/5] flex flex-col items-center justify-center text-center p-4">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      disabled={uploading}
                    />
                    
                    {preview ? (
                      <>
                        <Image src={preview} alt="Banner Preview" fill className="object-cover z-0" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <UploadCloud size={14} /> Ganti Banner
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="z-10 flex flex-col items-center">
                        {uploading ? (
                          <Loader2 size={32} className="text-cyan-400 animate-spin mb-3" />
                        ) : (
                          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                            <UploadCloud size={20} className="text-cyan-500" />
                          </div>
                        )}
                        <p className="text-sm font-bold text-slate-700">Upload Gambar</p>
                        <p className="text-[10px] text-slate-500 mt-1 max-w-[140px]">Format JPG, PNG, WEBP. Maks 5MB.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <label className="label-text">Status Event</label>
                    <select className="input-field bg-slate-50" {...register('status')}>
                      <option value="upcoming">Akan Datang (Pendaftaran Buka)</option>
                      <option value="ongoing">Sedang Berlangsung</option>
                      <option value="done">Selesai / Ditutup</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Kapasitas Maksimal</label>
                    <input type="number" min={1} className="input-field bg-slate-50" {...register('quota', { min: 1 })} />
                  </div>
                </div>
              </div>

              {/* Right Column: Text Information */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Info Utama */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">Informasi Event</h3>
                  
                  <div>
                    <label className="label-text">Nama Event / Kegiatan</label>
                    <input type="text" placeholder="Contoh: Sosialisasi PKM 2026, dll" className={`input-field bg-slate-50 ${errors.title ? 'border-red-400' : ''}`} {...register('title', { required: 'Nama event wajib diisi' })} />
                    {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Tipe Event</label>
                      <select className="input-field bg-slate-50" {...register('type')}>
                        <option value="">Pilih Tipe</option>
                        {['Workshop', 'Seminar', 'Pelatihan', 'Coaching', 'Webinar', 'Lainnya'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label-text">Lokasi</label>
                      <input type="text" placeholder="Aula Utama / Zoom" className="input-field bg-slate-50" {...register('location')} />
                    </div>
                    <div>
                      <label className="label-text">Tanggal Pelaksanaan</label>
                      <input type="date" className={`input-field bg-slate-50 ${errors.date ? 'border-red-400' : ''}`} {...register('date', { required: 'Tanggal wajib diisi' })} />
                      {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date.message}</p>}
                    </div>
                    <div>
                      <label className="label-text">Waktu</label>
                      <input type="text" placeholder="08:00 – Selesai WIB" className="input-field bg-slate-50" {...register('time')} />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="label-text">Link Pendaftaran Eksternal (Jika ada)</label>
                      <input type="url" placeholder="https://..." className="input-field bg-slate-50" {...register('link_pendaftaran')} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="label-text">Deskripsi Singkat</label>
                    <textarea rows={3} placeholder="Deskripsikan event secara ringkas…" className="input-field bg-slate-50 resize-none" {...register('description')} />
                  </div>
                </div>

                {/* Info Narasumber */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">Narasumber / Mentor</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Nama Lengkap & Gelar</label>
                      <input type="text" placeholder="Nama narasumber" className="input-field bg-slate-50" {...register('mentor')} />
                    </div>
                    <div>
                      <label className="label-text">Jabatan / Peran</label>
                      <input type="text" placeholder="Dosen / Praktisi" className="input-field bg-slate-50" {...register('mentor_role')} />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="label-text">Asal Institusi</label>
                      <input type="text" placeholder="Instansi tempat narasumber bekerja" className="input-field bg-slate-50" {...register('institusi_narasumber')} />
                    </div>
                  </div>
                </div>

                {/* Detail Information */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">Ketentuan & Panduan</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Syarat Kepesertaan</label>
                      <textarea rows={4} placeholder="Tuliskan syarat peserta (satu per baris)…" className="input-field bg-slate-50 resize-none" {...register('syarat_ketentuan')} />
                    </div>
                    <div>
                      <label className="label-text">Cara & Alur Pendaftaran</label>
                      <textarea rows={4} placeholder="Tuliskan langkah-langkah mendaftar event…" className="input-field bg-slate-50 resize-none" {...register('cara_pendaftaran')} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 z-10 shrink-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            Batal
          </button>
          <button type="submit" form="event-form" disabled={isSubmitting || uploading} className="btn-primary ml-auto flex items-center gap-2">
            {(isSubmitting || uploading) && <Loader2 size={16} className="animate-spin" />}
            {editItem ? 'Simpan Perubahan' : 'Publish Event'}
          </button>
        </div>

      </div>
    </div>
  );
}