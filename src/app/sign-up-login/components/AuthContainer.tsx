'use client';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AppLogo from '@/components/ui/AppLogo';
import { Trophy, Users, Swords, CheckCircle } from 'lucide-react';

const stats = [
  { icon: <Trophy size={16} />, value: '2.847', label: 'Prestasi Terverifikasi' },
  { icon: <Users size={16} />, value: '1.293', label: 'Mahasiswa Aktif' },
  { icon: <Swords size={16} />, value: '148', label: 'Lomba Tersedia' },
];

const features = [
  'Catat prestasi akademik & non-akademik',
  'Verifikasi resmi dari kemahasiswaan',
  'Tampil di Wall of Fame kampus',
  'Notifikasi deadline lomba otomatis',
];

export default function AuthContainer() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[480px] xl:w-[520px] flex-shrink-0 bg-gradient-brand p-12 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/10 blur-3xl -translate-x-1/3 translate-y-1/3" />

        <div className="relative flex-1 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <AppLogo size={40} />
            <span className="font-extrabold text-xl text-white tracking-tight">PrestasiKampus</span>
          </div>

          {/* Headline */}
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Wujudkan Prestasi,<br />Raih Pengakuan
            </h1>
            <p className="text-white/75 text-base leading-relaxed mb-8">
              Platform resmi kemahasiswaan untuk mencatat, memverifikasi, dan memamerkan setiap pencapaian terbaikmu.
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-10">
              {features?.map((f, i) => (
                <li key={`feature-${i}`} className="flex items-center gap-3 text-white/90 text-sm">
                  <CheckCircle size={16} className="text-cyan-300 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats?.map((s) => (
                <div key={`auth-stat-${s?.label}`} className="bg-white/15 rounded-2xl p-4 border border-white/20">
                  <div className="text-white/70 mb-1">{s?.icon}</div>
                  <p className="text-2xl font-extrabold text-white tabular-nums">{s?.value}</p>
                  <p className="text-white/60 text-[11px] font-medium mt-0.5 leading-tight">{s?.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-white/50 text-xs mt-8">
            Universitas Sebelas Maret — Kemahasiswaan © 2026
          </p>
        </div>
      </div>
      {/* Right panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 bg-slate-50">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <AppLogo size={36} />
          <span className="font-bold text-lg text-slate-800">PrestasiKampus</span>
        </div>

        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex bg-white border border-slate-200 rounded-2xl p-1 mb-8 shadow-sm">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                ${mode === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
            >
              Masuk
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                ${mode === 'register' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
            >
              Daftar
            </button>
          </div>

          {mode === 'login' ? <LoginForm onSwitchToRegister={() => setMode('register')} /> : <RegisterForm onSwitchToLogin={() => setMode('login')} />}
        </div>
      </div>
    </div>
  );
}