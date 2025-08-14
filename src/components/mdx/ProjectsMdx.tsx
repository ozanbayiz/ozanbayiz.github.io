'use client'

import MdxClient from '@/components/mdx/MdxClient'
import { projectsMdxLoaders } from '@/content/projects'

export default function ProjectsMdx({ slug }: { slug: string }) {
  return <MdxClient loaders={projectsMdxLoaders} slug={slug} />
}


