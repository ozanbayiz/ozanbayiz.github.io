import SectionDivider from '@/components/common/SectionDivider'
import ImageGrid from '@/components/mdx/ImageGrid'
import Figure from '@/features/lightbox/components/Figure'
import ImageTile from '@/features/lightbox/components/ImageTile'
import MdxImg from '@/features/lightbox/components/MdxImg'

import type { ComponentType } from 'react'

type MdxComponents = Record<string, ComponentType<unknown>>

export function useMDXComponents(components: MdxComponents): MdxComponents {
  return {
    ImageGrid: ImageGrid as ComponentType<unknown>,
    ImageTile: ImageTile as ComponentType<unknown>,
    img: MdxImg as unknown as ComponentType<unknown>,
    Figure: Figure as ComponentType<unknown>,
    SectionDivider: SectionDivider as unknown as ComponentType<unknown>,
    ...components
  }
}


