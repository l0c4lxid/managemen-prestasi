import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manajemen Event',
};

export default function EventManagementLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
