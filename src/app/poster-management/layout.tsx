import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manajemen Poster',
};

export default function PosterManagementLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
