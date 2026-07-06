import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://prestasi.ubsi-solo.my.id';

  const routes = [
    '',
    '/p/event',
    '/p/lomba',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch event slugs
    const { data: events } = await supabase
      .from('events')
      .select('slug, created_at')
      .not('slug', 'is', null);

    const eventUrls = (events || []).map((e) => ({
      url: `${baseUrl}/p/event/${e.slug}`,
      lastModified: e.created_at ? new Date(e.created_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Fetch lomba slugs
    const { data: competitions } = await supabase
      .from('competitions')
      .select('slug, created_at')
      .not('slug', 'is', null);

    const lombaUrls = (competitions || []).map((c) => ({
      url: `${baseUrl}/p/lomba/${c.slug}`,
      lastModified: c.created_at ? new Date(c.created_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...eventUrls, ...lombaUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
