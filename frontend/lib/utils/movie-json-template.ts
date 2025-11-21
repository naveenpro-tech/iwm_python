import type { Movie } from "@/components/admin/movies/types"

/**
 * Complete JSON template for movie import with realistic demo data
 * Based on "Inception" (2010) as example
 */
export const MOVIE_JSON_TEMPLATE: Omit<Movie, "id" | "createdAt" | "updatedAt"> = {
  // ===== TAB 1: BASIC INFO =====
  title: "Inception",
  originalTitle: "Inception",
  synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
  releaseDate: "2010-07-16",
  runtime: 148,
  status: "released",
  genres: ["Action", "Sci-Fi", "Thriller"],
  languages: ["English", "Japanese", "French"],
  sidduScore: 8.8,
  certification: "PG-13",

  // ===== TAB 2: MEDIA =====
  poster: "https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  backdrop: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
  galleryImages: [
    "https://image.tmdb.org/t/p/original/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    "https://image.tmdb.org/t/p/original/aySB4hzKLJPqYUqqnJKT3JqPxJJ.jpg",
  ],
  trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
  trailerEmbed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/YoHD9XEInc0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',

  // ===== TAB 3: CAST & CREW =====
  cast: [
    {
      id: "cast-1",
      name: "Leonardo DiCaprio",
      character: "Dom Cobb",
      image: "https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
      order: 1,
    },
    {
      id: "cast-2",
      name: "Joseph Gordon-Levitt",
      character: "Arthur",
      image: "https://image.tmdb.org/t/p/w500/z2FA8js799xqtfiFjBTicFYdfk.jpg",
      order: 2,
    },
    {
      id: "cast-3",
      name: "Elliot Page",
      character: "Ariadne",
      image: "https://image.tmdb.org/t/p/w500/eCeFgzS8Y8sDi45w3fHjorm5awH.jpg",
      order: 3,
    },
    {
      id: "cast-4",
      name: "Tom Hardy",
      character: "Eames",
      image: "https://image.tmdb.org/t/p/w500/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg",
      order: 4,
    },
    {
      id: "cast-5",
      name: "Marion Cotillard",
      character: "Mal Cobb",
      image: "https://image.tmdb.org/t/p/w500/mZF7bgx38sF3YJAMfdb4Rp4c8D5.jpg",
      order: 5,
    },
  ],
  crew: [
    {
      id: "crew-1",
      name: "Christopher Nolan",
      role: "Director",
      department: "Directing",
      image: "https://image.tmdb.org/t/p/w500/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg",
    },
    {
      id: "crew-2",
      name: "Christopher Nolan",
      role: "Writer",
      department: "Writing",
      image: "https://image.tmdb.org/t/p/w500/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg",
    },
    {
      id: "crew-3",
      name: "Emma Thomas",
      role: "Producer",
      department: "Production",
      image: "https://image.tmdb.org/t/p/w500/3dWRjXAJQTdJLMKPqJLdVOlqfmx.jpg",
    },
    {
      id: "crew-4",
      name: "Hans Zimmer",
      role: "Original Music Composer",
      department: "Music",
      image: "https://image.tmdb.org/t/p/w500/tpQnDeHY15szIXvpP0mM0YPHvKP.jpg",
    },
    {
      id: "crew-5",
      name: "Wally Pfister",
      role: "Director of Photography",
      department: "Cinematography",
      image: "https://image.tmdb.org/t/p/w500/9Kxq8VqQdpqLqFWRKhkOqGwqEhZ.jpg",
    },
  ],

  // ===== TAB 4: STREAMING =====
  streamingLinks: [
    {
      id: "stream-1",
      provider: "Netflix",
      region: "US",
      url: "https://www.netflix.com/title/70131314",
      type: "subscription",
      quality: "4K",
      verified: true,
    },
    {
      id: "stream-2",
      provider: "Amazon Prime Video",
      region: "US",
      url: "https://www.amazon.com/Inception-Leonardo-DiCaprio/dp/B0041LWR5I",
      type: "rent",
      price: "$3.99",
      quality: "HD",
      verified: true,
    },
    {
      id: "stream-3",
      provider: "HBO Max",
      region: "US",
      url: "https://www.hbomax.com/inception",
      type: "subscription",
      quality: "4K",
      verified: true,
    },
  ],
  releaseDates: [
    {
      region: "US",
      date: "2010-07-16",
      type: "Theatrical",
    },
    {
      region: "GB",
      date: "2010-07-16",
      type: "Theatrical",
    },
    {
      region: "IN",
      date: "2010-07-16",
      type: "Theatrical",
    },
  ],

  // ===== TAB 5: AWARDS =====
  awards: [
    {
      id: "award-1",
      name: "Academy Awards",
      year: 2011,
      category: "Best Cinematography",
      status: "Winner",
    },
    {
      id: "award-2",
      name: "Academy Awards",
      year: 2011,
      category: "Best Sound Editing",
      status: "Winner",
    },
    {
      id: "award-3",
      name: "Academy Awards",
      year: 2011,
      category: "Best Sound Mixing",
      status: "Winner",
    },
    {
      id: "award-4",
      name: "Academy Awards",
      year: 2011,
      category: "Best Visual Effects",
      status: "Winner",
    },
    {
      id: "award-5",
      name: "Academy Awards",
      year: 2011,
      category: "Best Picture",
      status: "Nominee",
    },
    {
      id: "award-6",
      name: "BAFTA Awards",
      year: 2011,
      category: "Best Production Design",
      status: "Winner",
    },
  ],

  // ===== TAB 6: TRIVIA =====
  trivia: [
    {
      id: "trivia-1",
      question: "How long did Christopher Nolan work on the screenplay?",
      category: "Production Detail",
      answer: "10 years",
      explanation: "Christopher Nolan spent 10 years writing the screenplay for Inception, making it one of his most meticulously crafted scripts.",
    },
    {
      id: "trivia-2",
      question: "What famous composer created the iconic 'BRAAAM' sound?",
      category: "Behind the Scenes",
      answer: "Hans Zimmer",
      explanation: "Hans Zimmer created the now-iconic deep brass sound that has been widely imitated in movie trailers since Inception's release.",
    },
    {
      id: "trivia-3",
      question: "What practical effect was used for the rotating hallway fight scene?",
      category: "Production Detail",
      answer: "A rotating corridor set",
      explanation: "The famous hallway fight scene was filmed in a rotating corridor that could spin 360 degrees, with Joseph Gordon-Levitt performing most of his own stunts.",
    },
    {
      id: "trivia-4",
      question: "What does the spinning top at the end represent?",
      category: "Cultural Reference",
      answer: "Cobb's totem to distinguish reality from dreams",
      explanation: "The ambiguous ending with the spinning top has sparked endless debates about whether Cobb is still dreaming or has returned to reality.",
    },
  ],

  // ===== TAB 7: TIMELINE =====
  timelineEvents: [
    {
      id: "timeline-1",
      title: "Production Begins",
      description: "Principal photography begins in Tokyo, Japan",
      date: "2009-06-19",
      category: "Production Start",
      mediaUrl: "https://image.tmdb.org/t/p/original/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    },
    {
      id: "timeline-2",
      title: "First Trailer Released",
      description: "The mind-bending first trailer debuts online, generating massive buzz",
      date: "2009-12-10",
      category: "Trailer Release",
    },
    {
      id: "timeline-3",
      title: "World Premiere",
      description: "Inception premieres at Leicester Square in London",
      date: "2010-07-08",
      category: "Premiere",
      mediaUrl: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    },
    {
      id: "timeline-4",
      title: "$100 Million Domestic Box Office",
      description: "Film crosses $100 million mark in North America",
      date: "2010-07-25",
      category: "Box Office Milestone",
    },
    {
      id: "timeline-5",
      title: "Academy Awards Win",
      description: "Wins 4 Oscars: Cinematography, Sound Editing, Sound Mixing, and Visual Effects",
      date: "2011-02-27",
      category: "Award Win",
      mediaUrl: "https://image.tmdb.org/t/p/original/aySB4hzKLJPqYUqqnJKT3JqPxJJ.jpg",
    },
  ],

  // ===== ADDITIONAL FIELDS =====
  isPublished: true,
  isArchived: false,
  budget: 160000000,
  boxOffice: 836800000,
  productionCompanies: ["Warner Bros. Pictures", "Legendary Pictures", "Syncopy"],
  countriesOfOrigin: ["United States", "United Kingdom"],
  tagline: "Your mind is the scene of the crime",
  keywords: ["dream", "subconscious", "heist", "reality", "mind-bending"],
  aspectRatio: "2.39:1",
  soundMix: ["Dolby Digital", "SDDS", "DTS"],
  camera: "Panavision Panaflex Millennium XL2, Panavision Primo Lenses",
  importedFrom: "JSON",
}

/**
 * Generate LLM-friendly prompt for movie data generation
 */
export function generateMoviePrompt(movieName: string): string {
  return `Generate a complete movie JSON object for "${movieName}" following this EXACT structure. Fill in ALL fields with accurate, real data for the movie. Do not omit any fields.

IMPORTANT INSTRUCTIONS:
1. Use real, accurate data for "${movieName}"
2. Include ALL fields shown in the template
3. For cast/crew, include at least 5 cast members and 5 crew members
4. For streaming links, include current availability (2025 data)
5. For awards, include all major wins and nominations
6. For trivia, include 3-5 interesting facts
7. For timeline, include 4-6 key events
8. Use proper date format: YYYY-MM-DD
9. Ensure all URLs are valid (use TMDB image URLs if available)
10. Return ONLY the JSON object, no additional text

JSON TEMPLATE:
${JSON.stringify(MOVIE_JSON_TEMPLATE, null, 2)}

Now generate the complete JSON for "${movieName}".`
}

/**
 * Generate a blank template for manual JSON creation
 */
export function generateBlankTemplate(): string {
  return JSON.stringify(MOVIE_JSON_TEMPLATE, null, 2)
}

