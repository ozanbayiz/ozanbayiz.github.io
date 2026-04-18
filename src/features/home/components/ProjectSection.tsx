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
                <h2>
                    Projects
                </h2>
                <Link
                    href="/projects/"
                    prefetch={false}
                    className="link-nav"
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
                        <span className="link-group-hover">
                            {project.title}
                        </span>
                        <span className="shrink-0">
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
