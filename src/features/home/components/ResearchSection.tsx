import { ExternalLinkIcon, FileTextIcon } from 'lucide-react'
import Link from 'next/link'
import ExportedImage from 'next-image-export-optimizer'

import { Button } from '@/shared/ui/button'

import { researchData } from '../data/research'

export default function ResearchSection() {
    // Sort by date descending
    const items = [...researchData].sort(
        (a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)
    )

    return (
        <section className="w-full flex flex-col py-6 md:py-8 space-y-8">
            <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl tracking-tight">Research</h1>
                <p className="text-sm leading-relaxed max-w-prose">
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                {items.map((item) => (
                    <div
                        key={item.slug}
                        className="overflow-hidden bg-background rounded-lg border text-foreground transition-colors hover:border-accent1 hover:bg-transparent p-6"
                    >
                        <div className="flex flex-col gap-6 md:flex-row md:items-start">
                            {/* Thumbnail (Optional) */}
                            {item.imageUrl && (
                                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-md border md:h-32 md:w-48">
                                    <ExportedImage
                                        src={item.imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 192px"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex flex-1 flex-col gap-3">
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-bold leading-tight">
                                            {item.title}
                                        </h3>
                                        {item.venue && (
                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-background text-foreground hover:bg-background">
                                                {item.venue}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground">
                                        {new Date(item.date).toLocaleDateString(
                                            'en-US',
                                            {
                                                month: 'long',
                                                year: 'numeric'
                                            }
                                        )}
                                    </p>
                                </div>

                                <p className="leading-relaxed text-sm text-foreground">
                                    {item.description}
                                </p>

                                {item.authors && (
                                    <p className="text-xs italic text-foreground">
                                        with {item.authors.join(', ')}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {item.pdfUrl && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href={item.pdfUrl} target="_blank">
                                                <FileTextIcon className="mr-2 h-4 w-4" />
                                                PDF
                                            </Link>
                                        </Button>
                                    )}
                                    {item.projectUrl && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={item.projectUrl}
                                                target="_blank"
                                            >
                                                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                                                Project Page
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
