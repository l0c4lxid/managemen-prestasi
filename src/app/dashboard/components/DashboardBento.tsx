'use client';
import React, { useEffect, useState } from 'react';
import { Trophy, Users, Swords, Clock, CalendarDays, TrendingUp, TrendingDown, AlertTriangle, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface KpiCard {
  id: string; label: string; value: string | number;
  change?: string; changeLabel?: string; trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode; color: string; bgLight: string; textLight: string;
  span?: string; hero?: boolean; alert?: boolean;
}

export default function DashboardBento() {
  const { role, profile } = useAuth();
  const supabase = createClient();
  const [counts, setCounts] = useState({
    achievements: 0, pending: 0, competitions: 0, events: 0, users: 0, verified: 0,
    myAchievements: 0, myPending: 0, myBookmarks: 0, myRegistrations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [
        { count: achievements },
        { count: pending },
        { count: competitions },
        { count: events },
        { count: users },
        { count: verified },
      ] = await Promise.all([
        supabase.from('achievements').select('id', { count: 'exact', head: true }),
        supabase.from('achievements').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('competitions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('achievements').select('id', { count: 'exact', head: true }).eq('status', 'verified'),
      ]);

      let myAchievements = 0, myPending = 0, myBookmarks = 0, myRegistrations = 0;
      if (profile?.id && role === 'mahasiswa') {
        const [ma, mp, mb, mr] = await Promise.all([
          supabase.from('achievements').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
          supabase.from('achievements').select('id', { count: 'exact', head: true }).eq('user_id', profile.id).eq('status', 'pending'),
          supabase.from('bookmarks').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
          supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
        ]);
        myAchievements = ma.count || 0; myPending = mp.count || 0;
        myBookmarks = mb.count || 0; myRegistrations = mr.count || 0;
      }

      setCounts({ achievements: achievements || 0, pending: pending || 0, competitions: competitions || 0, events: events || 0, users: users || 0, verified: verified || 0, myAchievements, myPending, myBookmarks, myRegistrations });
      setLoading(false);
    };
    fetch();
  }, [profile?.id, role]); // eslint-disable-line react-hooks/exhaustive-deps

  const adminCards: KpiCard[] = [
    { id: 'kpi-prestasi', label: 'Total Prestasi', value: loading ? '—' : counts.achievements.toLocaleString('id'), change: `${counts.verified} terverifikasi`, changeLabel: '', trend: 'up', icon: <Trophy size={22} />, color: 'bg-indigo-600', bgLight: 'bg-indigo-50', textLight: 'text-indigo-600', span: 'lg:col-span-2', hero: true },
    { id: 'kpi-pending', label: 'Menunggu Verifikasi', value: loading ? '—' : counts.pending, change: 'segera ditinjau', changeLabel: '', trend: 'down', alert: true, icon: <Clock size={20} />, color: 'bg-amber-500', bgLight: 'bg-amber-50', textLight: 'text-amber-600' },
    { id: 'kpi-lomba', label: 'Lomba Aktif', value: loading ? '—' : counts.competitions, change: 'terbuka', changeLabel: '', trend: 'up', icon: <Swords size={20} />, color: 'bg-emerald-600', bgLight: 'bg-emerald-50', textLight: 'text-emerald-600' },
    { id: 'kpi-users', label: 'Total Pengguna', value: loading ? '—' : counts.users.toLocaleString('id'), change: 'terdaftar', changeLabel: '', trend: 'up', icon: <Users size={20} />, color: 'bg-cyan-600', bgLight: 'bg-cyan-50', textLight: 'text-cyan-600' },
    { id: 'kpi-event', label: 'Event & Bootcamp', value: loading ? '—' : counts.events, change: 'tersedia', changeLabel: '', trend: 'neutral', icon: <CalendarDays size={20} />, color: 'bg-purple-600', bgLight: 'bg-purple-50', textLight: 'text-purple-600' },
    { id: 'kpi-approval', label: 'Tingkat Verifikasi', value: loading ? '—' : counts.achievements ? `${Math.round((counts.verified / counts.achievements) * 100)}%` : '0%', change: 'dari total submit', changeLabel: '', trend: 'up', icon: <TrendingUp size={20} />, color: 'bg-slate-600', bgLight: 'bg-slate-50', textLight: 'text-slate-600' },
  ];

  const mahasiswaCards: KpiCard[] = [
    { id: 'kpi-my-prestasi', label: 'Prestasi Saya', value: loading ? '—' : counts.myAchievements, change: `${counts.myPending} menunggu verifikasi`, changeLabel: '', trend: 'up', icon: <Star size={22} />, color: 'bg-indigo-600', bgLight: 'bg-indigo-50', textLight: 'text-indigo-600', span: 'lg:col-span-2', hero: true },
    { id: 'kpi-pending-me', label: 'Sedang Diproses', value: loading ? '—' : counts.myPending, alert: counts.myPending > 0, change: 'menunggu review admin', changeLabel: '', trend: 'down', icon: <Clock size={20} />, color: 'bg-amber-500', bgLight: 'bg-amber-50', textLight: 'text-amber-600' },
    { id: 'kpi-bookmark', label: 'Lomba Dibookmark', value: loading ? '—' : counts.myBookmarks, change: 'lomba favorit', changeLabel: '', trend: 'neutral', icon: <Swords size={20} />, color: 'bg-emerald-600', bgLight: 'bg-emerald-50', textLight: 'text-emerald-600' },
    { id: 'kpi-lomba-aktif', label: 'Lomba Aktif', value: loading ? '—' : counts.competitions, change: 'terbuka sekarang', changeLabel: '', trend: 'up', icon: <Trophy size={20} />, color: 'bg-cyan-600', bgLight: 'bg-cyan-50', textLight: 'text-cyan-600' },
    { id: 'kpi-reg', label: 'Event Terdaftar', value: loading ? '—' : counts.myRegistrations, change: 'event & bootcamp', changeLabel: '', trend: 'neutral', icon: <CalendarDays size={20} />, color: 'bg-purple-600', bgLight: 'bg-purple-50', textLight: 'text-purple-600' },
  ];

  const cards = role === 'mahasiswa' ? mahasiswaCards : adminCards;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.id} className={`card p-5 flex flex-col gap-3 relative overflow-hidden ${card.span || ''} ${card.alert ? 'border-amber-200 bg-amber-50/30' : ''} ${card.hero ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-0' : ''}`}>
          {card.alert && <div className="absolute top-3 right-3"><AlertTriangle size={16} className="text-amber-500" /></div>}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.hero ? 'bg-white/20 text-white' : `${card.bgLight} ${card.textLight}`}`}>
            {card.icon}
          </div>
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-widest mb-1 ${card.hero ? 'text-indigo-200' : 'text-slate-500'}`}>{card.label}</p>
            <p className={`tabular-nums font-extrabold ${card.hero ? 'text-4xl text-white' : 'text-3xl text-slate-800'}`}>{card.value}</p>
          </div>
          {card.change && (
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${card.trend === 'up' ? (card.hero ? 'text-indigo-200' : 'text-emerald-600') : card.trend === 'down' ? (card.hero ? 'text-red-300' : 'text-red-600') : (card.hero ? 'text-indigo-200' : 'text-slate-500')}`}>
              {card.trend === 'up' && <TrendingUp size={13} />}
              {card.trend === 'down' && <TrendingDown size={13} />}
              <span>{card.change}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}