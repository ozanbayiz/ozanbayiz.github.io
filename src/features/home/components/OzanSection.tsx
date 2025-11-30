'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Section } from '@/shared/ui/section'

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
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDark = mounted && resolvedTheme === 'dark'
    const { src: imageSrc, caption } = isDark
        ? THEME_CONTENT.dark
        : THEME_CONTENT.light

    return (
        <Section>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-12'>
                <div className='col-span-1 flex flex-col justify-center text-left md:col-span-7'>
                    <h1 className='mb-4 text-center h1 sm:text-left'>
                        Ozan Bayiz
                    </h1>
                    <p className='body-text'>
                        I&apos;m a fourth-year Regents&apos; and Chancellor&apos;s Scholar at
                        UC Berkeley studying Computer Science. I&apos;m interested in
                        exploring efficient video model adaptation for multimodal conditioning,
                        and applying these techniques to support AI-enhanced learning.
                        <br />
                        <br />
                        These days I spend most of my time in
                        <a href="https://bair.berkeley.edu/" className='font-bold hover:text-accent'> BAIR </a>
                        or TAing for <a href="https://eecs189.org/fa25/" className='font-bold hover:text-accent'>CS 189/289A: Intro. To Machine Learning</a>.
                        <br />
                        <br />
                        I&apos;m extremely grateful for
                        <a href="https://people.eecs.berkeley.edu/~vongani_maluleke/" className='font-bold hover:text-accent'> Vongani Maluleke</a>,
                        who has been an amazing mentor to me as I navigate my odd research journey.
                        <br />
                        <br />
                    </p>
                </div>
                <div className='col-span-1 flex flex-col items-center justify-center md:col-span-5 md:mt-0'>
                    <div className='relative mb-4 h-[250px] w-[250px] overflow-hidden rounded-full'>
                        <Image
                            src={imageSrc}
                            alt='Ozan Bayiz'
                            fill
                            className='object-cover'
                            priority
                            sizes='(max-width: 768px) 250px, 250px'
                        />
                    </div>
                    {/* </figure> */}
                    <p className='body-text text-center text-muted-foreground'>
                        {caption}
                    </p>
                </div>
            </div>
        </Section>
    )
}

export default OzanSection
