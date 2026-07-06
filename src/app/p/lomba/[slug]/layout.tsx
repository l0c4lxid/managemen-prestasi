import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const isUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export async function generateMetadata({ params }: { params: Promise<{ slug?: string; id?: string }> }): Promise<Metadata> {
  const { slug, id } = await params;
  const slugOrId = slug || id;
  if (!slugOrId) return { title: 'Detail Lomba' };
  
  const supabase = await createServerSupabaseClient();
  
  const query = supabase.from('competitions').select('title');
  if (isUUID(slugOrId)) {
    query.eq('id', slugOrId);
  } else {
    query.eq('slug', slugOrId);
  }
  
  const { data } = await query.single();
  return {
    title: data?.title || 'Detail Lomba',
  };
}

export default function LombaDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
