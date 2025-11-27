import Image from 'next/image'

// Placeholder research registry, mirroring projects registry shape
export type ResearchItem = {
    slug?: string
    title: string
    description?: string
    imageUrl?: string
    date?: string
    pdfUrl?: string
}

export const researchData: ResearchItem[] = [
    {
        slug: 'placeholder-paper',
        title: 'Coming soon: Research overview',
        description: "Coming soon :') like so soon. The soonest",
        imageUrl: '/nyan_cat.gif',
        date: '2025-01-01'
    }
]

export default function ResearchSection() {
    const items = [...researchData].sort(
        (a, b) => (Date.parse(b.date ?? '') || 0) - (Date.parse(a.date ?? '') || 0)
    )
    const first = items[0]
    return (
        <section>
            <div className='mx-0 my-4 grid grid-cols-1 justify-stretch gap-8 sm:mx-4 md:grid-cols-2 md:gap-16'>
                <div className='text-center sm:text-left'>
                    <h1 className='mb-4 text-center h2 sm:text-left'>
                        Research
                    </h1>
                    <p className='mb-4 body-text'>{first?.description}</p>
                    <div className='flex items-center'>
                        <Image
                            src={first?.imageUrl ?? '/nyan_cat.gif'}
                            alt='Research placeholder'
                            width={120}
                            height={120}
                            className='rounded-full'
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}


