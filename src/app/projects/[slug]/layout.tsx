import ProjectArticleShell from '@/features/projects/components/ProjectArticleShell'

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    return <ProjectArticleShell>{children}</ProjectArticleShell>
}
