// Components
export { default as ProjectHeader } from './components/ProjectHeader'
export { default as ProjectCard } from './components/ProjectCard'
export { default as ProjectSidebarShell } from './components/ProjectSidebarShell'
export { TocNode } from './components/TocNode'
export { ReadingProgressBar } from './components/ReadingProgressBar'

// Hooks
export { useTableOfContents } from './hooks/useTableOfContents'
export { useActiveSection } from './hooks/useActiveSection'

// Data
export { projectsData, type Project } from '@/features/projects/data/projects'
export { default as ProjectsMdx } from './mdx/ProjectsMdx'

// Utils & Types
export type { TocItem, Heading } from './utils/toc'
export {
    walkToc,
    getAllIds,
    buildIdToParentMap,
    getAncestorChain,
    hasActiveDescendant,
    headingsToToc
} from './utils/toc'
