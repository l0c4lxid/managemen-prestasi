import React from 'react';
import LandingNav from './components/LandingNav';
import HeroSection from './components/HeroSection';
import WallOfFame from './components/WallOfFame';
import LombaSection from './components/LombaSection';
import EventSection from './components/EventSection';
import CtaSection from './components/CtaSection';
import LandingFooter from './components/LandingFooter';

export default function LandingPage() {
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