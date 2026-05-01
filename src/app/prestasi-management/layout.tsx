import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manajemen Prestasi',
};

export default function PrestasiManagementLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
