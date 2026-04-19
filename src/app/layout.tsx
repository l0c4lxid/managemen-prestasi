import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'PrestasiKampus — Platform Prestasi Mahasiswa Indonesia',
  description:
    'PrestasiKampus membantu mahasiswa menemukan lomba, mencatat prestasi, dan mendapatkan verifikasi resmi dari kampus dalam satu platform terintegrasi.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              borderRadius: '12px',
            },
          }}
        />
</body>
    </html>
  );
}