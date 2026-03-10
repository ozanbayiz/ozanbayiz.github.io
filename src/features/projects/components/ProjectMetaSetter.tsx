'use client'

import * as React from 'react'

import { ProjectArticleContext, type ProjectNav } from './ProjectArticleShell'

export default function ProjectMetaSetter({
    title,
    prev,
    next
}: {
    title: string
    prev: ProjectNav
    next: ProjectNav
}) {
    const { setMeta } = React.useContext(ProjectArticleContext)

    React.useEffect(() => {
        setMeta({ title, prev, next })
    }, [title, prev, next, setMeta])

    return null
}
