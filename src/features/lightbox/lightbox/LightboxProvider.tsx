'use client'

import React from 'react'

import LightboxModal from './LightboxModal'

export type LightboxItem = {
  id: string
  src: string
  alt?: string
  caption?: React.ReactNode
}

type RegisterArgs = {
  src: string
  alt?: string
  caption?: React.ReactNode
}

type LightboxContextValue = {
  // Registration
  registerItem: (args: RegisterArgs) => string
  unregisterItem: (id: string) => void

  // Controls
  openAt: (index: number) => void
  openById: (id: string) => void
  openOrRegister: (args: RegisterArgs) => void
  next: () => void
  prev: () => void
  close: () => void

  // State
  isOpen: boolean
  currentIndex: number
  items: LightboxItem[]
}

const LightboxContext = React.createContext<LightboxContextValue | null>(null)

export function useLightbox(): LightboxContextValue {
  const ctx = React.useContext(LightboxContext)
  if (!ctx) throw new Error('useLightbox must be used within a LightboxProvider')
  return ctx
}

export function useLightboxOptional(): LightboxContextValue | null {
  return React.useContext(LightboxContext)
}

function generateId(src: string): string {
  return `${src}::${Math.random().toString(36).slice(2)}`
}

export default function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<LightboxItem[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const registerItem = React.useCallback((args: RegisterArgs) => {
    const id = generateId(args.src)
    setItems(prev => [
      ...prev,
      {
        id,
        src: args.src,
        ...(args.alt !== undefined ? { alt: args.alt } : {}),
        ...(args.caption !== undefined ? { caption: args.caption } : {})
      }
    ])
    return id
  }, [])

  const unregisterItem = React.useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const openAt = React.useCallback((index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }, [])

  const openById = React.useCallback((id: string) => {
    setCurrentIndex(prev => {
      const idx = items.findIndex(it => it.id === id)
      return idx >= 0 ? idx : prev
    })
    setIsOpen(true)
  }, [items])

  // Ensure the clicked image always opens, registering on the fly if needed
  const openOrRegister = React.useCallback((args: RegisterArgs) => {
    setItems(prev => {
      const existingIdx = prev.findIndex(it => it.src === args.src)
      if (existingIdx >= 0) {
        setCurrentIndex(existingIdx)
        setIsOpen(true)
        return prev
      }
      const id = generateId(args.src)
      const next: LightboxItem[] = [
        ...prev,
        {
          id,
          src: args.src,
          ...(args.alt !== undefined ? { alt: args.alt } : {}),
          ...(args.caption !== undefined ? { caption: args.caption } : {})
        }
      ]
      setCurrentIndex(next.length - 1)
      setIsOpen(true)
      return next
    })
  }, [])

  const close = React.useCallback(() => setIsOpen(false), [])

  const next = React.useCallback(() => {
    setCurrentIndex(idx => (items.length === 0 ? 0 : (idx + 1) % items.length))
  }, [items.length])

  const prev = React.useCallback(() => {
    setCurrentIndex(idx => (items.length === 0 ? 0 : (idx - 1 + items.length) % items.length))
  }, [items.length])

  // Lock body scroll when open
  React.useEffect(() => {
    if (!isOpen) return
    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevHtmlOverscroll = window.getComputedStyle(html).getPropertyValue('overscroll-behavior')
    const prevBodyOverscroll = window.getComputedStyle(body).getPropertyValue('overscroll-behavior')
    const prevBodyPosition = body.style.position
    const prevBodyWidth = body.style.width
    const prevScrollY = window.scrollY

    // Robust scroll lock across browsers/iOS
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    html.style.setProperty('overscroll-behavior', 'none')
    body.style.setProperty('overscroll-behavior', 'none')
    // Prevent iOS rubber-band and maintain layout
    body.style.position = 'fixed'
    body.style.width = '100%'
    body.style.top = `-${prevScrollY}px`

    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      html.style.setProperty('overscroll-behavior', prevHtmlOverscroll || 'auto')
      body.style.setProperty('overscroll-behavior', prevBodyOverscroll || 'auto')
      body.style.position = prevBodyPosition
      body.style.width = prevBodyWidth
      const y = Math.abs(parseInt(body.style.top || '0', 10)) || prevScrollY
      body.style.top = ''
      window.scrollTo(0, y)
    }
  }, [isOpen])

  const value = React.useMemo<LightboxContextValue>(() => ({
    registerItem,
    unregisterItem,
    openAt,
    openById,
    openOrRegister,
    next,
    prev,
    close,
    isOpen,
    currentIndex,
    items
  }), [registerItem, unregisterItem, openAt, openById, openOrRegister, next, prev, close, isOpen, currentIndex, items])

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <LightboxModal isOpen={isOpen} items={items} currentIndex={currentIndex} onClose={close} onPrev={prev} onNext={next} />
    </LightboxContext.Provider>
  )
}


