// Shared types for Table of Contents
export type TocItem = {
    id: string
    title: string
    children: TocItem[]
}

export type Heading = {
    id: string
    title: string
    level: number
}

/**
 * Generic tree walker - replaces all duplicate walk functions
 * Traverses the TOC tree and collects results from the visitor function
 */
export function walkToc<T>(
    nodes: TocItem[],
    visitor: (node: TocItem, parent: TocItem | null, depth: number) => T | void,
    parent: TocItem | null = null,
    depth = 0
): T[] {
    const results: T[] = []
    for (const node of nodes) {
        const result = visitor(node, parent, depth)
        if (result !== undefined) results.push(result)
        if (node.children?.length) {
            results.push(...walkToc(node.children, visitor, node, depth + 1))
        }
    }
    return results
}

/**
 * Get all IDs from the TOC tree (flattened)
 */
export function getAllIds(toc: TocItem[]): string[] {
    return walkToc(toc, (node) => node.id).filter(Boolean)
}

/**
 * Build a map from each ID to its parent ID (or null for root items)
 */
export function buildIdToParentMap(toc: TocItem[]): Record<string, string | null> {
    const map: Record<string, string | null> = {}
    walkToc(toc, (node, parent) => {
        if (node.id) map[node.id] = parent?.id ?? null
    })
    return map
}

/**
 * Get the chain of ancestor IDs for a given ID (excluding the ID itself)
 */
export function getAncestorChain(id: string, idToParent: Record<string, string | null>): string[] {
    const chain: string[] = []
    let current = idToParent[id]
    while (current) {
        chain.unshift(current)
        current = idToParent[current]
    }
    return chain
}

/**
 * Check if an item or any of its descendants has the given active ID
 */
export function hasActiveDescendant(item: TocItem, activeId: string | null): boolean {
    if (!activeId) return false
    if (item.id === activeId) return true
    return item.children?.some(child => hasActiveDescendant(child, activeId)) ?? false
}

/**
 * Convert flat headings array to nested TOC tree structure
 * Only includes h2 and h3 headings, with h3s nested under h2s
 */
export function headingsToToc(headings: Heading[]): TocItem[] {
    const root: TocItem[] = []
    const stack: { level: number; node: TocItem }[] = []

    headings
        .filter(h => h.level === 2 || h.level === 3)
        .forEach(h => {
            const node: TocItem = { id: h.id, title: h.title, children: [] }
            while (stack.length > 0 && (stack[stack.length - 1]?.level ?? 0) >= h.level) {
                stack.pop()
            }
            const parent = stack[stack.length - 1]
            if (!parent) {
                root.push(node)
            } else {
                parent.node.children.push(node)
            }
            stack.push({ level: h.level, node })
        })

    return root
}

