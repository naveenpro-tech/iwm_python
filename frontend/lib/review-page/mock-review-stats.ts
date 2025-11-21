/**
 * Mock data for Review Statistics
 */

import { ReviewStats, MovieContext } from '@/types/review-page'

export const mockReviewStats: ReviewStats = {
  siddu_score: 8.7,
  total_reviews: {
    official: 1,
    critics: 12,
    users: 847,
  },
  rating_distribution: {
    5: {
      count: 523,
      percentage: 61.7,
    },
    4: {
      count: 234,
      percentage: 27.6,
    },
    3: {
      count: 67,
      percentage: 7.9,
    },
    2: {
      count: 18,
      percentage: 2.1,
    },
    1: {
      count: 5,
      percentage: 0.6,
    },
  },
  sentiment_analysis: {
    positive: 72.5,
    neutral: 21.3,
    negative: 6.2,
  },
  top_keywords: [
    {
      keyword: 'masterpiece',
      count: 234,
      sentiment: 'positive',
    },
    {
      keyword: 'hope',
      count: 198,
      sentiment: 'positive',
    },
    {
      keyword: 'redemption',
      count: 176,
      sentiment: 'positive',
    },
    {
      keyword: 'friendship',
      count: 156,
      sentiment: 'positive',
    },
    {
      keyword: 'emotional',
      count: 143,
      sentiment: 'positive',
    },
    {
      keyword: 'slow',
      count: 89,
      sentiment: 'neutral',
    },
    {
      keyword: 'perfect',
      count: 167,
      sentiment: 'positive',
    },
    {
      keyword: 'inspiring',
      count: 134,
      sentiment: 'positive',
    },
  ],
}

export const mockMovieContext: MovieContext = {
  id: 1,
  external_id: 'tt0111161',
  title: 'The Shawshank Redemption',
  year: '1994',
  poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
  backdrop_url: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
}

