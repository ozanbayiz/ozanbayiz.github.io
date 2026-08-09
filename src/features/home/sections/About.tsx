/* About: bio paragraphs + a captioned photo figure.
 * Text, photo, and caption live in ../content.tsx. */

import ExportedImage from 'next-image-export-optimizer'

import { about } from '../content'

/* Intrinsic size of the source asset (public/ozan_rumi.jpg) — the image
 * renders at its natural 4:3 aspect, uncropped, filling the card width. */
const PHOTO_W = 1400
const PHOTO_H = 1050

export default function AboutSection() {
    return (
        <div className="w-full flex flex-col">
            <div className="grid grid-cols-1 gap-inset-x md:grid-cols-12">
                <div className="col-span-1 flex flex-col justify-center gap-stack md:col-span-7">
                    {about.paragraphs.map((paragraph, i) => (
                        <p
                            key={i}
                            className="section-card p-stack text-sm leading-relaxed"
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
                <div className="order-first md:order-none col-span-1 flex flex-col justify-center md:col-span-5">
                    {/* A white figure card, like the paragraph cards: the photo
                     * uncropped, with its caption in the mono UI voice. */}
                    <figure className="section-card p-stack">
                        <ExportedImage
                            src={about.photo.src}
                            alt={about.photo.alt}
                            width={PHOTO_W}
                            height={PHOTO_H}
                            className="h-auto w-full"
                            priority
                            sizes="(min-width: 768px) 40vw, 100vw"
                        />
                        {about.photo.caption && (
                            <figcaption className="mt-inline text-center text-xs leading-relaxed text-foreground/70">
                                {about.photo.caption}
                            </figcaption>
                        )}
                    </figure>
                </div>
            </div>
        </div>
    )
}
