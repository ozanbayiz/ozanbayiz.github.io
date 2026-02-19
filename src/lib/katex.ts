'use client'

import renderMathInElement from 'katex/contrib/auto-render'

/**
 * Render KaTeX math in the given element (captions, lightbox).
 * Shared by Figure captions and the Lightbox modal.
 */
export function renderKatex(el: HTMLElement): void {
    try {
        renderMathInElement(el, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\[', right: '\\]', display: true },
                { left: '\\(', right: '\\)', display: false }
            ],
            throwOnError: false
        })
    } catch {}
}
