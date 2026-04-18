import Link from 'next/link'

import { researchData } from '../data/research'

export default function ResearchSection() {
    const items = [...researchData].sort(
        (a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)
    )

    return (
        <div className="w-full">
            <h2 className="mb-6">
                Research
            </h2>

            <div className="space-y-8">
                {items.map((item) => (
                    <div key={item.slug}>

                            <p>
                                {new Date(item.date).toLocaleDateString(
                                    'en-US',
                                    {
                                        month: 'long',
                                        year: 'numeric'
                                    }
                                )}
                            </p>

                            <h3 className="mt-1 leading-tight">
                                {item.title}
                            </h3>

                            {item.venue && (
                                <span className="mt-1 inline-block">
                                    {item.venue}
                                </span>
                            )}

                            {item.description && (
                                <p className="mt-1 leading-relaxed">
                                    {item.description}
                                </p>
                            )}

                            {item.authors && (
                                <p className="mt-1 italic">
                                    with {item.authors.join(', ')}
                                </p>
                            )}

                            {(item.pdfUrl || item.projectUrl) && (
                                <div className="mt-2 flex gap-3">
                                    {item.pdfUrl && (
                                        <Link
                                            href={item.pdfUrl}
                                            target="_blank"
                                            className="link-hover"
                                        >
                                            pdf &#8599;
                                        </Link>
                                    )}
                                    {item.projectUrl && (
                                        <Link
                                            href={item.projectUrl}
                                            target="_blank"
                                            className="link-hover"
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
