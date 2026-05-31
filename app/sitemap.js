import { procesosData } from '@/lib/procesos';

const BASE_URL = 'https://fundaciontcp.com';

export default function sitemap() {
  const staticRoutes = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/nosotros/organizacion`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/nosotros/equipo`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/nosotros/voluntario-y-donaciones`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/procesos`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/contacto`, priority: 0.6, changeFrequency: 'yearly' },
  ];

  const procesoRoutes = procesosData
    .filter((p) => p.link !== null)
    .map((p) => ({
      url: `${BASE_URL}/procesos/${p.link}`,
      priority: 0.8,
      changeFrequency: 'monthly',
    }));

  return [...staticRoutes, ...procesoRoutes];
}
