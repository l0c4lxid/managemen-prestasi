import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Users, Trophy, Swords } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon: string;
}

interface HeroSectionProps {
  stats?: StatItem[];
}

export default function HeroSection({ stats: dynamicStats, recentAchievements = [] }: HeroSectionProps & { recentAchievements?: any[] }) {
  // Map icon strings to components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy size={16} />;
      case 'users': return <Users size={16} />;
      case 'swords': return <Swords size={16} />;
      case 'star': return <Star size={16} />;
      default: return <Trophy size={16} />;
    }
  };

  const getColors = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return 'text-indigo-600 bg-indigo-50';
      case 'users': return 'text-cyan-600 bg-cyan-50';
      case 'swords': return 'text-emerald-600 bg-emerald-50';
      case 'star': return 'text-amber-600 bg-amber-50';
      default: return 'text-indigo-600 bg-indigo-50';
    }
  };

  // Fallback stats if none provided
  const defaultStats = [
    { label: 'Prestasi Terverifikasi', value: '2.847', icon: 'trophy' },
    { label: 'Mahasiswa Aktif', value: '1.293', icon: 'users' },
    { label: 'Lomba Tersedia', value: '148', icon: 'swords' },
    { label: 'Rating Platform', value: '4.9', icon: 'star' },
  ];

  const displayStats = dynamicStats || defaultStats;

  // Use real data for visual card or fallback
  const visualItems = recentAchievements.length > 0 
    ? recentAchievements.slice(0, 3).map((item, i) => ({
        name: item.users?.name || 'Mahasiswa',
        lomba: item.title,
        juara: (i + 1).toString(),
        color: i === 0 ? 'from-amber-400 to-orange-500' : (i === 1 ? 'from-slate-300 to-slate-500' : 'from-emerald-400 to-emerald-600'),
        nim: item.users?.nim || i.toString()
      }))
    : [
        { name: 'Aninda Putri Rahayu', lomba: 'PKM-K Nasional 2025', juara: '1', color: 'from-amber-400 to-orange-500', nim: '2021310045' },
        { name: 'Fadhil Zulkarnain', lomba: 'GEMASTIK Animasi', juara: '2', color: 'from-slate-300 to-slate-500', nim: '2022140023' },
        { name: 'Renata Kusuma Dewi', lomba: 'Olimpiade Akuntansi', juara: '1', color: 'from-amber-400 to-orange-500', nim: '2020250067' },
      ];

  return (
    <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-indigo-100/40 blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-100/40 blur-3xl translate-y-1/2 -translate-x-1/4" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-6 border border-indigo-200">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse-slow" />
              Platform Prestasi Mahasiswa Indonesia
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
              Catat & Rayakan{' '}
              <span className="text-gradient">Prestasi</span>
              {' '}Terbaikmu
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Platform resmi kampus untuk menemukan lomba bergengsi, mendaftarkan prestasi,
              dan mendapatkan verifikasi dari kemahasiswaan — semua dalam satu tempat.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="btn-primary text-base px-7 py-3.5 shadow-brand">
                Mulai Sekarang
                <ArrowRight size={18} />
              </Link>
              <a href="#faq" className="btn-outline text-base px-7 py-3.5">
                Pusat Bantuan
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {['MR', 'DS', 'AF', 'NP', 'YK'].map((initials, i) => (
                  <div
                    key={`avatar-${initials}`}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: `hsl(${220 + i * 20}, 70%, 55%)` }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={`star-${s}`} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Dipercaya {displayStats[1]?.value}+ mahasiswa aktif</p>
              </div>
            </div>
          </div>

          {/* Right — Stats visual */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Main visual card */}
              <div className="bg-white rounded-3xl shadow-soft-lg border border-slate-100 p-6 animate-slide-up">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wall of Fame</p>
                    <h3 className="text-lg font-bold text-slate-800 mt-0.5">Prestasi Terbaru</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Live</span>
                </div>

                <div className="space-y-3">
                  {visualItems.map((item) => (
                    <div key={`hero-item-${item.nim}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        #{item.juara}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500 truncate">{item.lomba}</p>
                      </div>
                      <Trophy size={14} className="text-amber-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating stat cards */}
              <div className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-soft border border-slate-100 p-4 animate-slide-up">
                <p className="text-xs text-slate-500 font-medium">Prestasi Bulan Ini</p>
                <p className="text-2xl font-extrabold text-indigo-700 tabular-nums mt-0.5">+{displayStats[0]?.value}</p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">↑ Update Realtime</p>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-soft border border-slate-100 p-4 animate-slide-up">
                <p className="text-xs text-slate-500 font-medium">Tingkat Verifikasi</p>
                <p className="text-2xl font-extrabold text-emerald-600 tabular-nums mt-0.5">99.2%</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">dalam 48 jam</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {displayStats.map((stat) => (
            <div key={`stat-${stat.label}`} className="glass-card p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getColors(stat.icon)}`}>
                {getIcon(stat.icon)}
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-800 tabular-nums">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}