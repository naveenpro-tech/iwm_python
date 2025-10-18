import type { Movie } from "@/types"

const generateId = () => Math.random().toString(36).substring(2, 10)

export interface MovieFiltersState {
  status: string
  genre: string
  year: string
}

export let mockMoviesData: Movie[] = [
  {
    id: "1",
    title: "Inception",
    originalTitle: "Inception",
    poster: "/inception-movie-poster.png",
    backdrop: "/dark-blue-city-skyline.png",
    sidduScore: 9.2,
    releaseDate: "2010-07-16",
    status: "released",
    genres: ["Action", "Sci-Fi", "Thriller"],
    synopsis: "A thief who steals information by entering people's dreams...",
    runtime: 148,
    languages: ["English"],
    certification: "PG-13",
    cast: [
      { id: "c1", name: "Leonardo DiCaprio", character: "Cobb", image: "/leonardo-dicaprio.png", order: 1 },
      { id: "c2", name: "Joseph Gordon-Levitt", character: "Arthur", image: "/joseph-gordon-levitt.png", order: 2 },
    ],
    crew: [
      {
        id: "cr1",
        name: "Christopher Nolan",
        role: "Director",
        department: "Directing",
        image: "/christopher-nolan.png",
      },
      { id: "cr2", name: "Emma Thomas", role: "Producer", department: "Production", image: "/emma-thomas.png" },
    ],
    galleryImages: ["/inception-scene-thumbnail.png", "/inception-scene-2.png"],
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    trailerEmbed:
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/YoHD9XEInc0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    streamingLinks: [
      {
        id: "s1",
        provider: "Netflix",
        region: "US",
        url: "https://netflix.com/inception",
        type: "subscription",
        quality: "HD",
        verified: true,
      },
    ],
    releaseDates: [
      { id: "rd1", region: "US", date: "2010-07-16", type: "Theatrical" },
      { id: "rd2", region: "US", date: "2010-12-07", type: "Physical" },
    ],
    awards: [
      { id: "aw1", name: "Academy Awards", year: 2011, category: "Best Cinematography", status: "Winner" },
      { id: "aw2", name: "Academy Awards", year: 2011, category: "Best Picture", status: "Nominee" },
    ],
    trivia: [
      {
        id: "tr1",
        question: "What is the significance of the spinning top?",
        category: "Symbolism",
        answer: "It's Cobb's totem to distinguish dream from reality.",
        explanation: "If it keeps spinning, he's in a dream.",
      },
      {
        id: "tr2",
        question: "How many levels of dreams are explored in the main heist?",
        category: "Plot Detail",
        answer: "Three levels within the primary dream, plus Limbo.",
        explanation: "Van level, Hotel level, Snow Fortress level.",
      },
    ],
    timelineEvents: [
      {
        id: "te1",
        title: "Principal Photography Begins",
        description: "Filming started in Tokyo.",
        date: "2009-06-19",
        category: "Production Start",
        mediaUrl: "/inception-filming-start.png",
      },
      {
        id: "te2",
        title: "World Premiere",
        description: "Premiered in London.",
        date: "2010-07-08",
        category: "Premiere",
        mediaUrl: "/inception-premiere.png",
      },
    ],
    isPublished: true,
    isArchived: false,
    budget: 160000000,
    boxOffice: 829895144,
    productionCompanies: ["Warner Bros.", "Legendary Pictures", "Syncopy"],
    countriesOfOrigin: ["United States", "United Kingdom"],
    tagline: "Your mind is the scene of the crime.",
    keywords: ["dream", "heist", "subconscious", "sci-fi"],
    aspectRatio: "2.39:1",
    soundMix: ["Dolby Digital", "DTS", "SDDS"],
    camera: "Panavision Panaflex Millennium XL2",
    createdAt: "2010-01-01T00:00:00Z",
    updatedAt: "2023-10-01T00:00:00Z",
    importedFrom: "Manual",
  },
  {
    id: "2",
    title: "Oppenheimer",
    originalTitle: "Oppenheimer",
    poster: "/oppenheimer-inspired-poster.png",
    backdrop: "/oppenheimer-backdrop.png",
    sidduScore: 8.8,
    releaseDate: "2023-07-21",
    status: "released",
    genres: ["Biography", "Drama", "History"],
    synopsis:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    runtime: 180,
    languages: ["English"],
    certification: "R",
    cast: [
      {
        id: "c3",
        name: "Cillian Murphy",
        character: "J. Robert Oppenheimer",
        image: "/cillian-murphy-portrait.png",
        order: 1,
      },
    ],
    crew: [
      {
        id: "cr3",
        name: "Christopher Nolan",
        role: "Director",
        department: "Directing",
        image: "/christopher-nolan.png",
      },
    ],
    galleryImages: ["/oppenheimer-movie-review.png"],
    trailerEmbed: "",
    trailerUrl: "",
    streamingLinks: [],
    releaseDates: [{ id: "rd3", region: "US", date: "2023-07-21", type: "Theatrical" }],
    awards: [],
    trivia: [
      {
        id: "tr3",
        question: "What was the codename for the project Oppenheimer led?",
        category: "Historical Fact",
        answer: "The Manhattan Project.",
      },
    ],
    timelineEvents: [
      {
        id: "te3",
        title: "Official Trailer Release",
        description: "The first full trailer for Oppenheimer was released.",
        date: "2022-12-18",
        category: "Trailer Release",
      },
    ],
    isPublished: true,
    isArchived: false,
    budget: 0,
    boxOffice: 0,
    productionCompanies: [],
    countriesOfOrigin: [],
    tagline: "",
    keywords: [],
    aspectRatio: "1.85:1",
    soundMix: [],
    camera: "",
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2023-09-15T00:00:00Z",
    importedFrom: "TMDB",
  },
  {
    id: "3",
    title: "The Dark Knight",
    originalTitle: "The Dark Knight",
    poster: "/dark-knight-movie-poster.png",
    backdrop: "/gotham-city-skyline.png",
    sidduScore: 9.0,
    releaseDate: "2008-07-18",
    status: "released",
    genres: ["Action", "Crime", "Drama"],
    synopsis:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    runtime: 152,
    languages: ["English", "Mandarin"],
    certification: "PG-13",
    cast: [
      {
        id: "talent-10",
        name: "Christian Bale",
        character: "Bruce Wayne / Batman",
        image: "/christian-bale.png",
        order: 1,
      },
      { id: "talent-11", name: "Heath Ledger", character: "Joker", image: "/heath-ledger.png", order: 2 },
      {
        id: "talent-12",
        name: "Aaron Eckhart",
        character: "Harvey Dent / Two-Face",
        image: "/aaron-eckhart.png",
        order: 3,
      },
    ],
    crew: [
      {
        id: "talent-5",
        name: "Christopher Nolan",
        role: "Director",
        department: "Directing",
        image: "/christopher-nolan.png",
      },
      {
        id: "talent-5",
        name: "Christopher Nolan",
        role: "Writer",
        department: "Writing",
        image: "/christopher-nolan.png",
      },
      { id: "talent-13", name: "Jonathan Nolan", role: "Writer", department: "Writing", image: "/jonathan-nolan.png" },
    ],
    galleryImages: ["/dark-knight-scene-1.png", "/dark-knight-scene-2.png"],
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwE",
    trailerEmbed:
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/EXeTwQWrcwE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    streamingLinks: [
      { id: "sl5", provider: "Netflix", region: "US", url: "#", type: "subscription", quality: "4K", verified: true },
      {
        id: "sl6",
        provider: "Amazon Prime Video",
        region: "US",
        url: "#",
        type: "rent",
        price: "$4.99",
        quality: "4K",
        verified: true,
      },
    ],
    releaseDates: [
      { region: "US", date: "2008-07-18", type: "Theatrical" },
      { region: "UK", date: "2008-07-24", type: "Theatrical" },
    ],
    awards: [
      { id: "award-5", name: "Academy Award", year: 2009, category: "Best Supporting Actor", status: "Winner" },
      { id: "award-6", name: "Academy Award", year: 2009, category: "Best Sound Editing", status: "Winner" },
    ],
    isPublished: true,
    isArchived: false,
    budget: 185000000,
    boxOffice: 1004934033,
    productionCompanies: ["Warner Bros.", "Legendary Pictures", "Syncopy"],
    countriesOfOrigin: ["United States", "United Kingdom"],
    tagline: "Why so serious?",
    keywords: ["batman", "joker", "crime", "chaos"],
    aspectRatio: "2.39:1",
    soundMix: ["Dolby Digital", "DTS", "SDDS", "IMAX 6-Track"],
    camera: "Panavision Cameras and Lenses",
    createdAt: "2008-07-01T10:00:00Z",
    updatedAt: "2023-10-15T16:00:00Z",
    importedFrom: "Manual",
  },
  // Add more mock movies with trivia and timelineEvents
]

