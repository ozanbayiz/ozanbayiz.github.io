import { projectsData } from '@/features/projects'
import ProjectSidebarShell from '@/features/projects/components/ProjectSidebarShell'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/ui/breadcrumb'

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
        <BreadcrumbItem className="hidden sm:inline-flex">
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden sm:block" />
        <BreadcrumbItem>
          <BreadcrumbLink href='/projects/'>Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">{project?.shortTitle ?? project?.title ?? slug}</BreadcrumbPage>
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


