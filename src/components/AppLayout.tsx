'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardTopbar from './DashboardTopbar';

interface AppLayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

export default function AppLayout({ children, activePath }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        activePath={activePath}
      />

      {/* Main content */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{ marginLeft: 0 }}
      >
        <DashboardTopbar
          onMobileMenuToggle={() => setMobileSidebarOpen((p) => !p)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}