'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useMounted } from '@/hooks/useMounted'

export type StyleMode = 'ink' | 'color' | 'clean'

const CYCLE: StyleMode[] = ['ink', 'color', 'clean']

type ModeContextValue = {
    mode: StyleMode
    setMode: (m: StyleMode) => void
    cycleMode: () => void
}

const ModeContext = createContext<ModeContextValue>({
    mode: 'ink',
    setMode: () => {},
    cycleMode: () => {}
})

export function ModeProvider({ children }: { children: React.ReactNode }) {
    const mounted = useMounted()
    const [mode, setModeState] = useState<StyleMode>('ink')

    // Sync from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('style-mode')
        if (stored === 'color' || stored === 'clean') setModeState(stored)
    }, [])

    const setMode = useCallback((m: StyleMode) => {
        setModeState(m)
        localStorage.setItem('style-mode', m)
        document.documentElement.dataset.mode = m
    }, [])

    const cycleMode = useCallback(() => {
        setModeState(prev => {
            const next = CYCLE[(CYCLE.indexOf(prev) + 1) % CYCLE.length]!
            localStorage.setItem('style-mode', next)
            document.documentElement.dataset.mode = next
            return next
        })
    }, [])

    // Keep data attribute in sync (for SSR recovery)
    useEffect(() => {
        if (mounted) document.documentElement.dataset.mode = mode
    }, [mode, mounted])

    return (
        <ModeContext.Provider value={useMemo(() => ({ mode, setMode, cycleMode }), [mode, setMode, cycleMode])}>
            {children}
        </ModeContext.Provider>
    )
}

export function useModeContext() {
    return useContext(ModeContext)
}
