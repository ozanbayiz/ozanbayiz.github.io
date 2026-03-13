export type FavoriteItem = {
    title: string
    year: string
    creator: string
    cover: string
    note: string
}

export type FavoriteCategory = {
    title: string
    items: FavoriteItem[]
}

export const favoritesData: FavoriteCategory[] = [
    {
        title: 'Movies',
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
                note: ''
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
        items: [
            {
                title: 'Live Through This',
                year: '1994',
                creator: 'Hole',
                cover: '/covers/music/hole-live-through-this.webp',
                note: ''
            },
            {
                title: 'Girl with Fish',
                year: '2023',
                creator: 'Feeble Little Horse',
                cover: '/covers/music/feeble-little-horse-girl-with-fish.webp',
                note: ''
            },
            {
                title: 'Belki Alışman Lazım',
                year: '2002',
                creator: 'Duman',
                cover: '/covers/music/duman-belki-alisman-lazim.webp',
                note: ''
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
                note: ''
            },
            {
                title: 'Dots and Loops',
                year: '1997',
                creator: 'Stereolab',
                cover: '/covers/music/stereolab-dots-and-loops.webp',
                note: ''
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
                note: ''
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
                note: ''
            },
            {
                title: 'Windswept Adan',
                year: '2020',
                creator: 'Ichiko Aoba',
                cover: '/covers/music/ichiko-aoba-windswept-adan.webp',
                note: ''
            },
            {
                title: 'Like the Linen',
                year: '2005',
                creator: 'Thao',
                cover: '/covers/music/thao-like-the-linen.webp',
                note: ''
            },
            {
                title: 'Hayat..',
                year: '2001',
                creator: 'Sakin',
                cover: '/covers/music/sakin-hayat.webp',
                note: ''
            },
            {
                title: 'Come Get It!',
                year: '1978',
                creator: 'Rick James',
                cover: '/covers/music/rick-james-come-get-it.webp',
                note: ''
            },
            {
                title: 'Ampersands',
                year: '2020',
                creator: 'Mei Ehara',
                cover: '/covers/music/mei-ehara-ampersands.webp',
                note: ''
            },
            {
                title: 'Feet of Mud',
                year: '2007',
                creator: 'Ivy Knight',
                cover: '/covers/music/ivy-knight-feet-of-mud.webp',
                note: ''
            }
        ]
    }
]
