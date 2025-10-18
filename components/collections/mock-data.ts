import type { Collection } from "./types"

export const mockFeaturedCollections: Collection[] = [
  {
    id: "featured-1",
    title: "Nolan's Mind-Bending Masterpieces",
    description:
      "A curated collection of Christopher Nolan's most cerebral and visually stunning films that challenge perception and reality.",
    creator: "Siddu Editorial",
    movieCount: 8,
    followers: 12500,
    posterImages: [
      "/inception-movie-poster.png",
      "/interstellar-poster.png",
      "/dark-knight-poster.png",
      "/oppenheimer-inspired-poster.png",
    ],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "featured-2",
    title: "Global Cinema Gems",
    description:
      "Discover extraordinary films from around the world that showcase diverse storytelling and cultural perspectives.",
    creator: "Siddu Editorial",
    movieCount: 25,
    followers: 8900,
    posterImages: [
      "/parasite-movie-poster.png",
      "/seven-samurai-poster.png",
      "/in-the-mood-for-love-poster.png",
      "/city-of-god-poster.png",
    ],
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "featured-3",
    title: "Visual Spectacles",
    description:
      "Films that push the boundaries of visual storytelling and cinematography, creating unforgettable cinematic experiences.",
    creator: "Siddu Editorial",
    movieCount: 15,
    followers: 15200,
    posterImages: [
      "/dune-part-two-poster.png",
      "/blade-runner-2049-poster.png",
      "/mad-max-fury-road-poster.png",
      "/avatar-poster.png",
    ],
    createdAt: "2024-01-05T00:00:00Z",
  },
]

export const mockPopularCollections: Collection[] = [
  {
    id: "popular-1",
    title: "Best of 2023",
    description: "The most acclaimed and talked-about films of 2023",
    creator: "MovieBuff2023",
    movieCount: 20,
    followers: 5600,
    posterImages: [
      "/oppenheimer-inspired-poster.png",
      "/barbie-movie-poster.png",
      "/killers-of-the-flower-moon-poster.png",
      "/poor-things-poster.png",
    ],
    createdAt: "2023-12-01T00:00:00Z",
  },
  {
    id: "popular-2",
    title: "Sci-Fi Essentials",
    description: "Must-watch science fiction films that define the genre",
    creator: "SciFiLover",
    movieCount: 30,
    followers: 4200,
    posterImages: ["/blade-runner-poster.png", "/matrix-poster.png", "/interstellar-poster.png", "/arrival-poster.png"],
    createdAt: "2023-11-15T00:00:00Z",
  },
  {
    id: "popular-3",
    title: "Comfort Movies",
    description: "Feel-good films perfect for a cozy night in",
    creator: "CozyVibes",
    movieCount: 18,
    followers: 3800,
    posterImages: [
      "/studio-ghibli-poster.png",
      "/paddington-poster.png",
      "/grand-budapest-hotel-poster.png",
      "/princess-bride-poster.png",
    ],
    createdAt: "2023-10-20T00:00:00Z",
  },
  {
    id: "popular-4",
    title: "Thriller Masterclass",
    description: "Edge-of-your-seat thrillers that will keep you guessing",
    creator: "ThrillerFan",
    movieCount: 22,
    followers: 6100,
    posterImages: [
      "/gone-girl-poster.png",
      "/zodiac-poster.png",
      "/prisoners-poster.png",
      "/shutter-island-poster.png",
    ],
    createdAt: "2023-09-10T00:00:00Z",
  },
]

export const mockUserCollections: Collection[] = [
  {
    id: "user-1",
    title: "My Watchlist",
    description: "Movies I need to watch soon",
    creator: "You",
    movieCount: 12,
    followers: 0,
    posterImages: [
      "/dune-part-two-poster.png",
      "/everything-everywhere-poster.png",
      "/tar-poster.png",
      "/banshees-poster.png",
    ],
    isPublic: false,
    createdAt: "2024-01-20T00:00:00Z",
  },
]
