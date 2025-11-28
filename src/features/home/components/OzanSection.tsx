'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const OzanSection = () => {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const imageSrc = mounted && resolvedTheme === 'dark' ? '/ozan_noot.jpeg' : '/ozan_root.jpeg'
    const caption = mounted && resolvedTheme === 'dark' ? 'Figure 1A: Ozan and Luna (Pensive).' : 'Figure 1B: Ozan and Caramel (Peaceful).'

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
                        exploring efficient video model adaptation for multimodal generation,
                        and applying these techniques to support AI-enhanced learning.
                        <br></br>
                        <br></br>
                        Lately I&apos;ve been spending most of my time sitting in BAIR or TAing for <a href="https://eecs189.org/fa25/" className='italic hover:text-accent'>CS 189/289A: Intro. To Machine Learning</a>.
                        <br></br>
                        <br></br>
                        I&apos;m very grateful for
                        <a href="https://people.eecs.berkeley.edu/~vongani_maluleke/" className='font-bold hover:text-accent'> Vongani Maluleke</a>&apos;s mentorship as I find my way through research.
                        <br></br>
                        <br></br>
                    </p>
                </div>
                <div className='col-span-5 mt-4 place-self-center md:mt-0'>
                    <div className='relative h-[250px] w-[250px] overflow-hidden rounded-full place-self-center mb-4'>
                        <Image
                            src={imageSrc}
                            alt='Ozan Bayiz'
                            width={250}
                            height={250}
                            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform place-self-center'
                            priority
                        />
                    </div>
                    {/* </figure> */}
                    <p className="body-text text-center">
                        {caption}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default OzanSection
