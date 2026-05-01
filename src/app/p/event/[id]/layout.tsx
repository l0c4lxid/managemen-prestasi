import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('events').select('title').eq('id', id).single();
  return {
    title: data?.title || 'Detail Event',
  };
}

export default function EventDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
