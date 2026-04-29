import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Prestasi', href: '/#prestasi' },
    { label: 'Lomba Aktif', href: '/#lomba' },
    { label: 'Event & Pelatihan', href: '/#event' },
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
            <div className="mb-6">
              <h3 className="text-white font-bold text-sm mb-1">Universitas BSI Kampus Solo</h3>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                Universitas di Surakarta, Jawa Tengah
              </p>
              <div className="flex items-center gap-2 text-xs text-indigo-400 mb-4">
                <span className="font-bold">4.9</span>
                <div className="flex text-amber-500">
                  {'★'.repeat(5)}
                </div>
                <span className="text-slate-500">(4,967 ulasan Google)</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-400">
                <MapPin size={14} className="text-slate-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Jl. Letjen Sutoyo No.43, Cengklik, Nusukan, Kec. Banjarsari, Kota Surakarta, Jawa Tengah 57135
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <Phone size={14} className="text-slate-500 flex-shrink-0" />
                0857-9920-3851
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <Mail size={14} className="text-slate-500 flex-shrink-0" />
                pmbubsi.id
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