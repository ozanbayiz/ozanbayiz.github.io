type Datelike = { date?: string }

export function byDateDesc(a: Datelike, b: Datelike): number {
    const ad = a.date ? Date.parse(a.date) : 0
    const bd = b.date ? Date.parse(b.date) : 0
    return bd - ad
}

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
}

export function formatProjectDate(date: string | undefined, options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS): string | null {
    if (!date) return null
    return new Date(date + 'T00:00:00').toLocaleDateString('en-US', options)
}
