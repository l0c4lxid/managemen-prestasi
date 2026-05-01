import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Mahasiswa',
};

export default function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
