import React from 'react';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import WallOfFame from '@/components/landing/WallOfFame';
import LombaSection from '@/components/landing/LombaSection';
import EventSection from '@/components/landing/EventSection';
import CtaSection from '@/components/landing/CtaSection';
import LandingFooter from '@/components/landing/LandingFooter';

export default function RootPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <LandingNav />
      <HeroSection />
      <WallOfFame />
      <LombaSection />
      <EventSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}