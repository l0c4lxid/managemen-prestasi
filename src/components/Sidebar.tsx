'use client';
import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Trophy,
  Swords,
  CalendarDays,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart3,
  Bell,
  UserCircle,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  group?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} />, group: 'Utama' },
  { label: 'Prestasi', href: '/prestasi-management', icon: <Trophy size={20} />, badge: 7, group: 'Akademik' },
  { label: 'Lomba', href: '/lomba-management', icon: <Swords size={20} />, group: 'Akademik' },
  { label: 'Event', href: '/event-management', icon: <CalendarDays size={20} />, group: 'Akademik' },
  { label: 'Mahasiswa', href: '/mahasiswa', icon: <Users size={20} />, group: 'Manajemen' },
  { label: 'Laporan', href: '/laporan', icon: <BarChart3 size={20} />, group: 'Manajemen' },
  { label: 'Notifikasi', href: '/notifikasi', icon: <Bell size={20} />, badge: 3, group: 'Manajemen' },
  { label: 'Profil', href: '/profil', icon: <UserCircle size={20} />, group: 'Sistem' },
  { label: 'Pengaturan', href: '/pengaturan', icon: <Settings size={20} />, group: 'Sistem' },
];

const groups = ['Utama', 'Akademik', 'Manajemen', 'Sistem'];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  activePath?: string;
}

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  activePath,
}: SidebarProps) {
  const sidebarWidth = collapsed ? 'w-16' : 'w-64';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-white border-r border-slate-100 
          shadow-soft z-20 transition-all duration-300 ease-in-out ${sidebarWidth}`}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          activePath={activePath}
        />
      </aside>
      {/* Spacer for desktop */}
      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${sidebarWidth}`} />

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-100 
          shadow-soft-lg z-40 transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent
          collapsed={false}
          onToggleCollapse={onMobileClose}
          activePath={activePath}
          isMobile
        />
      </aside>
    </>
  );
}

function SidebarContent({
  collapsed,
  onToggleCollapse,
  activePath,
  isMobile,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activePath?: string;
  isMobile?: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-slate-100 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <AppLogo size={32} />
            <span className="font-bold text-base text-slate-800 tracking-tight">PrestasiKampus</span>
          </div>
        )}
        {collapsed && <AppLogo size={32} />}
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors duration-150"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin">
        {groups.map((group) => {
          const items = navItems.filter((i) => i.group === group);
          if (!items.length) return null;
          return (
            <div key={`group-${group}`} className="mb-4">
              {!collapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 mb-1.5">
                  {group}
                </p>
              )}
              {items.map((item) => {
                const isActive = activePath === item.href;
                return (
                  <Link
                    key={`nav-${item.href}`}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 
                      transition-all duration-150 group
                      ${isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold' :'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={`flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="text-sm flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold tabular-nums">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                    {/* Tooltip for collapsed */}
                    {collapsed && (
                      <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User profile at bottom */}
      <div className={`border-t border-slate-100 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              RA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">Rizky Admin</p>
              <p className="text-[11px] text-slate-500 truncate">Admin Kemahasiswaan</p>
            </div>
            <button className="p-1 text-slate-400 hover:text-red-500 transition-colors" title="Keluar">
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold"
            title="Rizky Admin — Keluar"
          >
            RA
          </button>
        )}
      </div>
    </div>
  );
}