export const getMockMovies = async (
  page = 1,
  limit = 10,
  filters?: Partial<MovieFiltersState>,
  sort?: { key: keyof Movie; direction: "asc" | "desc" },
): Promise<{ movies: Movie[]; total: number }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filtered = [...mockMoviesData]

  // Apply filters (simplified for mock)
  if (filters?.status && filters.status !== "all") {
    filtered = filtered.filter((m) => m.status === filters.status)
  }
  if (filters?.genre && filters.genre !== "all") {
    filtered = filtered.filter((m) => m.genres.includes(filters.genre as any))
  }
  if (filters?.year && filters.year !== "all") {
    filtered = filtered.filter((m) => m.releaseDate && m.releaseDate.startsWith(filters.year as string))
  }

  // Apply sorting (simplified for mock)
  if (sort) {
    filtered.sort((a, b) => {
      const aVal = a[sort.key]
      const bVal = b[sort.key]
      if (aVal === undefined || bVal === undefined) return 0
      if (aVal < bVal) return sort.direction === "asc" ? -1 : 1
      if (aVal > bVal) return sort.direction === "asc" ? 1 : -1
      return 0
    })
  }

  const total = filtered.length
  const paginatedMovies = filtered.slice((page - 1) * limit, page * limit)
  return { movies: paginatedMovies, total }
}

