export type Project = {
    collection: 'cs180' | 'cs185' | 'cs280' | 'personal' | 'misc-academic'
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
        title: 'ozanbayiz.net',
        description: 'This website! built with React, Next.js, Tailwind CSS, shadcn/ui, and lots and lots and lots of love.',
        imageUrl: '/spinning_star.gif',
        date: '2025-08-13',
        gitUrl: 'https://github.com/ozanbayiz/ozanbayiz.github.io/tree/main',
        featured: true
    },
    {
        collection: 'misc-academic',
        slug: 'idarve',
        title: 'Investigating Demographic Attribute Representation in Vision Encoders',
        shortTitle: 'IDARVE',
        description:
            'Probed Florence‑2’s DaViT vision encoder with linear classifiers and trained patch‑level SAEs to discover interpretable sparse dictionary features (SDFs).',
        imageUrl: '/projects/idarve/thumbnail.png',
        heroImageSrc: '/projects/idarve/thumbnail.png',
        gitUrl: 'https://github.com/ozanbayiz/idarve',
        date: '2025-05-11',
        pdfUrl:
            'https://drive.google.com/file/d/1GGZpM5Wz_wwaz6jEWMMBS_Ixga-qs3XV/view?usp=drive_link',
        featured: true
    },
    {
        collection: 'cs185',
        slug: 'cs185-hw1',
        title: 'Imitation Learning',
        shortTitle: 'Imitation Learning',
        description:
            'Action-chunking behavioral cloning with MSE and flow matching policies for the Push-T environment.',
        imageUrl: '/projects/cs185hw1/flow_curves.png',
        heroImageSrc: '/projects/cs185hw1/flow_curves.png',
        gitUrl: 'https://github.com/ozanbayiz/cs185hw1',
        date: '2026-02-11'
    },
    {
        collection: 'cs280',
        slug: 'cs280-hw1',
        title: 'Poor Man\'s AR & Homographies',
        shortTitle: 'AR & Homographies',
        description:
            'Keypoint tracking, DLT camera calibration with RANSAC and bundle adjustment, 3D cube projection, and affine/homography transforms from scratch.',
        imageUrl: '/projects/cs280-hw1/provided_homography.jpg',
        heroImageSrc: '/projects/cs280-hw1/provided_homography.jpg',
        gitUrl: 'https://github.com/ozanbayiz/cs280-hw1',
        date: '2026-02-12'
    }
]

export const projectsData: Project[] = [...baseProjects]

projectsData.push(
    {
        collection: 'cs180',
        slug: 'cs180-proj1',
        title: 'Colorizing the Prokudin-Gorskii Photo Collection',
        shortTitle: 'Prokudin-Gorskii',
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
        title: '    Fun with Filters and Frequencies!',
        shortTitle: 'Filters and Frequencies',
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
        title: 'Face Morphing',
        shortTitle: 'Face Morphing',
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
        title: '[Auto]stitching Photo Mosaics',
        shortTitle: 'Photo Mosaics',
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
        title: 'The Power of Diffusion Models!',
        shortTitle: 'The Power of DMs',
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
        title: 'Diffusion Models from Scratch!',
        shortTitle: 'Diffusion from Scratch',
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
        title: 'Neural Radiance Field!',
        shortTitle: 'NeRF',
        description:
            'Fitting a 2D neural field and a NeRF from multi-view images, including ray generation, sampling, NeRF architecture, and volume rendering results.',
        imageUrl: '/projects/cs180/proj6/agony.jpeg',
        heroImageSrc: '/projects/cs180/proj6/agony.jpeg',
        gitUrl: 'https://github.com/ozanbayiz/cs180',
        date: '2024-12-13'
    }
)