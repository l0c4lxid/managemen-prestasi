'use client';
import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  LayoutDashboard, Trophy, Swords, CalendarDays, Users, Settings,
  ChevronLeft, ChevronRight, LogOut, BarChart3, Bell, UserCircle,
  Bookmark, Send, ClipboardList, ShieldCheck, Star, Images,
} from 'lucide-react';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  group: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // Utama — semua role
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} />, group: 'Utama', roles: ['super_admin', 'admin_prestasi', 'admin_lomba', 'admin_perencanaan', 'mahasiswa'] },

  // Mahasiswa
  { label: 'Cari Lomba & Hibah', href: '/lomba-management', icon: <Swords size={20} />, group: 'Peluang & Prestasi', roles: ['mahasiswa'] },
  { label: 'Event & Bootcamp', href: '/event-management', icon: <CalendarDays size={20} />, group: 'Peluang & Prestasi', roles: ['mahasiswa'] },
  { label: 'Riwayat Prestasi', href: '/mahasiswa/riwayat', icon: <Star size={20} />, group: 'Peluang & Prestasi', roles: ['mahasiswa'] },
  { label: 'Bookmark Lomba', href: '/mahasiswa/bookmark', icon: <Bookmark size={20} />, group: 'Peluang & Prestasi', roles: ['mahasiswa'] },

  // Admin Lomba, Event & Prestasi
  { label: 'Manajemen Lomba', href: '/lomba-management', icon: <Swords size={20} />, group: 'Admin', roles: ['super_admin', 'admin_lomba', 'admin_prestasi'] },
  { label: 'Event & Bootcamp', href: '/event-management', icon: <CalendarDays size={20} />, group: 'Admin', roles: ['super_admin', 'admin_lomba', 'admin_prestasi'] },
  { label: 'Manajemen Prestasi', href: '/prestasi-management', icon: <ShieldCheck size={20} />, group: 'Admin', roles: ['super_admin', 'admin_prestasi', 'admin_lomba'] },
  
  // Manajemen Program & User
  { label: 'Manajemen Program', href: '/laporan', icon: <ClipboardList size={20} />, group: 'Admin', roles: ['super_admin', 'admin_perencanaan', 'admin_prestasi'] },
  { label: 'Manajemen User', href: '/mahasiswa', icon: <Users size={20} />, group: 'Admin', roles: ['super_admin', 'admin_prestasi', 'admin_lomba'] },
  { label: 'Manajemen Poster', href: '/poster-management', icon: <Images size={20} />, group: 'Admin', roles: ['super_admin'] },

  // Sistem — semua
  { label: 'Notifikasi', href: '/notifikasi', icon: <Bell size={20} />, group: 'Sistem', roles: ['super_admin', 'admin_prestasi', 'admin_lomba', 'admin_perencanaan', 'mahasiswa'] },
  { label: 'Profil', href: '/profil', icon: <UserCircle size={20} />, group: 'Sistem', roles: ['super_admin', 'admin_prestasi', 'admin_lomba', 'admin_perencanaan', 'mahasiswa'] },
  { label: 'Pengaturan', href: '/pengaturan', icon: <Settings size={20} />, group: 'Sistem', roles: ['super_admin'] },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  activePath?: string;
}

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose, activePath }: SidebarProps) {
  const sidebarWidth = collapsed ? 'w-16' : 'w-64';
  return (
    <>
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-white border-r border-slate-100 shadow-soft z-20 transition-all duration-300 ease-in-out ${sidebarWidth}`}>
        <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} activePath={activePath} />
      </aside>
      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${sidebarWidth}`} />
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-100 shadow-soft-lg z-40 transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent collapsed={false} onToggleCollapse={onMobileClose} activePath={activePath} isMobile />
      </aside>
    </>
  );
}

function SidebarContent({ collapsed, onToggleCollapse, activePath, isMobile }: {
  collapsed: boolean; onToggleCollapse: () => void; activePath?: string; isMobile?: boolean;
}) {
  const { profile, role, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try { 
      await signOut(); 
      router.refresh();
      router.replace('/login'); 
    } catch { 
      toast.error('Gagal keluar'); 
    }
  };

  const roleLabel: Record<string, string> = {
    super_admin: 'Super Admin', admin_prestasi: 'Admin Prestasi',
    admin_lomba: 'Admin Lomba', admin_perencanaan: 'Admin Perencanaan', mahasiswa: 'Mahasiswa',
  };

  // Build unique group → items filtered by role
  const visibleItems = navItems.filter(item => !role || item.roles.includes(role));
  const groups = Array.from(new Set(visibleItems.map(i => i.group)));

  const initials = (profile?.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center h-16 px-4 border-b border-slate-100 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <AppLogo size={32} />
            <span className="font-bold text-base text-slate-800 tracking-tight">PrestasiKampus</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="hover:opacity-80 transition-opacity flex justify-center w-full">
            <AppLogo size={32} />
          </Link>
        )}
        {!isMobile && (
          <button onClick={onToggleCollapse} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" aria-label="Toggle sidebar">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin">
        {groups.map((group) => {
          const items = visibleItems.filter(i => i.group === group);
          if (!items.length) return null;
          return (
            <div key={group} className="mb-4">
              {!collapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 mb-1.5">{group}</p>
              )}
              {items.map((item) => {
                const isActive = activePath === item.href;
                const displayLabel = (item.href === '/mahasiswa' && role !== 'super_admin') ? 'Data Mahasiswa' : item.label;
                return (
                  <Link key={`${item.href}-${item.label}`} href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 group
                      ${isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                    title={collapsed ? displayLabel : undefined}
                  >
                    <span className={`flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="text-sm flex-1 truncate">{displayLabel}</span>}
                    {!collapsed && item.badge && (
                      <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold tabular-nums">{item.badge}</span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                    {collapsed && (
                      <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {displayLabel}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className={`border-t border-slate-100 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{profile?.name || 'Pengguna'}</p>
              <p className="text-[11px] text-slate-500 truncate">{role ? roleLabel[role] : '—'}</p>
            </div>
            <button onClick={handleSignOut} className="p-1 text-slate-400 hover:text-red-500 transition-colors" title="Keluar">
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button onClick={handleSignOut}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold"
            title="Keluar"
          >
            {initials}
          </button>
        )}
      </div>
    </div>
  );
}