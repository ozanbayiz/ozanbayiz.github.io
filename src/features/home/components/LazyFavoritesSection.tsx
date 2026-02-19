'use client'

import dynamic from 'next/dynamic'

const FavoritesSection = dynamic(
    () => import('@/features/home/components/FavoritesSection'),
    { ssr: false }
)

export default function LazyFavoritesSection() {
    return <FavoritesSection />
}
