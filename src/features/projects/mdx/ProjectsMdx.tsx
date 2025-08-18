'use client'

import { projectsMdxLoaders } from '@/content/projects'
import MdxClient from '@/shared/mdx/mdx-client'

export default function ProjectsMdx({ slug }: { slug: string }) {
  return <MdxClient loaders={projectsMdxLoaders} slug={slug} />
}


