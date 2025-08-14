import { notFound } from 'next/navigation'

import { default as ProjectHeader } from '@/components/content/ProjectHeader'
import ProjectsMdx from '@/components/mdx/ProjectsMdx'
import { Separator } from '@/components/ui/separator'
import { projectsData } from '@/data/projects'

type Params = { slug: string }

export function generateStaticParams() {
  return projectsData
    .filter(p => !!p.slug)
    .map(p => ({ slug: p.slug! }))
}

export default async function UnifiedProjectPage({
  params
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const project = projectsData.find(p => p.slug === slug)
  if (!project) return notFound()

  const heroSrc = project.heroImageSrc ?? project.imageUrl

  return (
    <section className='space-y-6'>
      <ProjectHeader
        title={project.title}
        repoUrl={project.gitUrl}
        date={project.date}
        authors={project.authors}
        pdfUrl={project.pdfUrl}
      />
      <Separator />

      {/* Hero image (intrinsic) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroSrc}
        alt={project.title}
        className='mx-auto block h-auto max-h-[clamp(220px,40vh,520px)] w-auto max-w-full'
      />
      <Separator />

      <ProjectsMdx slug={slug} />
    </section>
  )
}


