'use client'

/* About: bio paragraphs + circular photo on gentle counter-parallax.
 * Text and photo live in ../content.tsx. */

import ExportedImage from 'next-image-export-optimizer'
import { useRef } from 'react'

import { useScrollParallax } from '@/hooks/useScrollParallax'

import { about } from '../content'
import { SectionHeading } from '../ui'

/* ── Style knobs ─────────────────────────────────────────────────── */
const PHOTO_SIZE = 280 // px, circular crop
const PARALLAX_TEXT = -0.03
const PARALLAX_PHOTO = 0.05

export default function AboutSection() {
    const photoRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    useScrollParallax(photoRef, PARALLAX_PHOTO)
    useScrollParallax(textRef, PARALLAX_TEXT)

    return (
        <div className="w-full flex flex-col space-y-6">
            <SectionHeading>{about.heading}</SectionHeading>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                <div
                    ref={textRef}
                    className="col-span-1 flex flex-col justify-center md:col-span-7"
                    style={{ willChange: 'transform' }}
                >
                    {about.paragraphs.map((paragraph, i) => (
                        <p
                            key={i}
                            className={`text-sm leading-relaxed ${i > 0 ? 'mt-4' : ''}`}
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
                <div
                    ref={photoRef}
                    className="col-span-1 flex flex-col items-center justify-center md:col-span-5"
                    style={{ willChange: 'transform' }}
                >
                    <div
                        className="relative overflow-hidden rounded-full"
                        style={{ height: PHOTO_SIZE, width: PHOTO_SIZE }}
                    >
                        <ExportedImage
                            src={about.photo.src}
                            alt={about.photo.alt}
                            fill
                            className="object-cover"
                            priority
                            sizes={`${PHOTO_SIZE}px`}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
