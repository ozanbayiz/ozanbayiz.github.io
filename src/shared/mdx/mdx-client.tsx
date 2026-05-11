'use client'

import React from 'react'

import MdxLoadError from './MdxLoadError'

import type { Heading } from '@/types/content'
import type { ComponentType } from 'react'

export type MdxModule = {
  default: ComponentType<Record<string, unknown>>
  headings?: Heading[]
}

type BaseProps = {
  loaders: Record<string, () => Promise<MdxModule>>
  slug: string
  onToc?: ((headings: Heading[]) => void) | undefined
}

type NamespacedProps = BaseProps & { collection?: string }

export default function MdxClient({ loaders, slug, collection, onToc }: NamespacedProps) {
  const [Comp, setComp] = React.useState<ComponentType<Record<string, unknown>> | null>(null)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    const key = collection ? `${collection}/${slug}` : slug
    const load = loaders[key] ?? loaders[slug]
    if (!load) {
      setError(true)
      return
    }
    let mounted = true
    setError(false)
    load()
      .then((mod: MdxModule) => {
        if (!mounted) return
        setComp(() => mod.default)
        onToc?.(mod.headings ?? [])
      })
      .catch(() => {
        if (mounted) setError(true)
      })
    return () => {
      mounted = false
    }
  }, [loaders, slug, collection, onToc])

  if (error) return <MdxLoadError slug={slug} />
  if (!Comp) return null
  return <Comp />
}

export type { Heading } from '@/types/content'
