import type { CriticRecommendation } from "@/types/critic"

export function generateMockRecommendations(criticUsername: string): CriticRecommendation[] {
  const baseRecommendations: CriticRecommendation[] = [
    {
      id: 1,
      critic_id: 1,
      movie_id: 101,
      recommendation_note: "A must-see for its groundbreaking cinematography and mind-bending narrative. Nolan at his finest.",
      badge_type: "masterpiece",
      created_at: "2025-10-20T10:00:00Z",
      movie: {
        id: 101,
        external_id: "tt1375666",
        title: "Inception",
        poster_url: "/inception-movie-poster.png",
        year: "2010",
        genre: ["Sci-Fi", "Thriller", "Action"],
        imdb_rating: 8.8,
      },
    },
    {
      id: 2,
      critic_id: 1,
      movie_id: 102,
      recommendation_note: "An underrated gem that deserves more recognition. Brilliant performances and a gripping story.",
      badge_type: "underrated",
      created_at: "2025-10-18T14:30:00Z",
      movie: {
        id: 102,
        external_id: "tt0405094",
        title: "The Lives of Others",
        poster_url: "/lives-of-others-poster.png",
        year: "2006",
        genre: ["Drama", "Thriller"],
        imdb_rating: 8.4,
      },
    },
    {
      id: 3,
      critic_id: 1,
      movie_id: 103,
      recommendation_note: "A hidden gem from the 90s. If you love psychological thrillers, this is a must-watch.",
      badge_type: "hidden_gem",
      created_at: "2025-10-15T16:00:00Z",
      movie: {
        id: 103,
        external_id: "tt0114369",
        title: "Se7en",
        poster_url: "/se7en-poster.png",
        year: "1995",
        genre: ["Crime", "Drama", "Mystery"],
        imdb_rating: 8.6,
      },
    },
    {
      id: 4,
      critic_id: 1,
      movie_id: 104,
      recommendation_note: "Timeless classic that every film lover should experience. Perfect storytelling and direction.",
      badge_type: "classic_must_watch",
      created_at: "2025-10-12T12:00:00Z",
      movie: {
        id: 104,
        external_id: "tt0050083",
        title: "12 Angry Men",
        poster_url: "/12-angry-men-poster.png",
        year: "1957",
        genre: ["Drama", "Crime"],
        imdb_rating: 9.0,
      },
    },
    {
      id: 5,
      critic_id: 1,
      movie_id: 105,
      recommendation_note: "Highly recommended for its innovative storytelling and stunning visuals. A modern masterpiece.",
      badge_type: "highly_recommended",
      created_at: "2025-10-10T09:00:00Z",
      movie: {
        id: 105,
        external_id: "tt0816692",
        title: "Interstellar",
        poster_url: "/interstellar-poster.png",
        year: "2014",
        genre: ["Sci-Fi", "Drama", "Adventure"],
        imdb_rating: 8.7,
      },
    },
    {
      id: 6,
      critic_id: 1,
      movie_id: 106,
      recommendation_note: "A masterclass in tension and atmosphere. Villeneuve's best work to date.",
      badge_type: "masterpiece",
      created_at: "2025-10-08T11:30:00Z",
      movie: {
        id: 106,
        external_id: "tt1160419",
        title: "Dune",
        poster_url: "/dune-poster.png",
        year: "2021",
        genre: ["Sci-Fi", "Adventure", "Drama"],
        imdb_rating: 8.0,
      },
    },
    {
      id: 7,
      critic_id: 1,
      movie_id: 107,
      recommendation_note: "Underrated psychological thriller with incredible performances. Don't miss this one.",
      badge_type: "underrated",
      created_at: "2025-10-05T15:00:00Z",
      movie: {
        id: 107,
        external_id: "tt0469494",
        title: "There Will Be Blood",
        poster_url: "/there-will-be-blood-poster.png",
        year: "2007",
        genre: ["Drama"],
        imdb_rating: 8.2,
      },
    },
    {
      id: 8,
      critic_id: 1,
      movie_id: 108,
      recommendation_note: "Hidden gem from Korean cinema. Beautifully crafted and emotionally powerful.",
      badge_type: "hidden_gem",
      created_at: "2025-10-03T13:00:00Z",
      movie: {
        id: 108,
        external_id: "tt0364569",
        title: "Oldboy",
        poster_url: "/oldboy-poster.png",
        year: "2003",
        genre: ["Action", "Drama", "Mystery"],
        imdb_rating: 8.4,
      },
    },
    {
      id: 9,
      critic_id: 1,
      movie_id: 109,
      recommendation_note: "Classic noir that defined a genre. Essential viewing for any film student.",
      badge_type: "classic_must_watch",
      created_at: "2025-10-01T10:00:00Z",
      movie: {
        id: 109,
        external_id: "tt0041959",
        title: "The Third Man",
        poster_url: "/third-man-poster.png",
        year: "1949",
        genre: ["Film-Noir", "Mystery", "Thriller"],
        imdb_rating: 8.1,
      },
    },
    {
      id: 10,
      critic_id: 1,
      movie_id: 110,
      recommendation_note: "Highly recommended for its brilliant direction and unforgettable performances.",
      badge_type: "highly_recommended",
      created_at: "2025-09-28T14:00:00Z",
      movie: {
        id: 110,
        external_id: "tt0110912",
        title: "Pulp Fiction",
        poster_url: "/pulp-fiction-poster.png",
        year: "1994",
        genre: ["Crime", "Drama"],
        imdb_rating: 8.9,
      },
    },
    {
      id: 11,
      critic_id: 1,
      movie_id: 111,
      recommendation_note: "A masterpiece of visual storytelling. Every frame is a painting.",
      badge_type: "masterpiece",
      created_at: "2025-09-25T16:30:00Z",
      movie: {
        id: 111,
        external_id: "tt0083658",
        title: "Blade Runner",
        poster_url: "/blade-runner-poster.png",
        year: "1982",
        genre: ["Sci-Fi", "Thriller"],
        imdb_rating: 8.1,
      },
    },
    {
      id: 12,
      critic_id: 1,
      movie_id: 112,
      recommendation_note: "Underrated gem that explores complex themes with nuance and depth.",
      badge_type: "underrated",
      created_at: "2025-09-22T11:00:00Z",
      movie: {
        id: 112,
        external_id: "tt0477348",
        title: "No Country for Old Men",
        poster_url: "/no-country-poster.png",
        year: "2007",
        genre: ["Crime", "Drama", "Thriller"],
        imdb_rating: 8.2,
      },
    },
  ]

  return baseRecommendations
}

export function getBadgeLabel(badgeType: CriticRecommendation["badge_type"]): string {
  const labels: Record<CriticRecommendation["badge_type"], string> = {
    highly_recommended: "Highly Recommended",
    hidden_gem: "Hidden Gem",
    classic_must_watch: "Classic Must-Watch",
    underrated: "Underrated",
    masterpiece: "Masterpiece",
  }
  return labels[badgeType]
}

export function getBadgeColor(badgeType: CriticRecommendation["badge_type"]): string {
  const colors: Record<CriticRecommendation["badge_type"], string> = {
    highly_recommended: "#00BFFF", // Cyan
    hidden_gem: "#FFD700", // Gold
    classic_must_watch: "#8B5CF6", // Purple
    underrated: "#10B981", // Green
    masterpiece: "#EC4899", // Pink
  }
  return colors[badgeType]
}

