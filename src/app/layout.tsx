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
  title: {
    template: 'SiBerkas | %s',
    default: 'SiBerkas — Sistem Informasi Basis Evaluasi Rekap Kegiatan dan Arsip Prestasi Mahasiswa',
  },
  description:
    'SIBERKAS — Sistem Informasi Basis Evaluasi Rekap Kegiatan dan Arsip prestasi mahasiswa Indonesia.',
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