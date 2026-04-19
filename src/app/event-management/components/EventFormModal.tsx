'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { EventItem } from '../page';

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

  React.useEffect(() => {
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
    } else {
      reset({ status: 'upcoming', quota: 50 });
    }
  }, [editItem, reset]);

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
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-soft-lg w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
            <CalendarDays size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">{editItem ? 'Edit Event' : 'Tambah Event Baru'}</h2>
            <p className="text-xs text-slate-500">Lengkapi informasi event dengan benar</p>
          </div>
          <button onClick={onClose} className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 px-6 py-5 scrollbar-thin space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Informasi Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="label-text">Nama Event</label>
                  <input type="text" placeholder="Nama lengkap event / kegiatan" className={`input-field ${errors.title ? 'border-red-400' : ''}`} {...register('title', { required: 'Nama event wajib diisi' })} />
                  {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Tipe Event</label>
                    <select className="input-field" {...register('type')}>
                      <option value="">Pilih Tipe</option>
                      {['Workshop', 'Seminar', 'Pelatihan', 'Coaching', 'Webinar'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Status</label>
                    <select className="input-field" {...register('status')}>
                      <option value="upcoming">Akan Datang</option>
                      <option value="ongoing">Berlangsung</option>
                      <option value="done">Selesai</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Tanggal Pelaksanaan</label>
                    <input type="date" className={`input-field ${errors.date ? 'border-red-400' : ''}`} {...register('date', { required: 'Tanggal wajib diisi' })} />
                    {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date.message}</p>}
                  </div>
                  <div>
                    <label className="label-text">Waktu</label>
                    <input type="text" placeholder="08:00 – 15:00 WIB" className="input-field" {...register('time')} />
                  </div>
                </div>
                <div>
                  <label className="label-text">Lokasi</label>
                  <input type="text" placeholder="Aula Rektorat Lt. 3 / Online via Zoom" className="input-field" {...register('location')} />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Narasumber / Mentor</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Nama Narasumber</label>
                  <input type="text" placeholder="Nama lengkap + gelar" className="input-field" {...register('mentor')} />
                </div>
                <div>
                  <label className="label-text">Jabatan / Peran</label>
                  <input type="text" placeholder="CEO / Dosen / Trainer" className="input-field" {...register('mentor_role')} />
                </div>
                <div className="col-span-2">
                  <label className="label-text">Institusi</label>
                  <input type="text" placeholder="Nama perusahaan / universitas" className="input-field" {...register('institusi_narasumber')} />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Kapasitas & Pendaftaran</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Kapasitas Peserta</label>
                  <input type="number" min={1} className="input-field" {...register('quota', { min: 1 })} />
                </div>
                <div>
                  <label className="label-text">Link Pendaftaran</label>
                  <input type="url" placeholder="https://..." className="input-field" {...register('link_pendaftaran')} />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <label className="label-text">Deskripsi Event</label>
              <textarea rows={3} placeholder="Deskripsikan event secara singkat dan menarik…" className="input-field resize-none" {...register('description')} />
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Syarat & Ketentuan</h3>
              <textarea rows={5} placeholder="Tuliskan syarat dan ketentuan (satu per baris)…" className="input-field resize-none" {...register('syarat_ketentuan')} />
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
              ) : (editItem ? 'Simpan Perubahan' : 'Tambah Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}