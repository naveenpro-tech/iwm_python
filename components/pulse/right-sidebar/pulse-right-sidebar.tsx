'use client'

/**
 * Pulse Right Sidebar Component
 * Contains trending topics, who to follow, trending movies, and cricket
 */

import {
  TrendingTopic,
  SuggestedUser,
  TrendingMovie,
  TrendingCricketMatch,
} from '@/types/pulse'
import TrendingTopics from './trending-topics'
import WhoToFollow from './who-to-follow'
import TrendingMovies from './trending-movies'
import TrendingCricket from './trending-cricket'

interface PulseRightSidebarProps {
  trendingTopics: TrendingTopic[]
  suggestedUsers: SuggestedUser[]
  trendingMovies: TrendingMovie[]
  trendingCricket: TrendingCricketMatch[]
  onTopicClick: (hashtag: string) => void
  onFollow: (userId: string) => void
}

export default function PulseRightSidebar({
  trendingTopics,
  suggestedUsers,
  trendingMovies,
  trendingCricket,
  onTopicClick,
  onFollow,
}: PulseRightSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      <TrendingTopics topics={trendingTopics.slice(0, 5)} onTopicClick={onTopicClick} />
      <WhoToFollow users={suggestedUsers.slice(0, 5)} onFollow={onFollow} />
      <TrendingMovies movies={trendingMovies.slice(0, 5)} />
      <TrendingCricket matches={trendingCricket.slice(0, 3)} />
    </div>
  )
}

