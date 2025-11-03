/**
 * Mock User Collections Data
 * Realistic user collections for profile page
 */

import type { UserCollection, CollectionMovie } from "@/types/profile"

// ============================================================================
// MOCK COLLECTION MOVIES
// ============================================================================

const nolanMovies: CollectionMovie[] = [
  {
    id: "nolan-1",
    title: "Inception",
    posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    year: "2010",
    genres: ["Sci-Fi", "Thriller"],
    sidduScore: 9.3,
    runtime: "148 min",
    director: "Christopher Nolan"
  },
  {
    id: "nolan-2",
    title: "The Dark Knight",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    year: "2008",
    genres: ["Action", "Crime", "Drama"],
    sidduScore: 9.5,
    runtime: "152 min",
    director: "Christopher Nolan"
  },
  {
    id: "nolan-3",
    title: "Interstellar",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    year: "2014",
    genres: ["Sci-Fi", "Drama"],
    sidduScore: 9.2,
    runtime: "169 min",
    director: "Christopher Nolan"
  },
  {
    id: "nolan-4",
    title: "Oppenheimer",
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    year: "2023",
    genres: ["Biography", "Drama", "History"],
    sidduScore: 9.4,
    runtime: "180 min",
    director: "Christopher Nolan"
  }
]

const sciFiMovies: CollectionMovie[] = [
  {
    id: "scifi-1",
    title: "Blade Runner 2049",
    posterUrl: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    year: "2017",
    genres: ["Sci-Fi", "Thriller"],
    sidduScore: 9.1,
    runtime: "164 min",
    director: "Denis Villeneuve"
  },
  {
    id: "scifi-2",
    title: "Dune",
    posterUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    year: "2021",
    genres: ["Sci-Fi", "Adventure"],
    sidduScore: 9.0,
    runtime: "155 min",
    director: "Denis Villeneuve"
  },
  {
    id: "scifi-3",
    title: "Arrival",
    posterUrl: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    year: "2016",
    genres: ["Sci-Fi", "Drama"],
    sidduScore: 8.8,
    runtime: "116 min",
    director: "Denis Villeneuve"
  },
  {
    id: "scifi-4",
    title: "Ex Machina",
    posterUrl: "https://image.tmdb.org/t/p/w500/9goPE2IoMIXxTLWzl7aizwuIiLh.jpg",
    year: "2014",
    genres: ["Sci-Fi", "Thriller"],
    sidduScore: 8.7,
    runtime: "108 min",
    director: "Alex Garland"
  }
]

const classicMovies: CollectionMovie[] = [
  {
    id: "classic-1",
    title: "The Shawshank Redemption",
    posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    year: "1994",
    genres: ["Drama"],
    sidduScore: 9.8,
    runtime: "142 min",
    director: "Frank Darabont"
  },
  {
    id: "classic-2",
    title: "The Godfather",
    posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    year: "1972",
    genres: ["Crime", "Drama"],
    sidduScore: 9.7,
    runtime: "175 min",
    director: "Francis Ford Coppola"
  },
  {
    id: "classic-3",
    title: "Pulp Fiction",
    posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    year: "1994",
    genres: ["Crime", "Drama"],
    sidduScore: 9.5,
    runtime: "154 min",
    director: "Quentin Tarantino"
  }
]

const horrorMovies: CollectionMovie[] = [
  {
    id: "horror-1",
    title: "The Shining",
    posterUrl: "https://image.tmdb.org/t/p/w500/xazWoLealQwEgqZ89MLZklLZD3k.jpg",
    year: "1980",
    genres: ["Horror", "Thriller"],
    sidduScore: 9.0,
    runtime: "146 min",
    director: "Stanley Kubrick"
  },
  {
    id: "horror-2",
    title: "Hereditary",
    posterUrl: "https://image.tmdb.org/t/p/w500/p9fmuz2Oj3HtFJOHKOHAIw1fJkB.jpg",
    year: "2018",
    genres: ["Horror", "Drama"],
    sidduScore: 8.6,
    runtime: "127 min",
    director: "Ari Aster"
  }
]

