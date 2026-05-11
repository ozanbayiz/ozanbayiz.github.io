import type { FavoriteItem } from '../../data/favorites'

export type Variant = 'movie' | 'music'

export type ActiveItem = {
    item: FavoriteItem
    variant: Variant
} | null

export type SelectHandler = (item: FavoriteItem, variant: Variant) => void
