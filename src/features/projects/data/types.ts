export type Collection = 'cs180' | 'cs184' | 'cs185' | 'cs280' | 'personal' | 'misc-academic'

export type Project = {
    collection: Collection
    slug: string
    title: string
    shortTitle?: string
    description: string
    imageUrl: string
    heroImageSrc?: string
    heroAlt?: string
    gitUrl: string
    authors?: string[]
    date?: string
    pdfUrl?: string
    demoUrl?: string
    featured?: boolean
    hideHero?: boolean
}

export const COURSE_COLLECTIONS = new Set<string>(['cs180', 'cs184', 'cs185', 'cs280'])

export function deriveSlug(collection: string, filename: string): string {
    if (COURSE_COLLECTIONS.has(collection)) return `${collection}-${filename}`
    return filename
}
