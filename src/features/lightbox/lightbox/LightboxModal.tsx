'use client'

import renderMathInElement from 'katex/contrib/auto-render'
import React from 'react'
import { createPortal } from 'react-dom'

type LightboxViewItem = {
  id: string
  src: string
  alt?: string
  caption?: React.ReactNode
}

type Props = {
  isOpen: boolean
  items: LightboxViewItem[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function LightboxModal({ isOpen, items, currentIndex, onClose, onPrev, onNext }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, onPrev, onNext])

  // Render LaTeX in captions and any math text within the modal
  React.useEffect(() => {
    if (!isOpen) return
    const el = containerRef.current
    if (!el) return
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
  }, [isOpen, currentIndex, items])

  const item = items[currentIndex]
  if (!isOpen || !item) return null

  const content = (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] flex h-[100svh] w-[100svw] flex-col overflow-hidden bg-black/80 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt || 'Image viewer'}
      onClick={(e) => {
        if (e.target === containerRef.current) onClose()
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-3 text-white/90">
        <div className="text-sm">
          {items.length > 1 ? `${currentIndex + 1} / ${items.length}` : ''}
        </div>
        <div className="flex gap-2">
          {items.length > 1 ? (
            <button
              aria-label="Previous"
              className="rounded px-3 py-1 text-white transition-colors bg-transparent hover:text-accent hover:bg-transparent focus:bg-transparent"
              onClick={onPrev}
            >
              ←
            </button>
          ) : null}
          {items.length > 1 ? (
            <button
              aria-label="Next"
              className="rounded px-3 py-1 text-white transition-colors bg-transparent hover:text-accent hover:bg-transparent focus:bg-transparent"
              onClick={onNext}
            >
              →
            </button>
          ) : null}
          <button
            aria-label="Close"
            className="rounded px-3 py-1 text-white transition-colors bg-transparent hover:text-accent hover:bg-transparent focus:bg-transparent"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Image */}
      <div
        className="flex-1 min-h-0 min-w-0 flex items-center justify-center px-3 pb-0 sm:pb-3 touch-pan-x overflow-hidden"
        onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
          const el = e.currentTarget as HTMLDivElement & { _swipeX?: number }
          el._swipeX = e.touches[0]?.clientX ?? 0
        }}
        onTouchEnd={(e: React.TouchEvent<HTMLDivElement>) => {
          const el = e.currentTarget as HTMLDivElement & { _swipeX?: number }
          const startX = el._swipeX ?? 0
          const endX = e.changedTouches[0]?.clientX ?? startX
          const dx = endX - startX
          const threshold = 30
          if (Math.abs(dx) > threshold) {
            if (dx < 0) onNext()
            else onPrev()
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.alt}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Caption */}
      {item.caption ? (
        <div className="px-4 pb-5">
          <div className="mx-auto max-w-3xl text-center text-sm text-white">
            {item.caption}
          </div>
        </div>
      ) : null}
    </div>
  )

  return createPortal(content, document.body)
}


