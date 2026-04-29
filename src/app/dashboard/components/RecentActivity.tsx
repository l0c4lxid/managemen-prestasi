'use client';
import React, { useEffect, useState } from 'react';
import { Trophy, UserPlus, CheckCircle, XCircle, Swords, CalendarDays, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Activity {
  id: string;
  type: string;
  text: string;
  sub: string;
  time: string;
  timestamp: Date;
  icon: React.ReactNode;
  color: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      // 1. Fetch latest achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('id, title, status, created_at, users:user_id(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      // 2. Fetch latest users
      const { data: users } = await supabase
        .from('users')
        .select('id, name, nim, role, created_at')
        .eq('role', 'mahasiswa')
        .order('created_at', { ascending: false })
        .limit(3);

      // 3. Fetch latest competitions
      const { data: competitions } = await supabase
        .from('competitions')
        .select('id, title, organizer, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      // 4. Fetch latest events
      const { data: events } = await supabase
        .from('events')
        .select('id, title, start_date, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      const allActivities: Activity[] = [];

      // Map Achievements
      achievements?.forEach(a => {
        const userName = (a.users as any)?.name || 'Mahasiswa';
        if (a.status === 'pending') {
          allActivities.push({
            id: `ach-${a.id}`,
            type: 'new_prestasi',
            text: 'Submisi prestasi baru',
            sub: `${userName} — ${a.title}`,
            time: formatTime(a.created_at),
            timestamp: new Date(a.created_at),
            icon: <Trophy size={14} />,
            color: 'bg-amber-100 text-amber-600'
          });
        } else if (a.status === 'verified') {
          allActivities.push({
            id: `ach-${a.id}`,
            type: 'verified',
            text: `Prestasi ${userName} diverifikasi`,
            sub: a.title,
            time: formatTime(a.created_at),
            timestamp: new Date(a.created_at),
            icon: <CheckCircle size={14} />,
            color: 'bg-emerald-100 text-emerald-600'
          });
        } else if (a.status === 'rejected') {
          allActivities.push({
            id: `ach-${a.id}`,
            type: 'rejected',
            text: 'Prestasi ditolak',
            sub: a.title,
            time: formatTime(a.created_at),
            timestamp: new Date(a.created_at),
            icon: <XCircle size={14} />,
            color: 'bg-red-100 text-red-600'
          });
        }
      });

      // Map Users
      users?.forEach(u => {
        allActivities.push({
          id: `usr-${u.id}`,
          type: 'new_user',
          text: 'Mahasiswa baru terdaftar',
          sub: `${u.name} — ${u.nim || 'N/A'}`,
          time: formatTime(u.created_at),
          timestamp: new Date(u.created_at),
          icon: <UserPlus size={14} />,
          color: 'bg-indigo-100 text-indigo-600'
        });
      });

      // Map Competitions
      competitions?.forEach(c => {
        allActivities.push({
          id: `comp-${c.id}`,
          type: 'new_lomba',
          text: 'Lomba baru ditambahkan',
          sub: c.title,
          time: formatTime(c.created_at),
          timestamp: new Date(c.created_at),
          icon: <Swords size={14} />,
          color: 'bg-cyan-100 text-cyan-600'
        });
      });

      // Map Events
      events?.forEach(e => {
        allActivities.push({
          id: `evt-${e.id}`,
          type: 'new_event',
          text: 'Event baru dijadwalkan',
          sub: e.title,
          time: formatTime(e.created_at),
          timestamp: new Date(e.created_at),
          icon: <CalendarDays size={14} />,
          color: 'bg-purple-100 text-purple-600'
        });
      });

      // Sort by timestamp
      allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setActivities(allActivities.slice(0, 10));
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: id });
    } catch {
      return 'Baru saja';
    }
  };

  return (
    <div className="card overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">Aktivitas Terbaru</h3>
          <p className="text-xs text-slate-500 mt-0.5">Perubahan real-time di platform</p>
        </div>
        <button onClick={fetchActivities} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="divide-y divide-slate-50 overflow-y-auto max-h-[420px] scrollbar-thin">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-2" size={24} />
            <p className="text-xs">Memuat aktivitas...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-slate-400">Belum ada aktivitas terbaru.</p>
          </div>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${act.color}`}>
                {act.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 leading-snug">{act.text}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{act.sub}</p>
              </div>
              <p className="text-[10px] text-slate-400 font-medium flex-shrink-0 mt-0.5 whitespace-nowrap">{act.time}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { RefreshCw } from 'lucide-react';