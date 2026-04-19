'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Swords, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Lomba } from '../page';
import Image from 'next/image';

interface FormData {
  title: string;
  organizer: string;
  kategori: string;
  tingkat: string;
  deadline: string;
  tanggal_mulai: string;
  prize: string;
  status: string;
  description: string;
  link: string;
  syarat_ketentuan: string;
  cara_pendaftaran: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (item: Lomba) => void;
  editItem: Lomba | null;
}

const kategoriOptions = ['Teknologi', 'Akademik', 'Kewirausahaan', 'Sains', 'Seni & Budaya', 'Olahraga'];
const tingkatOptions = ['Kampus', 'Regional', 'Nasional', 'Internasional'];

export default function LombaFormModal({ open, onClose, onSave, editItem }: Props) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: editItem ? {
      title: editItem.title,
      organizer: editItem.organizer || '',
      kategori: editItem.kategori || '',
      tingkat: editItem.tingkat || '',
      deadline: editItem.deadline ? editItem.deadline.split('T')[0] : '',
      tanggal_mulai: editItem.tanggal_mulai || '',
      prize: editItem.prize || '',
      status: editItem.status,
      description: editItem.description || '',
      link: editItem.link || '',
      syarat_ketentuan: editItem.syarat_ketentuan || '',
      cara_pendaftaran: editItem.cara_pendaftaran || '',
    } : { status: 'active' },
  });

  useEffect(() => {
    if (editItem) {
      reset({
        title: editItem.title,
        organizer: editItem.organizer || '',
        kategori: editItem.kategori || '',
        tingkat: editItem.tingkat || '',
        deadline: editItem.deadline ? editItem.deadline.split('T')[0] : '',
        tanggal_mulai: editItem.tanggal_mulai || '',
        prize: editItem.prize || '',
        status: editItem.status,
        description: editItem.description || '',
        link: editItem.link || '',
        syarat_ketentuan: editItem.syarat_ketentuan || '',
        cara_pendaftaran: editItem.cara_pendaftaran || '',
      });
      // @ts-ignore: poster_url exists in DB but might not be typed in Lomba interface cleanly
      setPreview(editItem.poster_url || null);
    } else {
      reset({ status: 'active' });
      setPreview(null);
    }
  }, [editItem, reset]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Ukuran maksimal banner adalah 5MB'); return; }
    
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `lomba-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
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
      organizer: data.organizer,
      kategori: data.kategori,
      tingkat: data.tingkat,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      tanggal_mulai: data.tanggal_mulai,
      prize: data.prize,
      status: data.status,
      description: data.description,
      link: data.link,
      syarat_ketentuan: data.syarat_ketentuan,
      cara_pendaftaran: data.cara_pendaftaran,
      category: 'lomba',
      level: (data.tingkat || 'nasional').toLowerCase() as 'kampus' | 'nasional' | 'internasional',
      poster_url: preview,
    };

    if (editItem) {
      const { data: updated, error } = await supabase
        .from('competitions')
        .update(payload)
        .eq('id', editItem.id)
        .select()
        .single();
      if (error) { toast.error('Gagal memperbarui lomba'); return; }
      toast.success('Data lomba berhasil diperbarui');
      onSave(updated as Lomba);
    } else {
      const { data: created, error } = await supabase
        .from('competitions')
        .insert(payload)
        .select()
        .single();
      if (error) { toast.error('Gagal menambahkan lomba'); return; }
      toast.success('Lomba baru berhasil ditambahkan');
      onSave(created as Lomba);
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
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Swords size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{editItem ? 'Edit Lomba' : 'Tambah Lomba Baru'}</h2>
            <p className="text-xs text-slate-500">Isi semua informasi dan upload banner lomba</p>
          </div>
          <button onClick={onClose} className="ml-auto p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50/50">
          <form id="lomba-form" onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Banner Upload */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <ImageIcon size={16} className="text-indigo-500" />
                    Banner / Poster
                  </h3>
                  
                  <div className="relative group rounded-xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors aspect-[4/5] flex flex-col items-center justify-center text-center p-4">
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
                          <Loader2 size={32} className="text-indigo-400 animate-spin mb-3" />
                        ) : (
                          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                            <UploadCloud size={20} className="text-indigo-500" />
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
                    <label className="label-text">Status Pendaftaran</label>
                    <select className="input-field bg-slate-50" {...register('status')}>
                      <option value="active">Aktif Buka</option>
                      <option value="closed">Tutup Pendaftaran</option>
                      <option value="archived">Diarsipkan</option>
                      <option value="expired">Kedaluwarsa</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Deadline Pendaftaran</label>
                    <input type="date" className={`input-field bg-slate-50 ${errors.deadline ? 'border-red-400 focus:ring-red-200' : ''}`} {...register('deadline', { required: 'Deadline wajib diisi' })} />
                    {errors.deadline && <p className="text-xs text-red-600 mt-1">{errors.deadline.message}</p>}
                  </div>
                </div>
              </div>

              {/* Right Column: Text Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Info Lomba */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">Informasi Utama</h3>
                  
                  <div>
                    <label className="label-text">Nama Lomba / Kompetisi</label>
                    <input type="text" placeholder="Contoh: Gemastik 2026, PKM, dll" className={`input-field bg-slate-50 ${errors.title ? 'border-red-400' : ''}`} {...register('title', { required: 'Nama lomba wajib diisi' })} />
                    {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Penyelenggara</label>
                      <input type="text" placeholder="Institusi / lembaga" className="input-field bg-slate-50" {...register('organizer')} />
                    </div>
                    <div>
                      <label className="label-text">Link Pendaftaran Asli</label>
                      <input type="url" placeholder="https://..." className="input-field bg-slate-50" {...register('link')} />
                    </div>
                    <div>
                      <label className="label-text">Kategori</label>
                      <select className="input-field bg-slate-50" {...register('kategori')}>
                        <option value="">Pilih Kategori</option>
                        {kategoriOptions.map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label-text">Tingkat</label>
                      <select className="input-field bg-slate-50" {...register('tingkat')}>
                        <option value="">Pilih Tingkat</option>
                        {tingkatOptions.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label-text">Tanggal Pelaksanaan</label>
                      <input type="date" className="input-field bg-slate-50" {...register('tanggal_mulai')} />
                    </div>
                    <div>
                      <label className="label-text">Total Hadiah (Opsional)</label>
                      <input type="text" placeholder="Rp 50.000.000" className="input-field bg-slate-50" {...register('prize')} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="label-text">Deskripsi Singkat</label>
                    <textarea rows={3} placeholder="Jelaskan lomba secara singkat…" className="input-field bg-slate-50 resize-none" {...register('description')} />
                  </div>
                </div>

                {/* Detail Information */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">Persyaratan & Ketentuan</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Syarat & Ketentuan</label>
                      <textarea rows={5} placeholder="Tuliskan syarat dan ketentuan pendaftaran (satu per baris)…" className="input-field bg-slate-50 resize-none" {...register('syarat_ketentuan')} />
                    </div>
                    <div>
                      <label className="label-text">Cara Pendaftaran / Timeline</label>
                      <textarea rows={5} placeholder="Tuliskan langkah-langkah mendaftar atau timeline kegiatan…" className="input-field bg-slate-50 resize-none" {...register('cara_pendaftaran')} />
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
          <button type="submit" form="lomba-form" disabled={isSubmitting || uploading} className="btn-primary ml-auto flex items-center gap-2">
            {(isSubmitting || uploading) && <Loader2 size={16} className="animate-spin" />}
            {editItem ? 'Simpan Perubahan' : 'Publish Lomba'}
          </button>
        </div>

      </div>
    </div>
  );
}