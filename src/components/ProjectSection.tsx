import Image from "next/image";
import ProjectCard from "./ProjectCard";

const projectsData = [
    {
        title: 'DiT + RF',
        description: "my implementation of a diffusion transformer trained with rectified flow",
        imageUrl: "/DiT_RF.gif",
        gitUrl: "https://github.com/ozanbayiz/DiT_RF",
    },
    {
        title: 'Personal Website',
        description: "me, online, with React, Next.js, and Tailwind CSS",
        imageUrl: "/spinning_star.gif",
        gitUrl: "https://github.com/ozanbayiz/ozanbayiz.github.io/tree/main",
    },
]

export default function ProjectSection() {
    return (
        <section>
            <div className="w-full-4 m-4 grid gap-8 md:gap-16 grid-cols-1 md:grid-cols-2 justify-stretch">
                <div className="text-center sm:text-left">

                    <h1 className="mb-4 text-xl sm:text-2xl font-bold">
                        Projects
                    </h1>
                    <ul className="grid grid-cols-1 gap-8 mb-4">
                        {projectsData.map((project, index) => (
                            <li key={index}>
                                <ProjectCard
                                    title={project.title}
                                    description={project.description}
                                    imageUrl={project.imageUrl}
                                    gitUrl={project.gitUrl}
                                />
                            </li>
                        ))}
                    </ul>
                    <p className="text-center">
                        (Also see my <a className="underline hover:text-accent" href="https://ozanbayiz.github.io/cs180/">CS180 Homeworks</a>)
                    </p>
                </div>

                <div className="text-center sm:text-left">
                    <h1 className="mb-4 text-xl sm:text-2xl font-bold text-center sm:text-left">
                        Research
                    </h1>
                    <p className="mb-4">
                        Coming soon :)
                    </p>
                    <div className="flex justify-center items-center">
                            <Image src="/nyan_cat.gif" alt="Publications" width={120} height={120} className="rounded-full"/>

                    </div>
                </div>
            </div>
        </section>
    )
}