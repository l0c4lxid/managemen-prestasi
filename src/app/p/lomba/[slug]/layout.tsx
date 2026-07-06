import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const isUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export async function generateMetadata({ params }: { params: Promise<{ slug?: string; id?: string }> }): Promise<Metadata> {
  const { slug, id } = await params;
  const slugOrId = slug || id;
  if (!slugOrId) return { title: 'Detail Lomba' };
  
  const supabase = await createServerSupabaseClient();
  
  const query = supabase.from('competitions').select('title, description, poster_url');
  if (isUUID(slugOrId)) {
    query.eq('id', slugOrId);
  } else {
    query.eq('slug', slugOrId);
  }
  
  const { data } = await query.single();
  const title = data?.title || 'Detail Lomba';
  const description = data?.description ? data.description.substring(0, 160) : 'Ikuti kompetisi menarik di SiBerkas.';
  const imageUrl = data?.poster_url || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: 'website',
    },
  };
}

export default function LombaDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
