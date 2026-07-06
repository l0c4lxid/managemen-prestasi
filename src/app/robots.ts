import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/p/event',
        '/p/event/',
        '/p/lomba',
        '/p/lomba/',
        '/p/prestasi',
        '/p/prestasi/',
      ],
      disallow: [
        '/login',
        '/register',
        '/dashboard',
        '/mahasiswa',
        '/event-management',
        '/lomba-management',
        '/prestasi-management',
        '/poster-management',
        '/notifikasi',
        '/profil',
        '/laporan',
      ],
    },
    sitemap: 'https://prestasi.ubsi-solo.my.id/sitemap.xml',
  };
}
