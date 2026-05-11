'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type StyleMode = 'ink' | 'color'

type ModeContextValue = {
    mode: StyleMode
    setMode: (m: StyleMode) => void
    cycleMode: () => void
}

const ModeContext = createContext<ModeContextValue>({
    mode: 'color',
    setMode: () => {},
    cycleMode: () => {},
})

export function ModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<StyleMode>('color')

    useEffect(() => {
        const stored = localStorage.getItem('style-mode')
        if (stored === 'ink' || stored === 'color') {
            setModeState(stored)
            document.documentElement.dataset.mode = stored
        }
    }, [])

    const setMode = useCallback((m: StyleMode) => {
        setModeState(m)
        localStorage.setItem('style-mode', m)
        document.documentElement.dataset.mode = m
    }, [])

    const cycleMode = useCallback(() => {
        setModeState(prev => {
            const next: StyleMode = prev === 'ink' ? 'color' : 'ink'
            localStorage.setItem('style-mode', next)
            document.documentElement.dataset.mode = next
            return next
        })
    }, [])

    return (
        <ModeContext.Provider value={useMemo(() => ({ mode, setMode, cycleMode }), [mode, setMode, cycleMode])}>
            {children}
        </ModeContext.Provider>
    )
}

export function useModeContext() {
    return useContext(ModeContext)
}
