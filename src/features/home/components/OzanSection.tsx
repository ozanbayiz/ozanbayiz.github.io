'use client'

import Image from 'next/image'

const OzanSection = () => {
    return (
        <section>
            <div className='m-4 grid grid-cols-1 md:grid-cols-12'>
                <div className='col-span-7 h-full place-self-center text-left'>
                    <h1 className='mb-4 text-center text-xl font-bold sm:text-left sm:text-2xl'>
                        Ozan Bayiz
                    </h1>
                    <p>
                        I&apos;m a fourth-year undergraduate R&amp;C Scholar at
                        UC Berkeley studying CS. I&apos;m interested in
                        exploring how multimodal signals can be used to enhance
                        understanding and generation of visual data.
                        <br></br>
                        <br></br>
                        I&apos;m very appreciative of Vongani Maluleke’s mentorship as I find my way through CV research.
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


