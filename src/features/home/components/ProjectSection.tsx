import Link from 'next/link'

import { projectsData } from '@/features/projects'

export default function ProjectSection() {
    const featured = [...projectsData]
        .filter(p => p.featured)
        .sort(
            (a, b) =>
                (Date.parse(b.date ?? '') || 0) -
                (Date.parse(a.date ?? '') || 0)
        )

    return (
        <div className="w-full">
            <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest">
                    Projects
                </h2>
                <Link
                    href="/projects/"
                    prefetch={false}
                    className="gradient-link text-xs"
                >
                    all &rarr;
                </Link>
            </div>

            <div className="border-t">
                {featured.map((project) => (
                    <Link
                        key={project.slug}
                        href={`/projects/${project.slug}/`}
                        prefetch={false}
                        className="group flex items-baseline justify-between gap-4 border-b py-3"
                    >
                        <span className="gradient-link-group text-sm">
                            {project.title}
                        </span>
                        <span className="shrink-0 text-xs text-foreground">
                            {project.date
                                ? new Date(
                                      project.date
                                  ).toLocaleDateString('en-US', {
                                      month: 'short',
                                      year: 'numeric'
                                  })
                                : ''}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
