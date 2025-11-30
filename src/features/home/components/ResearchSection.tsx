import { ExternalLinkIcon, FileTextIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Section } from '@/shared/ui/section'

import { researchData } from '../data/research'

export default function ResearchSection() {
    // Sort by date descending
    const items = [...researchData].sort(
        (a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)
    )

    return (
        <Section className="space-y-8">
            <div className="space-y-2 text-center sm:text-left">
                <h1 className="h1">Research</h1>
                <p className="body-text max-w-prose">
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                {items.map((item) => (
                    <Card
                        key={item.slug}
                        className="overflow-hidden bg-card transition-colors hover:bg-accent/5"
                    >
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-6 md:flex-row md:items-start">
                                {/* Thumbnail (Optional) */}
                                {item.imageUrl && (
                                    <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-md border md:h-32 md:w-48">
                                        <Image
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
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {item.venue}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(item.date).toLocaleDateString(
                                                'en-US',
                                                {
                                                    month: 'long',
                                                    year: 'numeric'
                                                }
                                            )}
                                        </p>
                                    </div>

                                    <p className="leading-relaxed text-sm text-muted-foreground">
                                        {item.description}
                                    </p>

                                    {item.authors && (
                                        <p className="text-xs italic text-muted-foreground">
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
                        </CardContent>
                    </Card>
                ))}
            </div>
        </Section>
    )
}
