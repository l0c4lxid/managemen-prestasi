'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

interface RegisterFormData {
  nama: string;
  nim: string;
  email: string;
  prodi: string;
  angkatan: string;
  role: 'mahasiswa' | 'admin';
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const prodiOptions = [
  'Teknik Informatika', 'Sistem Informasi', 'Teknik Elektro', 'Teknik Sipil', 'Teknik Mesin',
  'Manajemen', 'Akuntansi', 'Ekonomi Pembangunan', 'Ilmu Hukum', 'Psikologi',
  'Ilmu Komunikasi', 'Desain Komunikasi Visual', 'Farmasi', 'Kedokteran', 'Keperawatan',
];

interface Props {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    defaultValues: { role: 'mahasiswa' },
  });
  const role = watch('role');
  const password = watch('password');

  const onSubmit = async (_data: RegisterFormData) => {

    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Akun berhasil dibuat! Silakan masuk.');
    setTimeout(() => router.push('/dashboard'), 800);
  };

  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Buat Akun Baru</h2>
        <p className="text-slate-500 text-sm mt-1">Daftar dan mulai catat prestasimu.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role selector */}
        <div>
          <label className="label-text">Daftar sebagai</label>
          <div className="grid grid-cols-2 gap-2">
            {(['mahasiswa', 'admin'] as const).map((r) => (
              <label
                key={`role-${r}`}
                className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all duration-150
                  ${role === r ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <input type="radio" value={r} {...register('role')} className="sr-only" />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${role === r ? 'border-indigo-600' : 'border-slate-300'}`}>
                  {role === r && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${role === r ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {r === 'mahasiswa' ? 'Mahasiswa' : 'Admin'}
                  </p>
                  <p className="text-[10px] text-slate-500">{r === 'mahasiswa' ? 'Peserta lomba' : 'Kemahasiswaan'}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Nama */}
        <div>
          <label className="label-text">Nama Lengkap</label>
          <input
            type="text"
            placeholder="Sesuai KTP / KTM"
            className={`input-field ${errors.nama ? 'border-red-400' : ''}`}
            {...register('nama', { required: 'Nama lengkap wajib diisi' })}
          />
          {errors.nama && <p className="text-xs text-red-600 mt-1">{errors.nama.message}</p>}
        </div>

        {/* NIM — only for mahasiswa */}
        {role === 'mahasiswa' && (
          <div>
            <label className="label-text">NIM</label>
            <p className="text-xs text-slate-500 mb-1.5">Nomor Induk Mahasiswa (10 digit)</p>
            <input
              type="text"
              placeholder="2021XXXXXX"
              className={`input-field font-mono ${errors.nim ? 'border-red-400' : ''}`}
              maxLength={12}
              {...register('nim', {
                required: role === 'mahasiswa' ? 'NIM wajib diisi' : false,
                pattern: { value: /^\d{8,12}$/, message: 'NIM harus 8-12 digit angka' },
              })}
            />
            {errors.nim && <p className="text-xs text-red-600 mt-1">{errors.nim.message}</p>}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="label-text">Email</label>
          <input
            type="email"
            placeholder="nama@student.uns.ac.id"
            className={`input-field ${errors.email ? 'border-red-400' : ''}`}
            {...register('email', {
              required: 'Email wajib diisi',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' },
            })}
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        {/* Prodi + Angkatan */}
        {role === 'mahasiswa' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-text">Program Studi</label>
              <select
                className={`input-field ${errors.prodi ? 'border-red-400' : ''}`}
                {...register('prodi', { required: 'Program studi wajib dipilih' })}
              >
                <option value="">Pilih Prodi</option>
                {prodiOptions.map((p) => (
                  <option key={`prodi-${p}`} value={p}>{p}</option>
                ))}
              </select>
              {errors.prodi && <p className="text-xs text-red-600 mt-1">{errors.prodi.message}</p>}
            </div>
            <div>
              <label className="label-text">Angkatan</label>
              <select
                className={`input-field ${errors.angkatan ? 'border-red-400' : ''}`}
                {...register('angkatan', { required: 'Angkatan wajib dipilih' })}
              >
                <option value="">Tahun</option>
                {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                  <option key={`angkatan-${y}`} value={y}>{y}</option>
                ))}
              </select>
              {errors.angkatan && <p className="text-xs text-red-600 mt-1">{errors.angkatan.message}</p>}
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <label className="label-text">Kata Sandi</label>
          <p className="text-xs text-slate-500 mb-1.5">Minimal 8 karakter, kombinasi huruf dan angka</p>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Buat kata sandi kuat"
              className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
              {...register('password', {
                required: 'Kata sandi wajib diisi',
                minLength: { value: 8, message: 'Minimal 8 karakter' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <label className="label-text">Konfirmasi Kata Sandi</label>
          <input
            type="password"
            placeholder="Ulangi kata sandi"
            className={`input-field ${errors.confirmPassword ? 'border-red-400' : ''}`}
            {...register('confirmPassword', {
              required: 'Konfirmasi kata sandi wajib diisi',
              validate: (v) => v === password || 'Kata sandi tidak cocok',
            })}
          />
          {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 mt-0.5 cursor-pointer flex-shrink-0"
            {...register('agreeTerms', { required: 'Kamu harus menyetujui syarat dan ketentuan' })}
          />
          <span className="text-sm text-slate-600 leading-snug">
            Saya menyetujui{' '}
            <span className="text-indigo-600 font-semibold hover:text-indigo-700 cursor-pointer">Syarat & Ketentuan</span>
            {' '}dan{' '}
            <span className="text-indigo-600 font-semibold hover:text-indigo-700 cursor-pointer">Kebijakan Privasi</span>
            {' '}SiBerkas
          </span>
        </label>
        {errors.agreeTerms && <p className="text-xs text-red-600 -mt-2">{errors.agreeTerms.message}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center py-3 text-base mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Membuat akun…
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Buat Akun
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        Sudah punya akun?{' '}
        <button onClick={onSwitchToLogin} className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
          Masuk di sini
        </button>
      </p>
    </div>
  );
}