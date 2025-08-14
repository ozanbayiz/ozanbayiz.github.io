import Link from 'next/link'

import ProjectSidebarShell from '@/components/cs/ProjectSidebarShell'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { projectsData } from '@/data/projects'

type Params = { slug: string }

export default async function ProjectLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<Params>
}) {
  const { slug } = await params
  const project = projectsData.find(p => p.slug === slug)

  const header = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/'>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/projects/'>Projects</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{project?.shortTitle ?? project?.title ?? slug}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )

  return (
    <ProjectSidebarShell sections={[]} header={header} sidebarTop={null}>
      <div className="mx-auto w-full max-w-screen-lg" style={{ ['--inset-x' as unknown as string]: '1rem' }}>
        {children}
      </div>
    </ProjectSidebarShell>
  )
}


