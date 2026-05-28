import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://futurebit.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  return [
    { url: BASE,                  lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/airdrop`,     lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/staking`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/stake`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/competition`, lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/leaderboard`, lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE}/swap`,        lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/guide`,       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/docs`,        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/terms`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/privacy`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];
}
