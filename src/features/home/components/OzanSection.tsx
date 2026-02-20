'use client'

import ExportedImage from 'next-image-export-optimizer'
import { useTheme } from 'next-themes'

import { useMounted } from '@/hooks/useMounted'

const THEME_CONTENT = {
    dark: {
        src: '/ozan_noot.jpeg',
        caption: 'Figure 1A: Ozan and Luna (Pensive).'
    },
    light: {
        src: '/ozan_root.jpeg',
        caption: 'Figure 1B: Ozan and Caramel (Peaceful).'
    }
} as const

const OzanSection = () => {
    const { resolvedTheme } = useTheme()
    const mounted = useMounted()

    const isDark = mounted && resolvedTheme === 'dark'
    const { src: imageSrc, caption } = isDark
        ? THEME_CONTENT.dark
        : THEME_CONTENT.light

    return (
        <section className="w-full flex flex-col py-6 md:py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                <div className="col-span-1 flex flex-col justify-center text-left md:col-span-7">
                    <h1 className="mb-4 text-center text-2xl font-bold sm:text-3xl md:text-4xl tracking-tight sm:text-left">
                        Ozan Bayiz
                    </h1>
                    <p className="text-sm leading-relaxed">
                        I&apos;m a fourth-year Regents&apos; and
                        Chancellor&apos;s Scholar at UC Berkeley studying
                        Computer Science. I&apos;m interested in exploring
                        ways to augment video models to support AI-enhanced
                        learning.
                        <br />
                        <br />
                        I&apos;m extremely grateful for
                        <a
                            href="https://people.eecs.berkeley.edu/~vongani_maluleke/"
                            className="font-bold hover:text-accent1"
                        >
                            {' '}
                            Vongani Maluleke
                        </a>
                        , who has been an amazing mentor to me as I navigate
                        my odd research journey.
                        <br />
                        <br />
                    </p>
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center md:col-span-5 md:mt-0">
                    <div className="relative mb-4 h-[250px] w-[250px] overflow-hidden rounded-full">
                        <ExportedImage
                            src={imageSrc}
                            alt="Ozan Bayiz"
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 250px, 250px"
                        />
                    </div>
                    <p className="text-sm leading-relaxed text-center text-foreground">
                        {caption}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default OzanSection
