/* About: bio paragraphs + a captioned photo figure.
 * Text, photo, and caption live in ../content.tsx. */

import ExportedImage from 'next-image-export-optimizer'

import { about } from '../content'

/* Intrinsic size of the source asset (public/ozan_rumi.jpg) — the image
 * renders at its natural 4:3 aspect, uncropped, filling the card width. */
const PHOTO_W = 1400
const PHOTO_H = 1050

/* Every bio item is a dead zone: no cloud painted, plain ink on the
 * page. The dead-zone defaults wrap each text line tightly, so the
 * physarum grows right up to the items and through the seam gaps
 * between them. */

export default function AboutSection() {
    return (
        <div className='flex w-full flex-col'>
            {/* seam gaps, no interior padding: the items sit close, and
             * their tight bands leave the mold corridors between them. */}
            <div className='grid grid-cols-1 gap-seam md:grid-cols-12'>
                <div className='col-span-1 flex flex-col justify-center gap-seam md:col-span-7'>
                    {about.paragraphs.map((paragraph, i) => (
                        <p
                            key={i}
                            data-cloud='dead'
                            className='text-sm leading-relaxed'
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
                <div className='order-first col-span-1 flex flex-col justify-center md:order-none md:col-span-5'>
                    {/* The photo in its own tight dead zone, uncropped,
                     * caption in the mono UI voice. max-w-md caps the
                     * figure once the layout drops to one column — a
                     * notch above its 5/12 grid-column size on a wide
                     * screen, so Ozan never gets *huge*. */}
                    <figure
                        data-cloud='dead'
                        className='mx-auto w-full max-w-md'
                    >
                        <ExportedImage
                            src={about.photo.src}
                            alt={about.photo.alt}
                            width={PHOTO_W}
                            height={PHOTO_H}
                            className='h-auto w-full'
                            priority
                            sizes='(min-width: 768px) 40vw, 28rem'
                        />
                        {about.photo.caption && (
                            <figcaption className='mt-inline text-center text-xs leading-relaxed text-foreground/70'>
                                {about.photo.caption}
                            </figcaption>
                        )}
                    </figure>
                </div>
            </div>
        </div>
    )
}
