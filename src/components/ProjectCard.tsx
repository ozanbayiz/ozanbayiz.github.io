import Image from "next/image";

export default function ProjectCard({title, description, imageUrl, gitUrl}: {title: string, description: string, imageUrl: string, gitUrl: string}) {
    return (
        <div 
            className="border-2 border-dashed border-foreground"
        >
            <div className="m-2 flex flex-row justify-between w-full-4 align-center">
                <div className="flex">
                    <p className="font-bold text-md sm:text-l self-center">{title}</p>
                </div>

                <div className="flex">
                    <a 
                        href={gitUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-accent flex flex-row align-center"
                    >
                        <p className="self-center">code </p>
                        <svg className="fill-current hover:text-accent h-9 w-9 max-w-full"><path d="M16,2.345c7.735,0,14,6.265,14,14-.002,6.015-3.839,11.359-9.537,13.282-.7,.14-.963-.298-.963-.665,0-.473,.018-1.978,.018-3.85,0-1.312-.437-2.152-.945-2.59,3.115-.35,6.388-1.54,6.388-6.912,0-1.54-.543-2.783-1.435-3.762,.14-.35,.63-1.785-.14-3.71,0,0-1.173-.385-3.85,1.435-1.12-.315-2.31-.472-3.5-.472s-2.38,.157-3.5,.472c-2.677-1.802-3.85-1.435-3.85-1.435-.77,1.925-.28,3.36-.14,3.71-.892,.98-1.435,2.24-1.435,3.762,0,5.355,3.255,6.563,6.37,6.913-.403,.35-.77,.963-.893,1.872-.805,.368-2.818,.963-4.077-1.155-.263-.42-1.05-1.452-2.152-1.435-1.173,.018-.472,.665,.017,.927,.595,.332,1.277,1.575,1.435,1.978,.28,.787,1.19,2.293,4.707,1.645,0,1.173,.018,2.275,.018,2.607,0,.368-.263,.787-.963,.665-5.719-1.904-9.576-7.255-9.573-13.283,0-7.735,6.265-14,14-14Z"></path></svg>
                    </a>
                </div>
            </div>

            <div className="w-full border-t-2 border-foreground border-dashed"></div>

            <div className="m-2 grid grid-cols-12 items-center">
                <div className="col-span-7 sm:col-span-9 text-left">
                    <p>{description}</p>
                </div>
                <div className="col-span-5 sm:col-span-3 place-self-center">
                    <Image 
                        src={imageUrl} 
                        alt={title} 
                        width={110} 
                        height={110}
                    />  
                </div>
            </div>
        </div>
    )
}