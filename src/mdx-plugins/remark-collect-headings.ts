import { visit } from 'unist-util-visit'

import type { Root } from 'mdast'
import type { Plugin } from 'unified'

export type CollectedHeading = { id: string; title: string; level: number }

const remarkCollectHeadings: Plugin<[Record<string, unknown>?], Root> = () => {
  return (tree: Root, file: { data?: Record<string, unknown> }) => {
    const headings: CollectedHeading[] = []
    visit(tree, 'heading', (node: { depth: number; children?: { type: string; value?: string }[]; data?: unknown }) => {
      const level: number = node.depth
      // Only collect H2 and H3 to limit depth in the sidebar.
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

    // Inject a named export so the compiled MDX module exposes `headings`.
    // Consumers can `import { headings } from './page.mdx'` or access via dynamic import.
    type MdxjsEsmNode = { type: 'mdxjsEsm'; value: string; data?: unknown }
    const exportNode: MdxjsEsmNode = {
      type: 'mdxjsEsm',
      value: `export const headings = ${JSON.stringify(headings)}`
    }

    // Append the export to the MDX tree.
    ;(tree as unknown as { children: unknown[] }).children.push(exportNode)
  }
}

export default remarkCollectHeadings


