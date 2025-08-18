declare module 'katex/contrib/auto-render' {
  const renderMathInElement: (
    el: HTMLElement,
    options?: {
      delimiters?: Array<{ left: string; right: string; display: boolean }>
      throwOnError?: boolean
    }
  ) => void
  export default renderMathInElement
}

declare module '*.mdx' {
    import type { ComponentType } from 'react'
    const MDXComponent: ComponentType<Record<string, unknown>>
    export default MDXComponent
}