const animeMovies: CollectionMovie[] = [
  {
    id: "anime-1",
    title: "Spirited Away",
    posterUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    year: "2001",
    genres: ["Animation", "Fantasy"],
    sidduScore: 9.4,
    runtime: "125 min",
    director: "Hayao Miyazaki"
  },
  {
    id: "anime-2",
    title: "Your Name",
    posterUrl: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
    year: "2016",
    genres: ["Animation", "Romance"],
    sidduScore: 9.2,
    runtime: "106 min",
    director: "Makoto Shinkai"
  },
  {
    id: "anime-3",
    title: "Princess Mononoke",
    posterUrl: "https://image.tmdb.org/t/p/w500/jHWmNr7m544fJ8eItsfNk8fs2Ed.jpg",
    year: "1997",
    genres: ["Animation", "Adventure"],
    sidduScore: 9.1,
    runtime: "134 min",
    director: "Hayao Miyazaki"
  }
]

const awardWinners: CollectionMovie[] = [
  {
    id: "award-1",
    title: "Parasite",
    posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    year: "2019",
    genres: ["Thriller", "Drama"],
    sidduScore: 9.6,
    runtime: "132 min",
    director: "Bong Joon-ho"
  },
  {
    id: "award-2",
    title: "Everything Everywhere All at Once",
    posterUrl: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    year: "2022",
    genres: ["Sci-Fi", "Comedy"],
    sidduScore: 9.3,
    runtime: "139 min",
    director: "Daniels"
  },
  {
    id: "award-3",
    title: "Oppenheimer",
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    year: "2023",
    genres: ["Biography", "Drama"],
    sidduScore: 9.4,
    runtime: "180 min",
    director: "Christopher Nolan"
  }
]

// ============================================================================
// MOCK USER COLLECTIONS
// ============================================================================

export const mockUserCollections: UserCollection[] = [
  {
    id: "collection-1",
    title: "Nolan Masterpieces",
    description: "Christopher Nolan's mind-bending films that redefined modern cinema",
    coverImage: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    movieCount: 4,
    isPublic: false,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    movies: nolanMovies,
    tags: ["director", "thriller", "sci-fi"]
  },
  {
    id: "collection-2",
    title: "Sci-Fi Gems",
    description: "The best science fiction films of the last decade",
    coverImage: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    movieCount: 4,
    isPublic: true,
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-10T16:20:00Z",
    movies: sciFiMovies,
    tags: ["sci-fi", "future", "space"]
  },
  {
    id: "collection-3",
    title: "90s Classics",
    description: "Timeless masterpieces from the golden era of cinema",
    coverImage: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    movieCount: 3,
    isPublic: true,
    createdAt: "2023-12-10T11:15:00Z",
    updatedAt: "2024-01-05T13:30:00Z",
    movies: classicMovies,
    tags: ["classic", "90s", "drama"]
  },
  {
    id: "collection-4",
    title: "Horror Fest",
    description: "Spine-chilling horror films for late-night viewing",
    coverImage: "https://image.tmdb.org/t/p/w500/xazWoLealQwEgqZ89MLZklLZD3k.jpg",
    movieCount: 2,
    isPublic: false,
    createdAt: "2024-03-01T20:00:00Z",
    updatedAt: "2024-03-05T22:15:00Z",
    movies: horrorMovies,
    tags: ["horror", "thriller", "scary"]
  },
  {
    id: "collection-5",
    title: "Anime Movies",
    description: "Beautiful animated films from Japan's greatest directors",
    coverImage: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    movieCount: 3,
    isPublic: true,
    createdAt: "2024-02-20T15:30:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
    movies: animeMovies,
    tags: ["anime", "animation", "japan"]
  },
  {
    id: "collection-6",
    title: "Award Winners",
    description: "Oscar-winning films that made history",
    coverImage: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    movieCount: 3,
    isPublic: true,
    createdAt: "2024-01-01T12:00:00Z",
    updatedAt: "2024-03-10T18:45:00Z",
    movies: awardWinners,
    tags: ["oscar", "awards", "best-picture"]
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getUserCollections = async (): Promise<UserCollection[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockUserCollections
}

export const getCollectionById = async (id: string): Promise<UserCollection | null> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockUserCollections.find(c => c.id === id) || null
}

export const createCollection = async (data: Partial<UserCollection>): Promise<UserCollection> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const newCollection: UserCollection = {
    id: `collection-${Date.now()}`,
    title: data.title || "Untitled Collection",
    description: data.description || "",
    coverImage: data.movies?.[0]?.posterUrl || "",
    movieCount: data.movies?.length || 0,
    isPublic: data.isPublic ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    movies: data.movies || [],
    tags: data.tags || []
  }
  return newCollection
}

export const updateCollection = async (id: string, data: Partial<UserCollection>): Promise<UserCollection> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const existing = mockUserCollections.find(c => c.id === id)
  if (!existing) throw new Error("Collection not found")
  
  return {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString()
  }
}

export const deleteCollection = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return true
}

