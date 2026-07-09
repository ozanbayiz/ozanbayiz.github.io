import bundleAnalyzer from '@next/bundle-analyzer'

import type { NextConfig } from 'next'

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true'
})

/* Research report MDX (src/content/research/*.mdx) is NOT bundled —
 * it's read from disk and compiled server-side at build/request time by
 * src/app/research/[slug]/page.tsx via @mdx-js/mdx `evaluate`. (The
 * @next/mdx webpack loader mis-resolves the react-server JSX runtime in
 * dev on next ≤16.2.10 — evaluate sidesteps the bundler entirely.) */

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        loader: 'custom',
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
    },
    transpilePackages: ['next-image-export-optimizer'],
    env: {
        nextImageExportOptimizer_imageFolderPath: 'public',
        nextImageExportOptimizer_exportFolderPath: 'out',
        nextImageExportOptimizer_quality: '90',
        nextImageExportOptimizer_storePicturesInWEBP: 'true',
        nextImageExportOptimizer_exportFolderName: 'nextImageExportOptimizer',
        nextImageExportOptimizer_generateAndUseBlurImages: 'true',
        nextImageExportOptimizer_remoteImageCacheTTL: '0'
    },
    output: 'export',
    trailingSlash: true
}

export default withBundleAnalyzer(nextConfig)
