'use client'

import ExportedImage from 'next-image-export-optimizer'
import { useRef } from 'react'

import SectionHeading from '@/components/common/SectionHeading'
import { useScrollParallax } from '@/hooks/useScrollParallax'

const OzanSection = () => {
    const photoRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    useScrollParallax(photoRef, 0.05)
    useScrollParallax(textRef, -0.03)

    return (
        <div className="w-full flex flex-col space-y-6">
            <SectionHeading>about</SectionHeading>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                <div
                    ref={textRef}
                    className="col-span-1 flex flex-col justify-center md:col-span-7"
                    style={{ willChange: 'transform' }}
                >
                    <p className="text-sm leading-relaxed">
                        I&apos;m a fourth-year Regents&apos; and
                        Chancellor&apos;s Scholar at UC Berkeley studying
                        Computer Science. I&apos;m the Head TA for CS
                        189/289A: Introduction to Machine Learning. My
                        research interests are computer vision, reinforcement
                        learning, and AI for education.
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-foreground">
                        I&apos;m extremely grateful for
                        {' '}
                        <a
                            href="https://people.eecs.berkeley.edu/~vongani_maluleke/"
                            className="flex-link"
                        >
                            Vongani Maluleke
                        </a>
                        , who has been an amazing mentor to me as I navigate
                        my odd research journey.
                    </p>
                </div>
                <div
                    ref={photoRef}
                    className="col-span-1 flex flex-col items-center justify-center md:col-span-5"
                    style={{ willChange: 'transform' }}
                >
                    <div className="relative h-[280px] w-[280px] overflow-hidden rounded-full">
                        <ExportedImage
                            src="/ozan_bair.png"
                            alt="Ozan Bayiz"
                            fill
                            className="object-cover"
                            priority
                            sizes="280px"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OzanSection
