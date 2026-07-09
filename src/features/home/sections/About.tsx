/* About: bio paragraphs + circular photo.
 * Text and photo live in ../content.tsx. */

import ExportedImage from 'next-image-export-optimizer'

import { about } from '../content'
import { SectionHeading } from '../ui'

/* ── Style knobs ─────────────────────────────────────────────────── */
const PHOTO_SIZE = 280 // px, square crop

export default function AboutSection() {
    return (
        <div className="w-full flex flex-col space-y-6">
            <SectionHeading>{about.heading}</SectionHeading>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                <div className="col-span-1 flex flex-col justify-center md:col-span-7">
                    {about.paragraphs.map((paragraph, i) => (
                        <p
                            key={i}
                            className={`text-sm leading-relaxed ${i > 0 ? 'mt-4' : ''}`}
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
                {/* md:items-end pins the photo to the box's right padding
                 * edge, mirroring the text's left edge — symmetric insets. */}
                <div className="order-first md:order-none col-span-1 flex flex-col items-center md:items-end justify-center md:col-span-5">
                    <div
                        className="relative overflow-hidden"
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
