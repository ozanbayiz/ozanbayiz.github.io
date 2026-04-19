import { projectsData } from '@/features/projects'

import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const SITE_URL = 'https://ozanbayiz.github.io'

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
        { url: `${SITE_URL}/projects`, changeFrequency: 'monthly', priority: 0.8 }
    ]

    const projectRoutes: MetadataRoute.Sitemap = projectsData
        .filter(p => !!p.slug)
        .map(p => ({
            url: `${SITE_URL}/projects/${p.slug}`,
            lastModified: p.date ? new Date(p.date) : undefined,
            changeFrequency: 'yearly',
            priority: 0.6
        }))

    return [...staticRoutes, ...projectRoutes]
}
