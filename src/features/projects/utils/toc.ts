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

export function walkToc<T>(
    nodes: TocItem[],
    visitor: (node: TocItem, parent: TocItem | null, depth: number) => T | void,
    parent: TocItem | null = null,
    depth = 0,
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

export function getAllIds(toc: TocItem[]): string[] {
    return walkToc(toc, node => node.id).filter(Boolean)
}

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
