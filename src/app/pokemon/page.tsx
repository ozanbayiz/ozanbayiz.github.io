'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const DB_NAME = 'pokemon-platinum'
const STORE_NAME = 'roms'
const ROM_KEY = 'platinum'

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1)
        req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME)
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
    })
}

function dbGet(db: IDBDatabase, key: string): Promise<ArrayBuffer | undefined> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const req = tx.objectStore(STORE_NAME).get(key)
        req.onsuccess = () => resolve(req.result as ArrayBuffer | undefined)
        req.onerror = () => reject(req.error)
    })
}

function dbPut(db: IDBDatabase, key: string, value: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const req = tx.objectStore(STORE_NAME).put(value, key)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
    })
}

export default function PokemonPage() {
    const gameRef = useRef<HTMLDivElement>(null)
    const [ready, setReady] = useState(false)
    const [checking, setChecking] = useState(true)
    const launched = useRef(false)

    const launchEmulator = useCallback((romData: ArrayBuffer) => {
        if (launched.current) return
        launched.current = true

        const blob = new Blob([romData])
        const url = URL.createObjectURL(blob)

        const w = window as unknown as Record<string, unknown>
        w.EJS_player = '#game'
        w.EJS_core = 'nds'
        w.EJS_gameUrl = url
        w.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/'
        w.EJS_color = '#000'

        const script = document.createElement('script')
        script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js'
        document.body.appendChild(script)

        setReady(true)
    }, [])

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const db = await openDB()
                const cached = await dbGet(db, ROM_KEY)
                if (cached && !cancelled) {
                    launchEmulator(cached)
                }
            } catch { /* no cached ROM */ }
            if (!cancelled) setChecking(false)
        })()
        return () => { cancelled = true }
    }, [launchEmulator])

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const buffer = await file.arrayBuffer()
        try {
            const db = await openDB()
            await dbPut(db, ROM_KEY, buffer)
        } catch { /* save failed, still launch */ }
        launchEmulator(buffer)
    }

    if (checking) return null

    return (
        <div className='flex min-h-screen flex-col bg-black text-white'>
            <nav className='flex items-center justify-between p-4'>
                <Link href='/' className='text-sm hover:underline'>
                    &larr; back
                </Link>
                <span className='text-sm font-bold tracking-wide'>
                    POKEMON PLATINUM
                </span>
            </nav>

            <div className='flex flex-1 items-center justify-center p-4'>
                {!ready && (
                    <div className='flex flex-col items-center gap-6 text-center'>
                        <p className='text-lg font-bold'>Load ROM</p>
                        <label className='cursor-pointer border border-white px-8 py-3 text-sm transition-colors hover:bg-white hover:text-black'>
                            Select .nds file
                            <input
                                type='file'
                                accept='.nds,.zip,.7z'
                                className='hidden'
                                onChange={handleFile}
                            />
                        </label>
                        <p className='max-w-xs text-xs text-neutral-500'>
                            Your ROM is cached locally in the browser.
                            Saves persist automatically between sessions.
                        </p>
                    </div>
                )}
                <div
                    id='game'
                    ref={gameRef}
                    className={ready ? 'w-full max-w-3xl' : 'hidden'}
                />
            </div>
        </div>
    )
}
