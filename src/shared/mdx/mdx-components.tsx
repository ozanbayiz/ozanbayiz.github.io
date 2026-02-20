import Figure from '@/features/lightbox/components/Figure'
import ImageGrid from '@/features/lightbox/components/ImageGrid'
import ImageTile from '@/features/lightbox/components/ImageTile'
import MdxImg from '@/features/lightbox/components/MdxImg'
import ExternalLink from '@/shared/ui/external-link'

import type { ComponentType } from 'react'

type MdxComponents = Record<string, ComponentType<unknown>>

export function useMDXComponents(components: MdxComponents): MdxComponents {
    return {
        ImageGrid: ImageGrid as ComponentType<unknown>,
        ImageTile: ImageTile as ComponentType<unknown>,
        img: MdxImg as unknown as ComponentType<unknown>,
        Figure: Figure as ComponentType<unknown>,
        SectionDivider: () => <hr className="w-full my-8 border-foreground" />,
        ExternalLink: ExternalLink as ComponentType<unknown>,
        ...components
    }
}
