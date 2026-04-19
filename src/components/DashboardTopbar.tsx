'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, ChevronDown, Settings, LogOut, User } from 'lucide-react';

interface DashboardTopbarProps {
  onMobileMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

export default function DashboardTopbar({ onMobileMenuToggle }: DashboardTopbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 h-16 bg-white/90 backdrop-blur-sm border-b border-slate-100 flex items-center px-4 sm:px-6 gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Cari prestasi, lomba, mahasiswa…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm 
              text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 
              focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all duration-150"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 
            px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 text-[10px] font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
        </button>

        {/* Year badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <span>TA 2025/2026</span>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((p) => !p)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              RA
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-none">Rizky Admin</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Admin</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-soft-lg py-1.5 z-50 animate-scale-in">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">Rizky Admin</p>
                <p className="text-xs text-slate-500">rizky@prestasikampus.id</p>
              </div>
              <Link href="/profil" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <User size={15} className="text-slate-500" />
                Profil Saya
              </Link>
              <Link href="/pengaturan" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <Settings size={15} className="text-slate-500" />
                Pengaturan
              </Link>
              <div className="border-t border-slate-100 mt-1 pt-1">
                <Link href="/sign-up-login" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={15} />
                  Keluar
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}