import createMDX from '@next/mdx'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
// Import JS version to avoid TS transpile issues in Next config
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import remarkCollectHeadings from './src/shared/mdx/plugins/remark-collect-headings.js'
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
