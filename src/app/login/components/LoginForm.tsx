'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Eye, EyeOff, Copy, LogIn } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

const demoCredentials = [
  { role: 'Admin Kemahasiswaan', email: 'admin@siberkas.id', password: 'Admin@2026!' },
  { role: 'Mahasiswa', email: 'mahasiswa@siberkas.id', password: 'Mhs@2026!' },
];

interface Props {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    defaultValues: { remember: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    const valid = demoCredentials.some((c) => c.email === data.email && c.password === data.password);
    await new Promise((r) => setTimeout(r, 1000));
    if (!valid) {
      toast.error('Kredensial tidak valid — gunakan akun demo di bawah untuk masuk');
      return;
    }
    toast.success('Berhasil masuk! Mengarahkan ke dashboard…');
    setTimeout(() => router.push('/dashboard'), 800);
  };

  const autofill = (cred: typeof demoCredentials[0]) => {
    setValue('email', cred.email);
    setValue('password', cred.password);
    toast.info(`Kredensial ${cred.role} diisi otomatis`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} disalin ke clipboard`);
  };

  return (
    <div className="animate-slide-up">
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-slate-800">Selamat Datang Kembali</h2>
        <p className="text-slate-500 text-sm mt-1">Masuk untuk melanjutkan ke akun kamu.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="label-text">Email Kampus</label>
          <input
            type="email"
            placeholder="nama@siberkas.id"
            className={`input-field ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30' : ''}`}
            {...register('email', {
              required: 'Email wajib diisi',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' },
            })}
          />
          {errors.email && <p className="text-xs text-red-600 mt-1.5">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label-text mb-0">Kata Sandi</label>
            <button type="button" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              Lupa sandi?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan kata sandi"
              className={`input-field pr-10 ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30' : ''}`}
              {...register('password', {
                required: 'Kata sandi wajib diisi',
                minLength: { value: 6, message: 'Minimal 6 karakter' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600 mt-1.5">{errors.password.message}</p>}
        </div>

        {/* Remember */}
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
            {...register('remember')}
          />
          <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Ingat saya selama 30 hari</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center py-3 text-base mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Memverifikasi…
            </>
          ) : (
            <>
              <LogIn size={18} />
              Masuk ke Akun
            </>
          )}
        </button>
      </form>

      {/* Switch to register */}
      <p className="text-center text-sm text-slate-500 mt-5">
        Belum punya akun?{' '}
        <button onClick={onSwitchToRegister} className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
          Daftar sekarang
        </button>
      </p>

      {/* Demo credentials */}
      <div className="mt-7 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
        <p className="text-xs font-bold text-indigo-800 mb-3 uppercase tracking-wide">Akun Demo</p>
        <div className="space-y-2.5">
          {demoCredentials.map((cred) => (
            <div key={`cred-${cred.role}`} className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-indigo-100">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-indigo-700 mb-0.5">{cred.role}</p>
                <p className="text-xs text-slate-600 font-mono truncate">{cred.email}</p>
              </div>
              <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                <button
                  onClick={() => copyToClipboard(cred.email, 'Email')}
                  className="p-1.5 rounded-lg hover:bg-indigo-100 text-slate-500 hover:text-indigo-700 transition-colors"
                  title="Salin email"
                >
                  <Copy size={13} />
                </button>
                <button
                  onClick={() => autofill(cred)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-700 active:scale-95 transition-all duration-150"
                >
                  Gunakan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}