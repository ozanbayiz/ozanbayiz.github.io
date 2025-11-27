'use client'

import Image from 'next/image'

const OzanSection = () => {
    return (
        <section>
            <div className='m-4 grid grid-cols-1 md:grid-cols-12'>
                <div className='col-span-7 h-full place-self-center text-left'>
                    <h1 className='mb-4 text-center h1 sm:text-left'>
                        Ozan Bayiz
                    </h1>
                    <p className='body-text'>
                        I&apos;m a fourth-year undergraduate R&amp;C Scholar at
                        UC Berkeley studying CS. I&apos;m interested in
                        exploring how we can cheaply adapt video models to guide generation with multimodal signals,
                        and how we can use the resultant techniques to support AI-enhanced learning.
                        <br></br>
                        <br></br>
                        These days, I spend most of my time TAing for <a href="https://eecs189.org/fa25/" className='italic hover:text-accent'>CS 189/289A: Intro. To Machine Learning</a>.
                        <br></br>
                        <br></br>
                        I&apos;m very grateful for
                        <a href="https://people.eecs.berkeley.edu/~vongani_maluleke/" className='font-bold hover:text-accent'> Vongani Maluleke</a>&apos;s mentorship as I find my way through research.
                        <br></br>
                    </p>
                </div>
                <div className='col-span-5 mt-4 place-self-center md:mt-0'>
                    <div className='relative h-[250px] w-[250px] overflow-hidden rounded-full'>
                        <Image
                            src='/ozanbayiz_desk.png'
                            alt='Ozan Bayiz'
                            width={250}
                            height={250}
                            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OzanSection


