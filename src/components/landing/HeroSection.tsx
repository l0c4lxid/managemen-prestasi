'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Users, Trophy, Swords, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StatItem {
  label: string;
  value: string;
  icon: string;
}

interface HeroSectionProps {
  stats?: StatItem[];
}

export default function HeroSection({ stats: dynamicStats, recentAchievements = [] }: HeroSectionProps & { recentAchievements?: any[] }) {
  const { session, profile } = useAuth();
  
  const getDashboardRoute = () => {
    if (!profile) return '/dashboard';
    switch (profile.role) {
      case 'mahasiswa': return '/mahasiswa';
      default: return '/dashboard';
    }
  };
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
    { label: 'Prestasi Terverifikasi', value: '0', icon: 'trophy' },
    { label: 'Mahasiswa Aktif', value: '0', icon: 'users' },
    { label: 'Lomba Tersedia', value: '0', icon: 'swords' },
    { label: 'Rating Platform', value: '5.0', icon: 'star' },
  ];

  const displayStats = dynamicStats || defaultStats;

  // Use real data for visual card or empty state
  const visualItems = recentAchievements.length > 0 
    ? recentAchievements.slice(0, 3).map((item, i) => ({
        name: item.users?.name || 'Mahasiswa',
        lomba: item.title,
        juara: (i + 1).toString(),
        color: i === 0 ? 'from-amber-400 to-orange-500' : (i === 1 ? 'from-slate-300 to-slate-500' : 'from-emerald-400 to-emerald-600'),
        nim: item.users?.nim || i.toString()
      }))
    : [
        { name: 'Belum Ada Data', lomba: 'Mari mulai berkompetisi!', juara: '—', color: 'from-slate-100 to-slate-200', nim: '0' },
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-6 border border-indigo-200 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse-slow" />
              Pusat Prestasi Mahasiswa UBSI Surakarta
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
              Rayakan <span className="text-gradient">Pencapaian</span> <br />
              Mahasiswa <span className="text-indigo-600">UBSI</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl font-medium">
              Wadah resmi civitas akademika <span className="text-slate-900 font-bold">UBSI Surakarta</span> untuk mengeksplorasi kompetisi bergengsi, mengabadikan prestasi, dan membangun portofolio masa depan.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                href={session ? getDashboardRoute() : '/register'} 
                className="btn-primary text-base px-7 py-3.5 shadow-brand"
              >
                {session ? 'Ke Dashboard' : 'Mulai Sekarang'}
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

          {/* Right — Illustrative Achievement Galaxy */}
          <div className="relative hidden lg:block">
            <div className="relative h-[600px] w-full flex items-center justify-center">
              {/* Animated Glow Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-[60%] h-[60%] bg-cyan-400/10 rounded-full blur-[140px] animate-bounce-slow" />
              </div>

              {/* Central Core Illustration */}
              <div className="relative z-20 group">
                <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full scale-150 animate-pulse-slow" />
                
                {/* Main Floating Glass Trophy */}
                <div className="relative w-64 h-64 bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/30 shadow-[0_32px_64px_rgba(79,70,229,0.2)] flex items-center justify-center animate-float overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/5 opacity-50" />
                  <Trophy size={100} className="text-indigo-600 drop-shadow-[0_0_20px_rgba(79,70,229,0.5)]" strokeWidth={1} />
                  
                  {/* Internal Glow */}
                  <div className="absolute -bottom-10 w-full h-20 bg-indigo-500/20 blur-2xl" />
                </div>

                {/* Orbiting Elements - Achievement Spheres */}
                <div className="absolute -top-12 -left-20 w-40 p-4 bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 shadow-2xl animate-float-slow group-hover:scale-110 transition-transform duration-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                      <Star size={20} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">National</p>
                      <p className="text-sm font-black text-slate-800">Juara 1</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-16 -right-16 w-48 p-5 bg-slate-900/90 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-2xl animate-float-delay group-hover:translate-x-4 transition-transform duration-700">
                   <div className="flex items-center gap-4 mb-4">
                     <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                       <Shield size={20} />
                     </div>
                     <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Verified ID</p>
                   </div>
                   <div className="space-y-2">
                     <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[95%] bg-indigo-400" />
                     </div>
                     <p className="text-[9px] text-white/50 font-medium italic text-right">Student Authenticated</p>
                   </div>
                </div>

                {/* Circular Skill Badge Orbit */}
                <div className="absolute top-1/2 -right-24 w-24 h-24 bg-white/40 backdrop-blur-xl rounded-full border border-white/50 flex items-center justify-center animate-spin-slow">
                   <Zap size={32} className="text-amber-500" />
                </div>

                <div className="absolute top-0 -right-32 w-20 h-20 bg-cyan-500 rounded-3xl rotate-12 flex items-center justify-center text-white shadow-xl animate-float-slow">
                   <Users size={32} />
                </div>

                {/* Achievement Connections (Visual Lines) */}
                <svg className="absolute inset-0 w-full h-full -z-10 overflow-visible opacity-30">
                  <path d="M-100,-50 Q0,0 50,150" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="10,10" className="animate-dash" />
                  <path d="M300,100 Q200,250 50,200" fill="none" stroke="url(#grad2)" strokeWidth="2" strokeDasharray="10,10" className="animate-dash-reverse" />
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                </svg>
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