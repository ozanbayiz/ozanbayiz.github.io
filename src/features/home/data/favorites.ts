export type FavoriteItem = {
    title: string
    year: string
    creator: string
    cover: string
    note: string
}

export type FavoriteCategory = {
    title: string
    description?: string
    items: FavoriteItem[]
}

export const favoritesData: FavoriteCategory[] = [
    {
        title: 'Movies',
        description: 'I don\'t watch many movies these days but here are some that I really liked.',
        items: [
            {
                title: 'West Beirut',
                year: '1998',
                creator: 'Ziad Doueiri',
                cover: '/covers/movies/west-beirut.webp',
                note: ''
            },
            {
                title: 'The Seventh Seal',
                year: '1957',
                creator: 'Ingmar Bergman',
                cover: '/covers/movies/the-seventh-seal.webp',
                note: ''
            },
            {
                title: 'The Color of Pomegranates',
                year: '1969',
                creator: 'Sergei Parajanov',
                cover: '/covers/movies/the-color-of-pomegranates.webp',
                note: ''
            },
            {
                title: 'In July',
                year: '2000',
                creator: 'Fatih Akin',
                cover: '/covers/movies/in-july.webp',
                note: ''
            },
            {
                title: 'Fallen Angels',
                year: '1995',
                creator: 'Wong Kar-wai',
                cover: '/covers/movies/fallen-angels-1995.webp',
                note: ''
            },
            {
                title: 'Distant',
                year: '2002',
                creator: 'Nuri Bilge Ceylan',
                cover: '/covers/movies/distant.webp',
                note: ''
            },
            {
                title: 'Brazil',
                year: '1985',
                creator: 'Terry Gilliam',
                cover: '/covers/movies/brazil-1985.webp',
                note: ''
            },
            {
                title: 'Andrei Rublev',
                year: '1966',
                creator: 'Andrei Tarkovsky',
                cover: '/covers/movies/andrei-roublev.webp',
                note: 'This is one of the first movies I watched in BAMPFA in summer 2025; I\'d recommmend watching it in a physically comfortable setting.'
            },
            {
                title: 'Amélie',
                year: '2001',
                creator: 'Jean-Pierre Jeunet',
                cover: '/covers/movies/amelie.webp',
                note: ''
            }
        ]
    },
    {
        title: 'Music',
        description: '& here are some albums I\'ve come to like over the years.',
        items: [
            {
                title: 'Live Through This',
                year: '1994',
                creator: 'Hole',
                cover: '/covers/music/hole-live-through-this.webp',
                note: 'The politics get complicated but I really like this album'
            },
            {
                title: 'Girl with Fish',
                year: '2023',
                creator: 'Feeble Little Horse',
                cover: '/covers/music/feeble-little-horse-girl-with-fish.webp',
                note: 'This one sounds cool, i\'m not really sure how else to put it.'
            },
            {
                title: 'Belki Alışman Lazım',
                year: '2002',
                creator: 'Duman',
                cover: '/covers/music/duman-belki-alisman-lazim.webp',
                note: 'My mom used to play this in the car when I was really really small'
            },
            {
                title: 'Frank',
                year: '2003',
                creator: 'Amy Winehouse',
                cover: '/covers/music/amy-winehouse-frank.webp',
                note: ''
            },
            {
                title: 'Star',
                year: '1999',
                creator: '702',
                cover: '/covers/music/702-star.webp',
                note: 'Summer 2024: long drives to SDSC and back. Sometimes while cooking steak'
            },
            {
                title: 'Dots and Loops',
                year: '1997',
                creator: 'Stereolab',
                cover: '/covers/music/stereolab-dots-and-loops.webp',
                note: 'I have a story about this album and my ex-roommate\'s cat pillow (Hi Bobbo!)'
            },
            {
                title: 'Serçe',
                year: '1978',
                creator: 'Sezen Aksu',
                cover: '/covers/music/sezen-aksu-serce.webp',
                note: ''
            },
            {
                title: 'In My Mind',
                year: '2006',
                creator: 'Pharrell',
                cover: '/covers/music/pharrell-in-my-mind.webp',
                note: ''
            },
            {
                title: 'You Think It\'s Like This But It\'s Really Like This',
                year: '2000',
                creator: 'Mirah',
                cover: '/covers/music/mirah-you-think-its-like-this-but-its-really-like-this.webp',
                note: 'I first listened to this album in a bathroom in Amsterdam and it\'s sort of stuck with me since then. These days it\'s best suited for late night showers.'
            },
            {
                title: 'Orgonon',
                year: '1996',
                creator: 'Laila France',
                cover: '/covers/music/laila-france-orgonon.webp',
                note: ''
            },
            {
                title: 'Beats and Breaks from the Flower Patch',
                year: '1998',
                creator: 'Kitty Craft',
                cover: '/covers/music/kitty-craft-beats-and-breaks-from-the-flower-patch.webp',
                note: ''
            },
            {
                title: 'Désormais',
                year: '2001',
                creator: 'Julie Doiron',
                cover: '/covers/music/julie-doiron-desormais.webp',
                note: ''
            },
            {
                title: 'Asha Puthli',
                year: '1973',
                creator: 'Asha Puthli',
                cover: '/covers/music/asha-puthli-asha-puthli.webp',
                note: 'I love a self-titled; this was what I listened to on the way to Safeway and stuff'
            }
        ]
    }
]
