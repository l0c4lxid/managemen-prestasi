'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: 'Prestasi', href: '/#prestasi' },
  { label: 'Lomba', href: '/#lomba' },
  { label: 'Event', href: '/#event' },
  { label: 'Tentang', href: '/#tentang' },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 
      ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <AppLogo size={34} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-bold text-lg text-slate-800 tracking-tight group-hover:text-indigo-700 transition-colors">PrestasiKampus</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks?.map((link) => (
              <Link
                key={`nav-link-${link?.href}`}
                href={link?.href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors duration-150"
              >
                {link?.label}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <Link href={getDashboardRoute()} className="btn-primary text-sm py-2">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors">
                  Masuk
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2">
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1 animate-slide-up">
          {navLinks?.map((link) => (
            <Link
              key={`mobile-nav-${link?.href}`}
              href={link?.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {link?.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            {session ? (
              <Link href={getDashboardRoute()} className="flex-1 btn-primary justify-center text-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="flex-1 text-center py-2.5 text-sm font-semibold text-indigo-700 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors">
                  Masuk
                </Link>
                <Link href="/register" className="flex-1 btn-primary justify-center text-sm">
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}