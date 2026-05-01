'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Trophy } from 'lucide-react';
import type { Prestasi, PrestasiStatus } from './PrestasiTable';

interface FormData {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: string;
  lomba: string;
  penyelenggara: string;
  kategori: string;
  juara: string;
  tingkat: string;
  tanggal: string;
  sertifikat: boolean;
  status: PrestasiStatus;
  catatan: string;
}

const prodiOptions = ['Teknik Informatika', 'Sistem Informasi', 'Teknik Elektro', 'Teknik Sipil', 'Manajemen', 'Akuntansi', 'Hukum', 'Psikologi', 'Ilmu Komunikasi', 'DKV', 'Farmasi', 'Kedokteran', 'Ekonomi Pembangunan'];
const kategoriOptions = ['Teknologi', 'Akademik', 'Kewirausahaan', 'Sains', 'Seni & Budaya', 'Olahraga'];
const tingkatOptions = ['Kampus', 'Regional', 'Nasional', 'Internasional'];
const juaraOptions = ['Juara 1', 'Juara 2', 'Juara 3', 'Juara Harapan 1', 'Juara Harapan 2', 'Finalis'];

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (item: Prestasi) => void;
  editItem: Prestasi | null;
}

export default function PrestasiFormModal({ open, onClose, onSave, editItem }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: editItem ? {
      nim: editItem.nim, nama: editItem.nama, prodi: editItem.prodi,
      angkatan: editItem.angkatan, lomba: editItem.lomba,
      penyelenggara: editItem.penyelenggara, kategori: editItem.kategori,
      juara: editItem.juara, tingkat: editItem.tingkat, tanggal: editItem.tanggal,
      sertifikat: editItem.sertifikat, status: editItem.status, catatan: editItem.catatan || '',
    } : { status: 'draft', sertifikat: false },
  });

  React.useEffect(() => {
    if (editItem) {
      reset({
        nim: editItem.nim, nama: editItem.nama, prodi: editItem.prodi,
        angkatan: editItem.angkatan, lomba: editItem.lomba,
        penyelenggara: editItem.penyelenggara, kategori: editItem.kategori,
        juara: editItem.juara, tingkat: editItem.tingkat, tanggal: editItem.tanggal,
        sertifikat: editItem.sertifikat, status: editItem.status, catatan: editItem.catatan || '',
      });
    } else {
      reset({ status: 'draft', sertifikat: false });
    }
  }, [editItem, reset]);

  const onSubmit = async (data: FormData) => {

    await new Promise((r) => setTimeout(r, 800));
    const item: Prestasi = {
      id: editItem?.id ?? `prs-${Date.now()}`,
      ...data,
    };
    onSave(item);
    reset();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-soft-lg w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Trophy size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {editItem ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}
            </h2>
            <p className="text-xs text-slate-500">Lengkapi semua data prestasi dengan benar</p>
          </div>
          <button onClick={onClose} className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 px-6 py-5 scrollbar-thin space-y-5">
            {/* Mahasiswa info */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Data Mahasiswa</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">NIM</label>
                  <input
                    type="text"
                    placeholder="2021XXXXXX"
                    className={`input-field font-mono ${errors.nim ? 'border-red-400' : ''}`}
                    {...register('nim', { required: 'NIM wajib diisi', pattern: { value: /^\d{8,12}$/, message: 'NIM 8-12 digit' } })}
                  />
                  {errors.nim && <p className="text-xs text-red-600 mt-1">{errors.nim.message}</p>}
                </div>
                <div>
                  <label className="label-text">Angkatan</label>
                  <select className="input-field" {...register('angkatan', { required: 'Wajib diisi' })}>
                    <option value="">Pilih</option>
                    {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                      <option key={`ang-${y}`} value={y}>{y}</option>
                    ))}
                  </select>
                  {errors.angkatan && <p className="text-xs text-red-600 mt-1">{errors.angkatan.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="label-text">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Sesuai KTM"
                    className={`input-field ${errors.nama ? 'border-red-400' : ''}`}
                    {...register('nama', { required: 'Nama wajib diisi' })}
                  />
                  {errors.nama && <p className="text-xs text-red-600 mt-1">{errors.nama.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="label-text">Program Studi</label>
                  <select className={`input-field ${errors.prodi ? 'border-red-400' : ''}`} {...register('prodi', { required: 'Wajib dipilih' })}>
                    <option value="">Pilih Program Studi</option>
                    {prodiOptions.map((p) => <option key={`prodi-f-${p}`} value={p}>{p}</option>)}
                  </select>
                  {errors.prodi && <p className="text-xs text-red-600 mt-1">{errors.prodi.message}</p>}
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Lomba info */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Data Lomba & Prestasi</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label-text">Nama Lomba / Kompetisi</label>
                  <input
                    type="text"
                    placeholder="Nama lengkap lomba"
                    className={`input-field ${errors.lomba ? 'border-red-400' : ''}`}
                    {...register('lomba', { required: 'Nama lomba wajib diisi' })}
                  />
                  {errors.lomba && <p className="text-xs text-red-600 mt-1">{errors.lomba.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="label-text">Penyelenggara</label>
                  <input
                    type="text"
                    placeholder="Institusi / lembaga penyelenggara"
                    className="input-field"
                    {...register('penyelenggara', { required: 'Wajib diisi' })}
                  />
                </div>
                <div>
                  <label className="label-text">Kategori</label>
                  <select className={`input-field ${errors.kategori ? 'border-red-400' : ''}`} {...register('kategori', { required: 'Wajib dipilih' })}>
                    <option value="">Pilih Kategori</option>
                    {kategoriOptions.map((k) => <option key={`kat-f-${k}`} value={k}>{k}</option>)}
                  </select>
                  {errors.kategori && <p className="text-xs text-red-600 mt-1">{errors.kategori.message}</p>}
                </div>
                <div>
                  <label className="label-text">Tingkat</label>
                  <select className={`input-field ${errors.tingkat ? 'border-red-400' : ''}`} {...register('tingkat', { required: 'Wajib dipilih' })}>
                    <option value="">Pilih Tingkat</option>
                    {tingkatOptions.map((t) => <option key={`tingkat-f-${t}`} value={t}>{t}</option>)}
                  </select>
                  {errors.tingkat && <p className="text-xs text-red-600 mt-1">{errors.tingkat.message}</p>}
                </div>
                <div>
                  <label className="label-text">Peringkat / Juara</label>
                  <select className={`input-field ${errors.juara ? 'border-red-400' : ''}`} {...register('juara', { required: 'Wajib dipilih' })}>
                    <option value="">Pilih Peringkat</option>
                    {juaraOptions.map((j) => <option key={`juara-f-${j}`} value={j}>{j}</option>)}
                  </select>
                  {errors.juara && <p className="text-xs text-red-600 mt-1">{errors.juara.message}</p>}
                </div>
                <div>
                  <label className="label-text">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    className={`input-field ${errors.tanggal ? 'border-red-400' : ''}`}
                    {...register('tanggal', { required: 'Tanggal wajib diisi' })}
                  />
                  {errors.tanggal && <p className="text-xs text-red-600 mt-1">{errors.tanggal.message}</p>}
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Status & notes */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Status & Catatan</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Status Verifikasi</label>
                  <select className="input-field" {...register('status')}>
                    <option value="draft">Draf</option>
                    <option value="pending">Menunggu Verifikasi</option>
                    <option value="verified">Terverifikasi</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
                      {...register('sertifikat')}
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-700">Sertifikat diunggah</span>
                      <p className="text-[11px] text-slate-500">Dokumen bukti prestasi tersedia</p>
                    </div>
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="label-text">Catatan Admin</label>
                  <p className="text-xs text-slate-500 mb-1.5">Opsional — alasan penolakan atau catatan verifikasi</p>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Sertifikat belum diunggah, harap lengkapi dokumen."
                    className="input-field resize-none"
                    {...register('catatan')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="btn-ghost border border-slate-200">
              Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary ml-auto">
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan…
                </>
              ) : (
                editItem ? 'Simpan Perubahan' : 'Tambah Prestasi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}