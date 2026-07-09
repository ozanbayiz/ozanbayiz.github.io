import { research } from '@/features/research/content'

import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const SITE_URL = 'https://ozanbayiz.github.io'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
        ...research.entries.map(entry => ({
            url: `${SITE_URL}/research/${entry.slug}/`,
            changeFrequency: 'yearly' as const,
            priority: 0.7
        }))
    ]
}
