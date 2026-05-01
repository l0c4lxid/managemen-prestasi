import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pengaturan Sistem',
};

export default function PengaturanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
