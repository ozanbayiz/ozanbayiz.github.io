export type ResearchItem = {
    slug: string
    title: string
    description: string
    imageUrl?: string
    date: string
    pdfUrl?: string
    projectUrl?: string
    venue?: string
    authors?: string[]
}

export const researchData: ResearchItem[] = [
    {
        slug: 'placeholder-paper',
        title: 'Coming soon: Research overview',
        description: "Coming soon :') like so soon. The soonest.",
        imageUrl: '/nyan_cat.gif',
        date: '2025-01-01',
        venue: 'In Progress',
        // pdfUrl: '/path/to/paper.pdf'
    }
]

