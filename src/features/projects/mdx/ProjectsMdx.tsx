'use client'

import * as React from 'react'

import { projectsMdxLoaders } from '@/content/projects/registry.generated'
import MdxClient from '@/shared/mdx/mdx-client'

import { ProjectTocContext } from '../components/ProjectArticleShell'

export default function ProjectsMdx({ slug }: { slug: string }) {
    const { setHeadings } = React.useContext(ProjectTocContext)
    return <MdxClient loaders={projectsMdxLoaders} slug={slug} onToc={setHeadings} />
}
