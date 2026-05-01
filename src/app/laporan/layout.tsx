import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laporan & Statistik',
};

export default function LaporanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
