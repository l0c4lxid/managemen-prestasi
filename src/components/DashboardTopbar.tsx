'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Menu, ChevronDown, Settings, LogOut, User, Trophy, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface DashboardTopbarProps {
  onMobileMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

export default function DashboardTopbar({ onMobileMenuToggle }: DashboardTopbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { profile, role, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string, title: string, type: 'achievement' | 'event', url: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const roleLabel: Record<string, string> = {
    super_admin: 'Super Admin', admin_prestasi: 'Admin Prestasi',
    admin_lomba: 'Admin Lomba', admin_perencanaan: 'Admin Perencanaan', mahasiswa: 'Mahasiswa',
  };

  const initials = (profile?.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => {
    if (!profile?.id) return;
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .eq('is_read', false);
      setUnreadCount(count || 0);
    };
    fetchUnread();
  }, [profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    try { await signOut(); router.push('/sign-up-login'); } catch { toast.error('Gagal keluar'); }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowResults(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      let achQuery = supabase.from('achievements').select('id, title').ilike('title', `%${searchQuery}%`).limit(3);
      if (role === 'mahasiswa' && profile?.id) achQuery = achQuery.eq('user_id', profile.id);
      
      const [ { data: achievements }, { data: events } ] = await Promise.all([
        achQuery,
        supabase.from('events').select('id, title').ilike('title', `%${searchQuery}%`).limit(3)
      ]);

      const results = [
        ...(achievements || []).map(a => ({ id: a.id, title: a.title, type: 'achievement' as const, url: role === 'mahasiswa' ? '/mahasiswa/riwayat' : '/prestasi-management' })),
        ...(events || []).map(e => ({ id: e.id, title: e.title, type: 'event' as const, url: `/event-management/${e.id}` }))
      ];

      setSearchResults(results);
      setIsSearching(false);
      setShowResults(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, role, profile?.id, supabase]);

  return (
    <header className="sticky top-0 z-10 h-16 bg-white/90 backdrop-blur-sm border-b border-slate-100 flex items-center px-4 sm:px-6 gap-4">
      <button onClick={onMobileMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" aria-label="Buka menu">
        <Menu size={20} />
      </button>

      <div className="flex-1 max-w-md">
        <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setShowResults(false); }}>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Cari prestasi, lomba, mahasiswa…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
            onFocus={() => { if (searchQuery.trim()) setShowResults(true); }}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all duration-150"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 text-[10px] font-mono">⌘K</kbd>
          
          {/* Search Dropdown */}
          {showResults && (
            <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-2xl border border-slate-100 shadow-soft-xl py-2 z-50 animate-scale-in">
              {isSearching ? (
                <div className="px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></span>
                  Mencari...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto">
                  {searchResults.map((res) => (
                    <Link
                      key={`${res.type}-${res.id}`}
                      href={res.url}
                      onClick={() => { setShowResults(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${res.type === 'achievement' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {res.type === 'achievement' ? <Trophy size={14} /> : <Calendar size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{res.title}</p>
                        <p className="text-[11px] text-slate-500 capitalize">{res.type}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                  Tidak ditemukan hasil untuk "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Link href="/notifikasi" className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <span>TA 2026/2027</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(p => !p)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-none">{profile?.name || 'Pengguna'}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{role ? roleLabel[role] : '—'}</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-soft-lg py-1.5 z-50 animate-scale-in">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">{profile?.name || 'Pengguna'}</p>
                <p className="text-xs text-slate-500">{profile?.email}</p>
              </div>
              <Link href="/profil" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <User size={15} className="text-slate-500" />
                Profil Saya
              </Link>
              <Link href="/pengaturan" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <Settings size={15} className="text-slate-500" />
                Pengaturan
              </Link>
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={15} />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}