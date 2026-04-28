import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'PrestasiKampus — Platform Manajemen Prestasi Mahasiswa',
  description:
    'PrestasiKampus — sistem terpadu manajemen prestasi, kompetisi, dan program kemahasiswaan berbasis peran untuk kampus Indonesia.',
  icons: { icon: [{ url: '/favicon.ico', type: 'image/x-icon' }] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: { fontFamily: 'DM Sans, sans-serif', borderRadius: '12px' },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}