export interface DraftReview {
  id: string
  movieId: string
  movieTitle: string
  movieYear: number
  moviePoster: string
  rating: string
  ratingNumeric: number
  ratingBreakdown: { category: string; score: number }[]
  youtubeVideoId: string | null
  writtenContent: string
  images: { url: string; caption: string }[]
  whereToWatch: { platform: string; logo: string; link: string; price?: string }[]
  tags: string[]
  spoilerWarning: boolean
  lastSaved: string
  progress: number // 0-100
}

export function generateMockDrafts(): DraftReview[] {
  return [
    {
      id: "draft-1",
      movieId: "tt0468569",
      movieTitle: "The Dark Knight",
      movieYear: 2008,
      moviePoster: "/dark-knight-poster.png",
      rating: "A",
      ratingNumeric: 9.0,
      ratingBreakdown: [
        { category: "Story", score: 9 },
        { category: "Acting", score: 10 },
        { category: "Direction", score: 9 },
        { category: "Cinematography", score: 9 },
        { category: "Music", score: 8 },
        { category: "Overall", score: 9 },
      ],
      youtubeVideoId: null,
      writtenContent: "<h2>A Masterclass in Superhero Cinema</h2><p>Christopher Nolan's The Dark Knight transcends the superhero genre...</p>",
      images: [],
      whereToWatch: [
        {
          platform: "Netflix",
          logo: "/netflix-logo.png",
          link: "https://netflix.com",
        },
      ],
      tags: ["Action", "Crime", "Drama", "Superhero"],
      spoilerWarning: false,
      lastSaved: "2025-10-22T14:30:00Z",
      progress: 65,
    },
    {
      id: "draft-2",
      movieId: "tt1375666",
      movieTitle: "Inception",
      movieYear: 2010,
      moviePoster: "/inception-poster.png",
      rating: "A+",
      ratingNumeric: 9.5,
      ratingBreakdown: [
        { category: "Story", score: 10 },
        { category: "Acting", score: 9 },
        { category: "Direction", score: 10 },
        { category: "Cinematography", score: 10 },
        { category: "Music", score: 10 },
        { category: "Overall", score: 10 },
      ],
      youtubeVideoId: "YoHD9XEInc0",
      writtenContent: "<h2>Mind-Bending Brilliance</h2>",
      images: [
        {
          url: "/inception-scene-1.png",
          caption: "The rotating hallway fight scene",
        },
      ],
      whereToWatch: [],
      tags: ["Sci-Fi", "Thriller"],
      spoilerWarning: true,
      lastSaved: "2025-10-21T10:15:00Z",
      progress: 35,
    },
    {
      id: "draft-3",
      movieId: "tt0816692",
      movieTitle: "Interstellar",
      movieYear: 2014,
      moviePoster: "/interstellar-poster.png",
      rating: "",
      ratingNumeric: 0,
      ratingBreakdown: [],
      youtubeVideoId: null,
      writtenContent: "",
      images: [],
      whereToWatch: [],
      tags: [],
      spoilerWarning: false,
      lastSaved: "2025-10-20T08:00:00Z",
      progress: 5,
    },
  ]
}

export interface DashboardStats {
  totalReviews: number
  totalViews: number
  totalLikes: number
  totalFollowers: number
  viewsOverTime: { date: string; views: number }[]
  engagementRate: { date: string; rate: number }[]
  followerGrowth: { date: string; followers: number }[]
}

export function generateMockDashboardStats(): DashboardStats {
  const today = new Date()
  const viewsOverTime = []
  const engagementRate = []
  const followerGrowth = []

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    viewsOverTime.push({
      date: dateStr,
      views: Math.floor(Math.random() * 5000) + 1000,
    })

    engagementRate.push({
      date: dateStr,
      rate: Math.random() * 10 + 5, // 5-15%
    })

    followerGrowth.push({
      date: dateStr,
      followers: 125000 - (29 - i) * 100 + Math.floor(Math.random() * 200),
    })
  }

  return {
    totalReviews: 342,
    totalViews: 2450000,
    totalLikes: 185000,
    totalFollowers: 125000,
    viewsOverTime,
    engagementRate,
    followerGrowth,
  }
}

