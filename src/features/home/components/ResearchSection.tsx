import Link from 'next/link'

import SectionHeading from '@/components/common/SectionHeading'
import { byDateDesc, formatProjectDate } from '@/features/projects/utils/dates'

import { researchData } from '../data/research'

export default function ResearchSection() {
    const items = [...researchData].sort(byDateDesc)

    return (
        <div className="w-full">
            <SectionHeading className="mb-6">Research</SectionHeading>

            <div className="space-y-8">
                {items.map((item) => (
                    <div key={item.slug}>
                        <p className="text-xs text-foreground">
                            {formatProjectDate(item.date, { month: 'long', year: 'numeric' })}
                        </p>

                        <h3 className="mt-1 text-sm font-bold leading-tight">
                            {item.title}
                        </h3>

                        {item.venue && (
                            <span className="mt-1 inline-block text-xs text-foreground">
                                {item.venue}
                            </span>
                        )}

                        {item.description && (
                            <p className="mt-1 text-xs leading-relaxed text-foreground">
                                {item.description}
                            </p>
                        )}

                        {item.authors && (
                            <p className="mt-1 text-xs italic text-foreground">
                                with {item.authors.join(', ')}
                            </p>
                        )}

                        {(item.pdfUrl || item.projectUrl) && (
                            <div className="mt-2 flex gap-3">
                                {item.pdfUrl && (
                                    <Link
                                        href={item.pdfUrl}
                                        target="_blank"
                                        className="gradient-link text-xs"
                                    >
                                        pdf &#8599;
                                    </Link>
                                )}
                                {item.projectUrl && (
                                    <Link
                                        href={item.projectUrl}
                                        target="_blank"
                                        className="gradient-link text-xs"
                                    >
                                        project &#8599;
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
