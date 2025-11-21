/**
 * Mock Trending Topics Data
 * Top 10 trending hashtags
 */

import { TrendingTopic } from '@/types/pulse'

export const mockTrendingTopics: TrendingTopic[] = [
  {
    id: 'topic-1',
    hashtag: '#ShawshankRedemption',
    pulse_count: 12500,
    trend_rank: 1,
    is_rising: true,
  },
  {
    id: 'topic-2',
    hashtag: '#IPL2024',
    pulse_count: 8300,
    trend_rank: 2,
    is_rising: true,
  },
  {
    id: 'topic-3',
    hashtag: '#ChristopherNolan',
    pulse_count: 6700,
    trend_rank: 3,
    is_rising: false,
  },
  {
    id: 'topic-4',
    hashtag: '#Oppenheimer',
    pulse_count: 5200,
    trend_rank: 4,
    is_rising: true,
  },
  {
    id: 'topic-5',
    hashtag: '#ViratKohli',
    pulse_count: 4100,
    trend_rank: 5,
    is_rising: false,
  },
  {
    id: 'topic-6',
    hashtag: '#TheDarkKnight',
    pulse_count: 3800,
    trend_rank: 6,
    is_rising: false,
  },
  {
    id: 'topic-7',
    hashtag: '#Bollywood',
    pulse_count: 3200,
    trend_rank: 7,
    is_rising: true,
  },
  {
    id: 'topic-8',
    hashtag: '#Cricket',
    pulse_count: 2900,
    trend_rank: 8,
    is_rising: false,
  },
  {
    id: 'topic-9',
    hashtag: '#MovieReview',
    pulse_count: 2400,
    trend_rank: 9,
    is_rising: true,
  },
  {
    id: 'topic-10',
    hashtag: '#Inception',
    pulse_count: 1800,
    trend_rank: 10,
    is_rising: false,
  },
]

