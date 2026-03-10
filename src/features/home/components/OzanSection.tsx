import ExportedImage from 'next-image-export-optimizer'

import { Reveal } from '@/components/common/Reveal'

const OzanSection = () => {
    return (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <Reveal className="col-span-1 flex flex-col justify-center md:col-span-7">
                <p className="text-sm leading-relaxed">
                    I&apos;m a fourth-year Regents&apos; and
                    Chancellor&apos;s Scholar at UC Berkeley studying
                    Computer Science. I&apos;m interested in exploring
                    ways to augment video models to support AI-enhanced
                    learning.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground">
                    I&apos;m extremely grateful for
                    <a
                        href="https://people.eecs.berkeley.edu/~vongani_maluleke/"
                        className="gradient-link"
                    >
                        {' '}
                        Vongani Maluleke
                    </a>
                    , who has been an amazing mentor to me as I navigate
                    my odd research journey.
                </p>
            </Reveal>
            <Reveal
                className="col-span-1 flex flex-col items-center justify-center md:col-span-5"
                delay={150}
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
            </Reveal>
        </div>
    )
}

export default OzanSection
