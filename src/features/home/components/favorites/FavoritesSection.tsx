'use client'

import { useRef, useState } from 'react'

import SectionHeading from '@/components/common/SectionHeading'
import { useScrollParallax } from '@/hooks/useScrollParallax'

import { favoritesData } from '../../data/favorites'

import InspectionPanel from './InspectionPanel'
import InventoryPanel from './InventoryPanel'

import type { ActiveItem, SelectHandler } from './types'

export default function FavoritesSection() {
    const [activeItem, setActiveItem] = useState<ActiveItem>(null)
    const inventoryRef = useRef<HTMLDivElement>(null)
    const inspectionRef = useRef<HTMLDivElement>(null)
    useScrollParallax(inventoryRef, -0.03)
    useScrollParallax(inspectionRef, 0.05)

    const moviesCategory = favoritesData.find(c => c.title === 'Movies')
    const musicCategory = favoritesData.find(c => c.title === 'Music')

    const handleSelect: SelectHandler = (item, variant) => {
        setActiveItem(prev => (prev?.item === item ? null : { item, variant }))
    }

    const handleHover: SelectHandler = (item, variant) => {
        setActiveItem({ item, variant })
    }

    return (
        <div className="w-full flex flex-col space-y-6">
            <SectionHeading>favorites</SectionHeading>
            <div className="flex flex-col md:flex-row md:gap-8">
                <div
                    ref={inventoryRef}
                    className="md:w-[55%] flex flex-col gap-6"
                    style={{ willChange: 'transform' }}
                >
                    {moviesCategory && (
                        <InventoryPanel
                            label="MOVIES"
                            items={moviesCategory.items}
                            variant="movie"
                            cols="grid-cols-3"
                            activeItem={activeItem}
                            onSelect={handleSelect}
                            onHover={handleHover}
                        />
                    )}
                    {musicCategory && (
                        <InventoryPanel
                            label="MUSIC"
                            items={musicCategory.items}
                            variant="music"
                            cols="grid-cols-4 md:grid-cols-5"
                            activeItem={activeItem}
                            onSelect={handleSelect}
                            onHover={handleHover}
                        />
                    )}
                </div>

                <div
                    ref={inspectionRef}
                    className="order-first md:order-none mb-4 md:mb-0 md:w-[45%]"
                    style={{ willChange: 'transform' }}
                >
                    <InspectionPanel activeItem={activeItem} />
                </div>
            </div>
        </div>
    )
}
