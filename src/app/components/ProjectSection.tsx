import Image from "next/image";

export default function ProjectSection() {
    return (
        <section>
            <div className="max-w-full m-4 grid gap-16 grid-cols-1 md:grid-cols-2 justify-stretch">
                <div className="text-center sm:text-left">
                    <h1 className="mb-4 text-xl sm:text-2xl font-bold">
                        Projects
                    </h1>
                    <p>
                        Coming soon... coming soon coming soon coming soon coming soon coming soon coming soon... coming soon coming soon coming soon coming soon coming soon very soon...
                        
                    </p>
                </div>

                <div className="text-center sm:text-left">
                    <h1 className="mb-4 text-xl sm:text-2xl font-bold text-center sm:text-left">
                        Publications
                    </h1>
                    <p>
                        Haha
                    </p>
                    <div className="flex justify-center items-center">
                            <Image src="/nyan_cat.gif" alt="Publications" width={250} height={250} className="rounded-full"/>

                    </div>
                </div>
            </div>
        </section>
    )
}