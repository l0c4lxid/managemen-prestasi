'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Swords } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Lomba } from '../page';

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

  React.useEffect(() => {
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
    } else {
      reset({ status: 'active' });
    }
  }, [editItem, reset]);

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
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-soft-lg w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Swords size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">{editItem ? 'Edit Lomba' : 'Tambah Lomba Baru'}</h2>
            <p className="text-xs text-slate-500">Isi semua informasi lomba dengan lengkap</p>
          </div>
          <button onClick={onClose} className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 px-6 py-5 scrollbar-thin space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Informasi Lomba</h3>
              <div className="space-y-4">
                <div>
                  <label className="label-text">Nama Lomba / Kompetisi</label>
                  <input type="text" placeholder="Nama lengkap lomba" className={`input-field ${errors.title ? 'border-red-400' : ''}`} {...register('title', { required: 'Nama lomba wajib diisi' })} />
                  {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="label-text">Penyelenggara</label>
                  <input type="text" placeholder="Institusi / lembaga penyelenggara" className="input-field" {...register('organizer')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Kategori</label>
                    <select className="input-field" {...register('kategori')}>
                      <option value="">Pilih Kategori</option>
                      {kategoriOptions.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Tingkat</label>
                    <select className="input-field" {...register('tingkat')}>
                      <option value="">Pilih Tingkat</option>
                      {tingkatOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Tanggal Mulai</label>
                    <input type="date" className="input-field" {...register('tanggal_mulai')} />
                  </div>
                  <div>
                    <label className="label-text">Deadline Pendaftaran</label>
                    <input type="date" className={`input-field ${errors.deadline ? 'border-red-400' : ''}`} {...register('deadline', { required: 'Deadline wajib diisi' })} />
                    {errors.deadline && <p className="text-xs text-red-600 mt-1">{errors.deadline.message}</p>}
                  </div>
                  <div>
                    <label className="label-text">Hadiah</label>
                    <input type="text" placeholder="Rp 50.000.000 / USD 10,000" className="input-field" {...register('prize')} />
                  </div>
                  <div>
                    <label className="label-text">Status</label>
                    <select className="input-field" {...register('status')}>
                      <option value="active">Aktif</option>
                      <option value="closed">Tutup Pendaftaran</option>
                      <option value="archived">Diarsipkan</option>
                      <option value="expired">Kedaluwarsa</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label-text">Link Pendaftaran</label>
                  <input type="url" placeholder="https://..." className="input-field" {...register('link')} />
                </div>
                <div>
                  <label className="label-text">Deskripsi</label>
                  <textarea rows={3} placeholder="Jelaskan lomba secara singkat…" className="input-field resize-none" {...register('description')} />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Syarat & Ketentuan</h3>
              <textarea rows={5} placeholder="Tuliskan syarat dan ketentuan pendaftaran (satu per baris)…" className="input-field resize-none" {...register('syarat_ketentuan')} />
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Cara Pendaftaran</h3>
              <textarea rows={5} placeholder="Tuliskan langkah-langkah cara mendaftar (satu per baris)…" className="input-field resize-none" {...register('cara_pendaftaran')} />
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="btn-ghost border border-slate-200">Batal</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary ml-auto">
              {isSubmitting ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan…</>
              ) : (editItem ? 'Simpan Perubahan' : 'Tambah Lomba')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}