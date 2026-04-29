import React from 'react';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import WallOfFame from '@/components/landing/WallOfFame';
import LombaSection from '@/components/landing/LombaSection';
import EventSection from '@/components/landing/EventSection';
import AboutSection from '@/components/landing/AboutSection';
import CtaSection from '@/components/landing/CtaSection';
import LandingFooter from '@/components/landing/LandingFooter';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function RootPage() {
  const supabase = await createServerSupabaseClient();
  
  // Fetch stats for HeroSection
  let achievementCount = 0;
  let userCount = 0;
  let competitionCount = 0;

  // Fetch collections
  let achievements: any[] = [];
  let competitions: any[] = [];
  let events: any[] = [];

  try {
    const [
      statsRes,
      achRes,
      compRes,
      evRes
    ] = await Promise.all([
      // Stats counts
      Promise.all([
        supabase.from('achievements').select('*', { count: 'exact', head: true }).eq('status', 'verified'),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'mahasiswa'),
        supabase.from('competitions').select('*', { count: 'exact', head: true }).eq('status', 'active')
      ]),
      // Recent achievements (Wall of Fame)
      supabase.from('achievements')
        .select(`
          id, title, description, rank, category, proof_url, status, created_at,
          users (id, name, avatar_url, nim, major)
        `)
        .eq('status', 'verified')
        .order('created_at', { ascending: false })
        .limit(12),
      // Active competitions
      supabase.from('competitions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6),
      // Upcoming & Past events
      supabase.from('events')
        .select('*')
        .order('date', { ascending: false })
        .limit(8)
    ]);

    const [achStat, userStat, compStat] = statsRes;
    achievementCount = achStat.count || 0;
    userCount = userStat.count || 0;
    competitionCount = compStat.count || 0;

    achievements = achRes.data || [];
    competitions = compRes.data || [];
    events = evRes.data || [];
  } catch (error) {
    console.error('Error fetching landing data:', error);
  }

  const stats = [
    { label: 'Prestasi Terverifikasi', value: (achievementCount || 0).toLocaleString('id-ID'), icon: 'trophy' },
    { label: 'Mahasiswa Aktif', value: (userCount || 0).toLocaleString('id-ID'), icon: 'users' },
    { label: 'Lomba Tersedia', value: (competitionCount || 0).toLocaleString('id-ID'), icon: 'swords' },
    { label: 'Rating Platform', value: '4.9', icon: 'star' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans transition-colors duration-300">
      <LandingNav />
      <HeroSection stats={stats} recentAchievements={achievements} />
      <WallOfFame initialData={achievements} />
      <LombaSection initialData={competitions} />
      <EventSection initialData={events} />
      <AboutSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}