"use client"

import Image from "next/image";
import { TypeAnimation } from "react-type-animation";

const OzanSection = () => {
    return (
        <section>
            <div className="m-4 grid grid-cols-1 md:grid-cols-12">
                <div className="h-full col-span-7 place-self-center text-center sm:text-left">

                    <h1 className="mb-4 text-xl sm:text-2xl font-bold">
                        <TypeAnimation
                            sequence={["Hello", 5000, "Selam", 5000, "Hi", 5000, "Merhaba", 5000]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                        />
                    </h1>
                    <p>
                        I&apos;m a third-year R&amp;C Scholar @ UC Berkeley studying CS.
                        I&apos;m interested in human-centered design, deep learning, and working with audio/visual data.
                        <br></br>
                        <br></br>
                        AFK, I like to take long walks.

                    </p>
                </div>
                <div className="col-span-5 place-self-center mt-4 md:mt-0">
                    <div className="rounded-full w-[250px] h-[250px]  relative">
                        <Image
                            src="/headshot.png"
                            alt="Ozan Bayiz"
                            width={400}
                            height={400}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2  rounded-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OzanSection;