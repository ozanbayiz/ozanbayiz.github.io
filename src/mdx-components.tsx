import Figure from '@/components/mdx/Figure'
import ImageGrid from '@/components/mdx/ImageGrid'
import ImageTile from '@/components/mdx/ImageTile'
import MdxImg from '@/components/mdx/MdxImg'
import SectionDivider from '@/components/SectionDivider'
// SpikyCallout removed

import type { ComponentType } from 'react'

type MdxComponents = Record<string, ComponentType<unknown>>

export function useMDXComponents(components: MdxComponents): MdxComponents {
  return {
    // Expose components for use in MDX without explicit import
    ImageGrid: ImageGrid as ComponentType<unknown>,
    ImageTile: ImageTile as ComponentType<unknown>,
    img: MdxImg as unknown as ComponentType<unknown>,
    Figure: Figure as ComponentType<unknown>,
    SectionDivider: SectionDivider as unknown as ComponentType<unknown>,
    ...components
  }
}


