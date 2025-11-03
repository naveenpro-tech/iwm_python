import type { CriticAnalytics } from "@/types/critic"

export function generateCriticAnalytics(criticUsername: string, totalReviews: number): CriticAnalytics {
  // Generate realistic analytics based on critic's profile
  const analytics: CriticAnalytics = {
    top_genres: [
      { genre: "Sci-Fi", count: Math.floor(totalReviews * 0.25), percentage: 25 },
      { genre: "Drama", count: Math.floor(totalReviews * 0.20), percentage: 20 },
      { genre: "Thriller", count: Math.floor(totalReviews * 0.18), percentage: 18 },
      { genre: "Action", count: Math.floor(totalReviews * 0.15), percentage: 15 },
      { genre: "Horror", count: Math.floor(totalReviews * 0.12), percentage: 12 },
      { genre: "Comedy", count: Math.floor(totalReviews * 0.10), percentage: 10 },
    ],
    rating_distribution: [
      { rating: 10, count: Math.floor(totalReviews * 0.05), percentage: 5 },
      { rating: 9, count: Math.floor(totalReviews * 0.15), percentage: 15 },
      { rating: 8, count: Math.floor(totalReviews * 0.25), percentage: 25 },
      { rating: 7, count: Math.floor(totalReviews * 0.30), percentage: 30 },
      { rating: 6, count: Math.floor(totalReviews * 0.15), percentage: 15 },
      { rating: 5, count: Math.floor(totalReviews * 0.07), percentage: 7 },
      { rating: 4, count: Math.floor(totalReviews * 0.02), percentage: 2 },
      { rating: 3, count: Math.floor(totalReviews * 0.01), percentage: 1 },
    ],
    review_frequency: {
      per_month: Math.floor(totalReviews / 12),
      trend: "stable",
    },
    engagement_stats: {
      avg_likes_per_review: 850,
      avg_comments_per_review: 120,
      avg_views_per_review: 12000,
    },
  }

  return analytics
}

