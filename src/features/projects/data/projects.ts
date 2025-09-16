export type Project = {
    collection: 'cs180' | 'personal' | 'misc-academic'
    slug?: string
    title: string
    shortTitle?: string
    description: string
    imageUrl: string
    gitUrl: string
    authors?: string[]
    date?: string
    pdfUrl?: string
    heroImageSrc?: string
    featured?: boolean
    unit?: number
    part?: 'a' | 'b' | 'c'
    unitTitle?: string
}

const baseProjects: Project[] = [
    {
        collection: 'personal',
        slug: 'dit-rf',
        title: 'DiT + RF',
        description:
            'My implementation of a diffusion transformer trained on rectified flow.',
        imageUrl: '/DiT_RF.gif',
        date: '2025-01-03',
        gitUrl: 'https://github.com/ozanbayiz/DiT_RF',
    },
    {
        collection: 'personal',
        slug: 'personal-website',
        title: 'Personal Website',
        description: 'Me, online, built with React, Next.js, and Tailwind CSS.',
        imageUrl: '/spinning_star.gif',
        date: '2025-08-13',
        gitUrl: 'https://github.com/ozanbayiz/ozanbayiz.github.io/tree/main',
        featured: true
    },
    {
        collection: 'misc-academic',
        slug: 'idarve',
        title: 'Investigating Demographic Attribute Representation in Vision Encoders',
        shortTitle: 'CS182 Project: IDARVE',
        description:
            'Probed Florence‑2’s DaViT vision encoder with linear classifiers and trained patch‑level SAEs to discover interpretable sparse dictionary features (SDFs).',
        imageUrl: '/projects/idarve/thumbnail.png',
        heroImageSrc: '/projects/idarve/thumbnail.png',
        gitUrl: 'https://github.com/ozanbayiz/idarve',
        date: '2025-05-11',
        pdfUrl:
            'https://drive.google.com/file/d/1GGZpM5Wz_wwaz6jEWMMBS_Ixga-qs3XV/view?usp=drive_link',
        featured: true
    }
]

export const projectsData: Project[] = [...baseProjects]

projectsData.push(
    {
        collection: 'cs180',
        slug: 'cs180-proj1',
        title: 'CS180 Project 1: Colorizing the Prokudin-Gorskii Photo Collection',
        shortTitle: 'CS180 Project 1',
        description:
            'Aligning RGB channels using phase correlation and an image pyramid to colorize Prokudin-Gorskii glass plate photos; results across the dataset.',
        imageUrl: '/projects/cs180/proj1/wide_emir.png',
        heroImageSrc: '/projects/cs180/proj1/wide_emir.png',
        gitUrl: 'https://github.com/ozanbayiz/cs180',
        date: '2024-09-15'
    },
    {
        collection: 'cs180',
        slug: 'cs180-proj2',
        title: 'CS180 Project 2: Fun with Filters and Frequencies!',
        shortTitle: 'CS180 Project 2',
        description:
            'Edges and DoG, unsharp masking, hybrid images, Gaussian/Laplacian stacks, multiresolution blending, and related experiments.',
        imageUrl: '/projects/cs180/proj2/misc/header.png',
        heroImageSrc: '/projects/cs180/proj2/misc/header.png',
        gitUrl: 'https://github.com/ozanbayiz/cs180',
        date: '2024-09-23'
    },
    {
        collection: 'cs180',
        slug: 'cs180-proj3',
        title: 'CS180 Project 3: Face Morphing',
        shortTitle: 'CS180 Project 3',
        description:
            'Defining correspondences with landmarks, Delaunay triangulation, mid-way face, morph sequence, population mean, caricatures, and extras.',
        imageUrl: '/projects/cs180/proj3/failed_attempt.png',
        heroImageSrc: '/projects/cs180/proj3/failed_attempt.png',
        gitUrl: 'https://github.com/ozanbayiz/cs180',
        date: '2024-10-08'
    },
    {
        collection: 'cs180',
        slug: 'cs180-proj4',
        title: 'CS180 Project 4: [Auto]stitching Photo Mosaics',
        shortTitle: 'CS180 Project 4',
        description:
            'Homographies, warping, rectification, feature detection/description, matching, RANSAC, Laplacian blending, and photo mosaics.',
        imageUrl: '/projects/cs180/proj4/cool_bug.jpg',
        heroImageSrc: '/projects/cs180/proj4/cool_bug.jpg',
        gitUrl: 'https://github.com/ozanbayiz/cs180',
        date: '2024-10-29'
    },
    {
        collection: 'cs180',
        slug: 'cs180-proj5a',
        title: 'CS180 Project 5A: The Power of Diffusion Models!',
        shortTitle: 'CS180 Project 5A',
        description:
            'Diffusion sampling loops, CFG, image-to-image, visual anagrams, and hybrid images.',
        imageUrl: '/projects/cs180/proj5a/thumbnail.jpeg',
        heroImageSrc: '/projects/cs180/proj5a/thumbnail.jpeg',
        gitUrl: 'https://github.com/ozanbayiz/cs180',
        date: '2024-11-07'
    },
    {
        collection: 'cs180',
        slug: 'cs180-proj5b',
        title: 'CS180 Project 5B: Diffusion Models from Scratch!',
        shortTitle: 'CS180 Project 5B',
        description:
            'Training UNets: unconditional, time-conditioned, and class-conditioned; results and samples.',
        imageUrl: '/projects/cs180/proj5b/thumbnail.jpeg',
        heroImageSrc: '/projects/cs180/proj5b/thumbnail.jpeg',
        gitUrl: 'https://github.com/ozanbayiz/cs180',
        date: '2024-11-19'
    },
    {
        collection: 'cs180',
        slug: 'cs180-proj6',
        title: 'CS180 Project 6: Neural Radiance Field!',
        shortTitle: 'CS180 Project 6',
        description:
            'Fitting a 2D neural field and a NeRF from multi-view images, including ray generation, sampling, NeRF architecture, and volume rendering results.',
        imageUrl: '/projects/cs180/proj6/agony.jpeg',
        heroImageSrc: '/projects/cs180/proj6/agony.jpeg',
        gitUrl: 'https://github.com/ozanbayiz/cs180',
        date: '2024-12-13'
    }
)