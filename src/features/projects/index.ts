// Public API — only re-export what external consumers actually need.
// Internal components, hooks, and utils are imported directly by their consumers.
export { projectsData } from '@/features/projects/data/projects.generated'
export type { Project } from '@/features/projects/data/types'
