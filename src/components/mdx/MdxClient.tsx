'use client'

import React from 'react'

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

/**
 * Canonical MDX client that renders an MDX module resolved from a loader map.
 * Emits `mdx:headings` when a `headings` export is present and dispatches
 * `mdx:content:loaded` immediately and on the next RAF to mirror existing behavior.
 */
export default function MdxClient({ loaders, slug, collection, onToc }: NamespacedProps) {
  const [Comp, setComp] = React.useState<ComponentType<Record<string, unknown>> | null>(null)

  React.useEffect(() => {
    const key = collection ? `${collection}/${slug}` : slug
    const load = loaders[key] ?? loaders[slug]
    if (!load) return
    let mounted = true
    load()
      .then((mod: MdxModule) => {
        if (!mounted) return
        setComp(() => mod.default)
        if (mod.headings) {
          onToc?.(mod.headings)
          try {
            window.dispatchEvent(new CustomEvent('mdx:headings', { detail: mod.headings }))
          } catch {}
        }
        try {
          window.dispatchEvent(new CustomEvent('mdx:content:loaded', { detail: { slug } }))
          if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
            requestAnimationFrame(() => {
              try {
                window.dispatchEvent(
                  new CustomEvent('mdx:content:loaded', { detail: { slug, raf: true } })
                )
              } catch {}
            })
          }
        } catch {}
      })
      .catch(() => {
        // Swallow dynamic import errors in client to avoid crashing the page
      })
    return () => {
      mounted = false
    }
  }, [loaders, slug, collection, onToc])

  if (!Comp) return null
  return <Comp />
}

export type { Heading } from '@/types/content'


