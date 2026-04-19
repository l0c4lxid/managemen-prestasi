import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Wall of Fame', href: '#wall-of-fame' },
    { label: 'Lomba Aktif', href: '#lomba' },
    { label: 'Event & Pelatihan', href: '#event' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  Bantuan: [
    { label: 'Panduan Penggunaan', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Hubungi Kami', href: '#' },
    { label: 'Status Sistem', href: '#' },
  ],
  Legal: [
    { label: 'Kebijakan Privasi', href: '#' },
    { label: 'Syarat & Ketentuan', href: '#' },
    { label: 'Kebijakan Cookie', href: '#' },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <AppLogo size={34} />
              <span className="font-bold text-lg text-white tracking-tight">PrestasiKampus</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xs">
              Platform resmi kemahasiswaan untuk mencatat, memverifikasi, dan memamerkan prestasi mahasiswa Indonesia.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin size={13} className="text-slate-500 flex-shrink-0" />
                Jl. Ir. Sutami No.36A, Surakarta, Jawa Tengah
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail size={13} className="text-slate-500 flex-shrink-0" />
                kemahasiswaan@prestasikampus.id
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Phone size={13} className="text-slate-500 flex-shrink-0" />
                (0271) 632-163
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks)?.map(([group, links]) => (
            <div key={`footer-group-${group}`}>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links?.map((link) => (
                  <li key={`footer-link-${link?.label}`}>
                    <Link href={link?.href} className="text-sm text-slate-400 hover:text-white transition-colors duration-150">
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-slate-500">
            © 2026 PrestasiKampus. Hak cipta dilindungi. Dikembangkan untuk kemajuan mahasiswa Indonesia.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow" />
            <span className="text-xs text-slate-500">Semua sistem berjalan normal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}