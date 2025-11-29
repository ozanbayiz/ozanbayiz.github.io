'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

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
        <section>
            <div className='m-4 grid grid-cols-1 md:grid-cols-12'>
                <div className='col-span-7 h-full place-self-center text-left'>
                    <h1 className='mb-4 text-center h1 sm:text-left'>
                        Ozan Bayiz
                    </h1>
                    <p className='body-text'>
                        I&apos;m a fourth-year Regents&apos; and Chancellor&apos;s Scholar at
                        UC Berkeley studying Computer Science. I&apos;m interested in
                        exploring efficient video model adaptation for multimodal conditioning,
                        and applying these techniques to support AI-enhanced learning.
                        <br></br>
                        <br></br>
                        These days I spend most of my time in
                        <a href="https://bair.berkeley.edu/" className='font-bold hover:text-accent'> BAIR </a>
                        or TAing for <a href="https://eecs189.org/fa25/" className='font-bold hover:text-accent'>CS 189/289A: Intro. To Machine Learning</a>.
                        <br></br>
                        <br></br>
                        I&apos;m very grateful for
                        <a href="https://people.eecs.berkeley.edu/~vongani_maluleke/" className='font-bold hover:text-accent'> Vongani Maluleke</a>&apos;s mentorship as I find my way through research.
                        <br></br>
                        <br></br>
                    </p>
                </div>
                <div className='col-span-5 mt-4 flex flex-col items-center md:mt-0 md:justify-self-center'>
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
        </section>
    )
}

export default OzanSection
