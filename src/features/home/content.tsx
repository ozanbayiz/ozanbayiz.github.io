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
 *
 * Links: <a className="flex-link"> is the quiet base (invisible at rest,
 * underline + bold on hover). Add personality classes at will:
 *   colors:  link-accent (#FF00CC) · link-chartreuse (#CCFF00) ·
 *            link-cyan (#00CCFF) — chartreuse/cyan on the black fill only
 *   marker:  link-marked (hairline underline)
 *   motion:  link-glow (glow in the link's color) · link-box (offset box)
 * Compose freely, e.g. className="flex-link link-cyan link-glow".
 * Defined in src/app/globals.css under "Link personalities".
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
    subtitle: 'UC Berkeley Computer Vision',
}

/* ── Social links (icons defined in sections/Hero.tsx) ─────────────── */

export type SocialIcon = 'github' | 'linkedin' | 'cv'

export const socials: {
    email: string
    emailDisplay: string
    links: { icon: SocialIcon; href: string; label: string }[]
} = {
    email: 'ozanbayiz@berkeley.edu',
    emailDisplay: 'ozanbayiz [at] berkeley [dot] edu',
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
    heading: 'ozanbayiz?',
    photo: { src: '/ozan_bair.png', alt: 'Ozan Bayiz' },
    paragraphs: [
        <>
            I&apos;m a 5th-year MS student in EECS at UC Berkeley, advised
            by Professor{' '}
            <a href="https://nargesnorouzi.me/" className="flex-link link-accent">
                Narges Norouzi
            </a>
            . I work on video understanding in service of AI for education.
        </>,
        <>
            My research interests include representation learning, multimodal
            integration, and data-efficient RL.
        </>,
        <>
            Previously, I was head TA for{' '}
            <a href="https://eecs189.org/" className="flex-link link-accent">
                EECS 189/289A
            </a>{' '}
            (Intro. to ML) and a student researcher on Google&apos;s XR
            Perception team.
        </>,
        <>
            I remain eternally grateful for{' '}
            <a
                href="https://people.eecs.berkeley.edu/~vongani_maluleke/"
                className="flex-link link-accent"
            >
                Vongani Maluleke
            </a>
            &apos;s kind mentorship and guidance, and for the support of my
            family and friends.
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
