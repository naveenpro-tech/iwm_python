/**
 * Mock Analytics Data Generator for Critic Profiles
 * 
 * Generates realistic analytics data for critic profiles including:
 * - Genre affinity (review distribution by genre)
 * - Rating distribution (frequency of each rating 1-10)
 * - Keyword cloud (most common words in reviews)
 * - Sentiment timeline (average rating over time)
 */

export interface GenreAffinityData {
  genre: string
  count: number
  color: string
}

export interface RatingDistributionData {
  rating: number
  count: number
  percentage: number
}

export interface KeywordData {
  word: string
  frequency: number
  size: number
}

export interface SentimentTimelineData {
  month: string
  avgRating: number
  reviewCount: number
}

export interface AnalyticsData {
  genreAffinity: GenreAffinityData[]
  ratingDistribution: RatingDistributionData[]
  keywords: KeywordData[]
  sentimentTimeline: SentimentTimelineData[]
}

/**
 * Generate mock analytics data for a critic
 */
export function generateMockAnalytics(criticUsername: string, totalReviews: number = 150): AnalyticsData {
  // Genre affinity - realistic distribution
  const genreAffinity: GenreAffinityData[] = [
    { genre: 'Drama', count: Math.floor(totalReviews * 0.25), color: '#8B5CF6' },
    { genre: 'Action', count: Math.floor(totalReviews * 0.20), color: '#EF4444' },
    { genre: 'Sci-Fi', count: Math.floor(totalReviews * 0.15), color: '#00BFFF' },
    { genre: 'Comedy', count: Math.floor(totalReviews * 0.12), color: '#FFD700' },
    { genre: 'Thriller', count: Math.floor(totalReviews * 0.10), color: '#10B981' },
    { genre: 'Horror', count: Math.floor(totalReviews * 0.08), color: '#F59E0B' },
    { genre: 'Romance', count: Math.floor(totalReviews * 0.05), color: '#EC4899' },
    { genre: 'Documentary', count: Math.floor(totalReviews * 0.05), color: '#6366F1' },
  ]

  // Rating distribution - bell curve centered around 7
  const ratingDistribution: RatingDistributionData[] = [
    { rating: 1, count: 2, percentage: 1.3 },
    { rating: 2, count: 3, percentage: 2.0 },
    { rating: 3, count: 5, percentage: 3.3 },
    { rating: 4, count: 8, percentage: 5.3 },
    { rating: 5, count: 12, percentage: 8.0 },
    { rating: 6, count: 18, percentage: 12.0 },
    { rating: 7, count: 35, percentage: 23.3 },
    { rating: 8, count: 32, percentage: 21.3 },
    { rating: 9, count: 25, percentage: 16.7 },
    { rating: 10, count: 10, percentage: 6.7 },
  ]

  // Keywords - most common words in reviews
  const keywords: KeywordData[] = [
    { word: 'cinematography', frequency: 45, size: 32 },
    { word: 'performance', frequency: 42, size: 30 },
    { word: 'storytelling', frequency: 38, size: 28 },
    { word: 'direction', frequency: 35, size: 26 },
    { word: 'emotional', frequency: 32, size: 24 },
    { word: 'visuals', frequency: 30, size: 23 },
    { word: 'compelling', frequency: 28, size: 22 },
    { word: 'masterpiece', frequency: 25, size: 20 },
    { word: 'brilliant', frequency: 23, size: 19 },
    { word: 'powerful', frequency: 22, size: 18 },
    { word: 'stunning', frequency: 20, size: 17 },
    { word: 'captivating', frequency: 18, size: 16 },
    { word: 'authentic', frequency: 17, size: 15 },
    { word: 'innovative', frequency: 16, size: 15 },
    { word: 'engaging', frequency: 15, size: 14 },
    { word: 'memorable', frequency: 14, size: 14 },
    { word: 'intense', frequency: 13, size: 13 },
    { word: 'nuanced', frequency: 12, size: 13 },
    { word: 'atmospheric', frequency: 11, size: 12 },
    { word: 'gripping', frequency: 10, size: 12 },
    { word: 'thought-provoking', frequency: 9, size: 11 },
    { word: 'immersive', frequency: 9, size: 11 },
    { word: 'exceptional', frequency: 8, size: 10 },
    { word: 'profound', frequency: 8, size: 10 },
    { word: 'mesmerizing', frequency: 7, size: 10 },
    { word: 'riveting', frequency: 7, size: 9 },
    { word: 'poignant', frequency: 6, size: 9 },
    { word: 'visceral', frequency: 6, size: 9 },
    { word: 'haunting', frequency: 5, size: 8 },
    { word: 'exquisite', frequency: 5, size: 8 },
  ]

  // Sentiment timeline - last 12 months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  const sentimentTimeline: SentimentTimelineData[] = []

  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - 11 + i + 12) % 12
    const reviewCount = Math.floor(Math.random() * 15) + 5 // 5-20 reviews per month
    const avgRating = 6.5 + Math.random() * 2 // 6.5-8.5 average rating
    
    sentimentTimeline.push({
      month: months[monthIndex],
      avgRating: parseFloat(avgRating.toFixed(1)),
      reviewCount,
    })
  }

  return {
    genreAffinity,
    ratingDistribution,
    keywords,
    sentimentTimeline,
  }
}

/**
 * Generate trend data for stats constellation hover
 */
export function generateTrendData(metricName: string): { day: string; value: number }[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const trend: { day: string; value: number }[] = []

  let baseValue = 100
  if (metricName === 'followers') baseValue = 1000
  if (metricName === 'reviews') baseValue = 150
  if (metricName === 'rating') baseValue = 7.5
  if (metricName === 'likes') baseValue = 500
  if (metricName === 'views') baseValue = 5000

  for (let i = 0; i < 7; i++) {
    const variance = metricName === 'rating' ? 0.3 : baseValue * 0.1
    const value = baseValue + (Math.random() - 0.5) * variance
    
    trend.push({
      day: days[i],
      value: parseFloat(value.toFixed(metricName === 'rating' ? 1 : 0)),
    })
  }

  return trend
}

