'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, Trophy, Shield, Zap, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AppLogo from '@/components/ui/AppLogo';
import { createClient } from '@/lib/supabase/client';
import type { AppUser } from '@/types';

const features = [
  { icon: Trophy, label: 'Kelola Prestasi', desc: 'Submisi & verifikasi prestasi mahasiswa secara digital' },
  { icon: Shield, label: 'Multi-Role', desc: 'Akses berbasis peran untuk Admin, Mahasiswa, dan Super Admin' },
  { icon: Zap, label: 'Real-time', desc: 'Notifikasi instan status verifikasi prestasi Anda' },
  { icon: BarChart3, label: 'Analitik', desc: 'Dashboard interaktif dengan grafik tren prestasi kampus' },
];

interface AuthPageProps {
  initialMode: 'login' | 'register';
}

export default function AuthPage({ initialMode }: AuthPageProps) {
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', nim: '' });

  // Auto redirect if already logged in
  React.useEffect(() => {
    if (user && !authLoading) {
      router.refresh();
      router.replace(next || '/dashboard');
    }
  }, [user, authLoading, next, router]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    window.history.replaceState(null, '', `/${newMode}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { 
      toast.error('Email dan password wajib diisi'); 
      return; 
    }
    
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password);
        toast.success('Selamat datang kembali!');
        // These will likely be handled by the useEffect redirect, 
        // but keeping them here for immediate feedback and as a fallback
        router.refresh();
        router.replace(next || '/dashboard');
      } else {
        if (!form.name) { 
          toast.error('Nama lengkap wajib diisi'); 
          setLoading(false);
          return; 
        }
        await signUp(form.email, form.password, { full_name: form.name, role: 'mahasiswa' });
        toast.success('Akun berhasil dibuat! Silakan login.');
        handleModeChange('login');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-700 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-cyan-400 blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity w-fit">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <AppLogo size={28} />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">SiBerkas</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Sistem Manajemen<br />Prestasi Kampus<br />
            <span className="text-cyan-300">Berbasis Peran</span>
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-sm">
            Platform terpadu untuk kelola, verifikasi, dan analitik prestasi mahasiswa secara profesional.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm mb-1">{label}</p>
              <p className="text-indigo-200 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 relative">
        <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2.5">
          <AppLogo size={32} />
          <span className="font-bold text-lg text-slate-800">SiBerkas</span>
        </Link>
        <div className="w-full max-w-md mt-12 lg:mt-0">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                {mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}
              </h2>
              <p className="text-slate-500 text-sm">
                {mode === 'login'
                  ? 'Masukkan email dan password untuk melanjutkan.'
                  : 'Daftar sebagai mahasiswa untuk mulai mengelola prestasi.'}
              </p>
            </div>

            <div className="flex rounded-xl border border-slate-200 p-1 mb-6">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('register')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'register' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
              >
                Daftar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="label-text">Nama Lengkap</label>
                  <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Nama lengkap Anda" className="input-field" required />
                </div>
              )}
              {mode === 'register' && (
                <div>
                  <label className="label-text">NIM <span className="text-slate-400 font-normal">(opsional)</span></label>
                  <input name="nim" value={form.nim} onChange={handleChange} type="text" placeholder="Nomor Induk Mahasiswa" className="input-field" />
                </div>
              )}
              <div>
                <label className="label-text">Email</label>
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="email@kampus.ac.id" className="input-field" required />
              </div>
              <div>
                <label className="label-text">Password</label>
                <div className="relative">
                  <input
                    name="password" value={form.password} onChange={handleChange}
                    type={showPw ? 'text' : 'password'} placeholder="Min. 8 karakter" className="input-field pr-11" required minLength={8}
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Memproses…</span>
                ) : (
                  mode === 'login' ? 'Masuk' : 'Buat Akun'
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              {mode === 'login' ? (
                <>Belum punya akun?{' '}
                  <button onClick={() => handleModeChange('register')} className="text-indigo-600 font-semibold hover:underline">Daftar sekarang</button>
                </>
              ) : (
                <>Sudah punya akun?{' '}
                  <button onClick={() => handleModeChange('login')} className="text-indigo-600 font-semibold hover:underline">Masuk di sini</button>
                </>
              )}
            </p>
          </div>


          <p className="text-center text-xs text-slate-400 mt-6">
            © 2025 SiBerkas · Platform Kemahasiswaan
          </p>
        </div>
      </div>
    </div>
  );
}
