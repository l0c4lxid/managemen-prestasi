'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { 
  Menu, 
  X, 
  Trophy, 
  Swords, 
  CalendarDays, 
  Info, 
  LogIn, 
  UserPlus, 
  LayoutDashboard 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: 'Prestasi', href: '/#prestasi', icon: <Trophy size={16} /> },
  { label: 'Lomba', href: '/#lomba', icon: <Swords size={16} /> },
  { label: 'Event', href: '/#event', icon: <CalendarDays size={16} /> },
  { label: 'Tentang', href: '/#tentang', icon: <Info size={16} /> },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const { session, profile } = useAuth();

  const getDashboardRoute = () => {
    if (!profile) return '/dashboard';
    switch (profile.role) {
      case 'mahasiswa': return '/mahasiswa';
      case 'super_admin': return '/dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg shadow-slate-200/50 border-b border-slate-100' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <AppLogo size={38} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-bold text-xl text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">SiBerkas</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={`nav-link-${link.href}`}
                href={link.href}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                <span className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <Link href={getDashboardRoute()} className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 shadow-indigo-100">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-2xl transition-all">
                  <LogIn size={18} className="text-slate-400" />
                  Masuk
                </Link>
                <Link href="/register" className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 shadow-indigo-100">
                  <UserPlus size={18} />
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-8 space-y-4 shadow-2xl animate-slide-up">
          <div className="grid grid-cols-1 gap-2">
            {navLinks.map((link) => (
              <Link
                key={`mobile-nav-${link.href}`}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              >
                <span className="text-slate-400">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
            {session ? (
              <Link 
                href={getDashboardRoute()} 
                onClick={() => setMobileOpen(false)}
                className="w-full btn-primary justify-center py-4 text-base flex items-center gap-2"
              >
                <LayoutDashboard size={20} />
                Ke Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-4 text-base font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all"
                >
                  <LogIn size={20} />
                  Masuk
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setMobileOpen(false)}
                  className="w-full btn-primary justify-center py-4 text-base flex items-center gap-2"
                >
                  <UserPlus size={20} />
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}