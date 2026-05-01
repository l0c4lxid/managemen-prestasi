import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manajemen Lomba',
};

export default function LombaManagementLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
