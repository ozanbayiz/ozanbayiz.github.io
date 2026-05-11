'use client'

import * as React from 'react'

import {
    type Heading,
    type TocItem,
    getAllIds,
    headingsToToc,
} from '../utils/toc'

type TocState = {
    toc: TocItem[]
    allIds: string[]
}

export function useTableOfContents(headings: Heading[]): TocState {
    const toc = React.useMemo<TocItem[]>(() => headingsToToc(headings), [headings])
    const allIds = React.useMemo(() => getAllIds(toc), [toc])
    return { toc, allIds }
}