export const getMockMovieById = async (id: string): Promise<Movie | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockMoviesData.find((movie) => movie.id === id)
}

export const addMockMovie = async (movieData: Omit<Movie, "id" | "createdAt" | "updatedAt">): Promise<Movie> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const newMovie: Movie = {
    ...movieData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Ensure all fields are present, even if empty arrays for optional array types
    originalTitle: movieData.originalTitle || movieData.title,
    poster: movieData.poster || "/new-movie-poster.png",
    backdrop: movieData.backdrop || "/placeholder.svg?height=1080&width=1920",
    sidduScore: movieData.sidduScore || 0,
    releaseDate: movieData.releaseDate || new Date().toISOString().split("T")[0],
    genres: movieData.genres || [],
    synopsis: movieData.synopsis || "",
    runtime: movieData.runtime || 0,
    languages: movieData.languages || [],
    certification: movieData.certification || "Unrated",
    cast: movieData.cast || [],
    crew: movieData.crew || [],
    galleryImages: movieData.galleryImages || [],
    trailerUrl: movieData.trailerUrl || "",
    trailerEmbed: movieData.trailerEmbed || "",
    streamingLinks: movieData.streamingLinks || [],
    releaseDates: movieData.releaseDates || [],
    awards: movieData.awards || [],
    trivia: movieData.trivia || [],
    timelineEvents: movieData.timelineEvents || [],
    isPublished: movieData.isPublished !== undefined ? movieData.isPublished : false,
    isArchived: movieData.isArchived !== undefined ? movieData.isArchived : false,
    importedFrom: movieData.importedFrom || "Manual",
  }
  mockMoviesData.push(newMovie)
  return newMovie
}

export const updateMockMovie = async (updatedMovieData: Movie): Promise<Movie> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const index = mockMoviesData.findIndex((movie) => movie.id === updatedMovieData.id)
  if (index !== -1) {
    mockMoviesData[index] = { ...updatedMovieData, updatedAt: new Date().toISOString() }
    return mockMoviesData[index]
  }
  throw new Error("Movie not found for update")
}

export const deleteMockMovie = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  mockMoviesData = mockMoviesData.filter((movie) => movie.id !== id)
}
