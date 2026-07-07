/**
 * ── HOMEPAGE CONTENT ─────────────────────────────────────────────────
 * Every word, link, and piece of art on the homepage lives in this file.
 *
 *   · Edit here to change what the homepage SAYS (text, links, art).
 *   · To change how it LOOKS, edit the "Style knobs" at the top of each
 *     file in ./sections/ (sizes, spacing, parallax, etc.), the shared
 *     section chrome in ./ui.tsx, and src/app/globals.css.
 *   · Favorites items (covers, titles, notes) live in ./data/favorites.ts.
 *
 * ASCII art: plain template literals — edit the X's directly. Keep line
 * widths consistent so the silhouette doesn't reflow.
 */

import type { ReactNode } from 'react'

/* ── Hero ──────────────────────────────────────────────────────────── */

export const ascii = {
    spider: `                     XXXXXXX
                     XXXXXXX
                    XXXXXXXX
                    XXXXXXXX
                    XX
           XXX       X
          XX X       X
         XX  XX      XX
         X    XXXXXXX X
        XX          XXX
        X
        X
XXX     X
XXX    XX
XXX  XXX
  XX X
   XXX                      `,
    name: ` XXX XXX    XXX XXX        XXX      XXX XXX
XXX   XXX        XXX     XXX XXX    XXX   XXX
XXX   XXX       XXX     XXX   XXX   XXX   XXX
XXX   XXX    XXX XXX     XXX XXX    XXX   XXX
XXX   XXX     XXX       XXX   XXX   XXX   XXX
XXX   XXX    XXX        XXX   XXX   XXX   XXX
 XXX XXX      XXX XXX   XXX   XXX   XXX   XXX

 XXX XXX       XXX      XXX   XXX    XXX XXX    XXX XXX
XXX   XXX    XXX XXX    XXX   XXX      XXX           XXX
XXX   XXX   XXX   XXX    XXX XXX       XXX          XXX
 XXX XXX     XXX XXX       XXX         XXX       XXX XXX
XXX   XXX   XXX   XXX      XXX         XXX        XXX
XXX   XXX   XXX   XXX      XXX         XXX       XXX
 XXX XXX    XXX   XXX      XXX       XXX XXX      XXX XXX
`,
}

export const hero = {
    subtitle: 'CS @ Berkeley',
}

/* ── Social links (icons defined in components/icons.tsx) ──────────── */

export type SocialIcon = 'github' | 'linkedin' | 'cv'

export const socials: {
    email: string
    links: { icon: SocialIcon; href: string; label: string }[]
} = {
    email: 'ozanbayiz@berkeley.edu',
    links: [
        { icon: 'github', href: 'https://github.com/ozanbayiz', label: 'GitHub profile' },
        { icon: 'linkedin', href: 'https://linkedin.com/in/ozanbayiz', label: 'LinkedIn profile' },
        { icon: 'cv', href: '/ozanbayiz_cv.pdf', label: 'Resume' },
    ],
}

/* ── About ─────────────────────────────────────────────────────────── */

export const about: {
    heading: string
    photo: { src: string; alt: string }
    paragraphs: ReactNode[]
} = {
    heading: 'about',
    photo: { src: '/ozan_bair.png', alt: 'Ozan Bayiz' },
    paragraphs: [
        <>
            I&apos;m a fifth-year Masters Student studying EECS at UC
            Berkeley. I previously served as Head TA for CS 189/289A:
            Introduction to Machine Learning, and was a student researcher
            on Google&apos;s XR Perception Team. My research interests are
            computer vision, reinforcement learning, and AI for education.
        </>,
        <>
            I&apos;m extremely grateful for{' '}
            <a
                href="https://people.eecs.berkeley.edu/~vongani_maluleke/"
                className="flex-link"
            >
                Vongani Maluleke
            </a>
            , who has been an amazing mentor to me as I navigate my odd
            research journey.
        </>,
    ],
}

/* ── Favorites ─────────────────────────────────────────────────────── */
/* Items themselves (covers, titles, notes) live in ./data/favorites.ts.
 * `dataTitle` must match a category title there. */

export const favorites = {
    heading: 'favorites',
    panels: [
        { dataTitle: 'Movies', label: 'MOVIES', variant: 'movie', cols: 'grid-cols-3' },
        { dataTitle: 'Music', label: 'MUSIC', variant: 'music', cols: 'grid-cols-4 md:grid-cols-5' },
    ],
} as const

/* ── Footer ────────────────────────────────────────────────────────── */

export const footer = {
    signature: 'ozanbayiz',
}
