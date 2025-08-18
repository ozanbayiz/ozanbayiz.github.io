import createMDX from '@next/mdx'
import path from 'node:path'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
// Import JS version to avoid TS transpile issues in Next config
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { visit } from 'unist-util-visit'

// Inline remark plugin to collect H2/H3 headings from MDX
const remarkCollectHeadings = () => {
  return (tree: any, file: { data?: Record<string, unknown> }) => {
    const headings: { id: string; title: string; level: number }[] = []
    visit(tree, 'heading', (node: { depth: number; children?: { type: string; value?: string }[]; data?: any }) => {
      const level = node.depth
      if (level !== 2 && level !== 3) return
      const text = (node.children || [])
        .filter((c: { type: string }) => c.type === 'text' || c.type === 'inlineCode')
        .map((c: { value?: string }) => c.value || '')
        .join(' ')
        .trim()
      if (!text) return
      const data = node.data as { hProperties?: { id?: string } } | undefined
      const id = (data && data.hProperties && data.hProperties.id) ||
        text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
      headings.push({ id, title: text, level })
    })
    if (!file.data) file.data = {}
    file.data.headings = headings
    ;(tree as unknown as { children: any[] }).children.push({
      type: 'mdxjsEsm',
      value: `export const headings = ${JSON.stringify(headings)}`
    })
  }
}
import remarkMath from 'remark-math'

import type { NextConfig } from 'next'

const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [remarkGfm, remarkMath, remarkCollectHeadings],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'append' }], rehypeKatex]
    }
})

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true
    },
    output: 'export',
    trailingSlash: true,
    webpack: (config) => {
        config.resolve = config.resolve || {}
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            '@': path.resolve(__dirname, 'src')
        }
        return config
    },
    async redirects() {
        return [
            // CS180 → unified projects slugs
            {
                source: '/cs180/:slug/',
                destination: '/projects/cs180-:slug/',
                permanent: true
            },
            {
                source: '/cs180/:slug',
                destination: '/projects/cs180-:slug/',
                permanent: true
            },
            {
                source: '/cs180',
                destination: '/projects',
                permanent: true
            },
            {
                source: '/cs180/',
                destination: '/projects',
                permanent: true
            },
            // Old collection route → unified slug route
            {
                source: '/projects/:collection/:slug/',
                destination: '/projects/:slug/',
                permanent: true
            }
        ]
    }
}

export default withMDX(nextConfig)
