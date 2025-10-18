import type { FavoriteItem } from "./types"

export const mockFavorites: FavoriteItem[] = [
  {
    id: "movie-inception",
    title: "Inception",
    type: "movie",
    imageUrl: "/inception-movie-poster.png",
    addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    releaseYear: 2010,
    userRating: 9,
    genres: ["Sci-Fi", "Action", "Thriller"],
  },
  {
    id: "person-nolan",
    title: "Christopher Nolan",
    type: "person",
    imageUrl: "/christopher-nolan.png",
    addedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "tv-got",
    title: "Game of Thrones",
    type: "tv-show",
    imageUrl: "/placeholder.svg?text=Game+of+Thrones",
    addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    releaseYear: 2011,
    userRating: 8,
    genres: ["Fantasy", "Drama", "Adventure"],
  },
  {
    id: "scene-dk-interrogation",
    title: "Dark Knight Interrogation Scene",
    type: "scene",
    imageUrl: "/placeholder.svg?text=DK+Interrogation",
    addedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: "article-future-cinema",
    title: "The Future of Cinema in AI Era",
    type: "article",
    imageUrl: "/placeholder.svg?text=Future+Cinema",
    addedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
  },
  {
    id: "movie-interstellar",
    title: "Interstellar",
    type: "movie",
    imageUrl: "/interstellar-poster.png",
    addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    releaseYear: 2014,
    userRating: 9.5,
    genres: ["Sci-Fi", "Drama", "Adventure"],
  },
  {
    id: "movie-parasite",
    title: "Parasite",
    type: "movie",
    imageUrl: "/parasite-movie-poster.png",
    addedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    releaseYear: 2019,
    userRating: 9,
    genres: ["Thriller", "Drama", "Comedy"],
  },
]
