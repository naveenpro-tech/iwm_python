/**
 * Mock Badges Data Generator for Critic Profiles
 * 
 * Generates achievement badges based on critic statistics:
 * - Genre Specialist badges (50+ reviews in a genre)
 * - Milestone badges (review count, followers, views)
 * - Engagement badges (top engaged, community favorite)
 * - Quality badges (verified, trusted voice)
 */

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'genre' | 'milestone' | 'engagement' | 'quality'
  isEarned: boolean
  earnedAt: string | null
  progress: number
  total: number
  color: string
}

export interface BadgesData {
  badges: Badge[]
  totalEarned: number
  totalAvailable: number
}

/**
 * Generate mock badges for a critic based on their stats
 */
export function generateMockBadges(criticStats: {
  totalReviews: number
  totalFollowers: number
  totalViews: number
  avgRating: number
  isVerified: boolean
  genreCounts?: Record<string, number>
}): BadgesData {
  const badges: Badge[] = []

  // Genre Specialist Badges
  const genreBadges = [
    { id: 'horror-aficionado', name: 'Horror Aficionado', genre: 'horror', icon: 'ghost', color: '#F59E0B' },
    { id: 'scifi-specialist', name: 'Sci-Fi Specialist', genre: 'scifi', icon: 'rocket', color: '#00BFFF' },
    { id: 'drama-expert', name: 'Drama Expert', genre: 'drama', icon: 'theater', color: '#8B5CF6' },
    { id: 'action-junkie', name: 'Action Junkie', genre: 'action', icon: 'zap', color: '#EF4444' },
    { id: 'comedy-connoisseur', name: 'Comedy Connoisseur', genre: 'comedy', icon: 'smile', color: '#FFD700' },
  ]

  genreBadges.forEach((badge) => {
    const count = criticStats.genreCounts?.[badge.genre] || Math.floor(Math.random() * 80)
    const isEarned = count >= 50
    
    badges.push({
      id: badge.id,
      name: badge.name,
      description: `Reviewed 50+ ${badge.genre} movies`,
      icon: badge.icon,
      category: 'genre',
      isEarned,
      earnedAt: isEarned ? '2025-09-15T00:00:00Z' : null,
      progress: Math.min(count, 50),
      total: 50,
      color: badge.color,
    })
  })

  // Milestone Badges - Review Count
  const reviewMilestones = [
    { id: 'first-100', name: 'First 100 Reviews', total: 100, icon: 'trophy', color: '#10B981' },
    { id: 'milestone-500', name: '500 Reviews Milestone', total: 500, icon: 'award', color: '#FFD700' },
    { id: 'milestone-1000', name: '1,000 Reviews Milestone', total: 1000, icon: 'crown', color: '#8B5CF6' },
  ]

  reviewMilestones.forEach((badge) => {
    const isEarned = criticStats.totalReviews >= badge.total
    
    badges.push({
      id: badge.id,
      name: badge.name,
      description: `Published ${badge.total} reviews`,
      icon: badge.icon,
      category: 'milestone',
      isEarned,
      earnedAt: isEarned ? '2025-08-01T00:00:00Z' : null,
      progress: Math.min(criticStats.totalReviews, badge.total),
      total: badge.total,
      color: badge.color,
    })
  })

  // Milestone Badges - Followers
  const followerMilestones = [
    { id: 'followers-1k', name: '1K Followers', total: 1000, icon: 'users', color: '#00BFFF' },
    { id: 'followers-10k', name: '10K Followers', total: 10000, icon: 'users-2', color: '#FFD700' },
    { id: 'followers-100k', name: '100K Followers', total: 100000, icon: 'users-round', color: '#8B5CF6' },
  ]

  followerMilestones.forEach((badge) => {
    const isEarned = criticStats.totalFollowers >= badge.total
    
    badges.push({
      id: badge.id,
      name: badge.name,
      description: `Reached ${badge.total.toLocaleString()} followers`,
      icon: badge.icon,
      category: 'milestone',
      isEarned,
      earnedAt: isEarned ? '2025-07-15T00:00:00Z' : null,
      progress: Math.min(criticStats.totalFollowers, badge.total),
      total: badge.total,
      color: badge.color,
    })
  })

  // Milestone Badges - Views
  const viewMilestones = [
    { id: 'views-100k', name: '100K Views', total: 100000, icon: 'eye', color: '#10B981' },
    { id: 'views-1m', name: '1M Views', total: 1000000, icon: 'eye', color: '#FFD700' },
  ]

  viewMilestones.forEach((badge) => {
    const isEarned = criticStats.totalViews >= badge.total
    
    badges.push({
      id: badge.id,
      name: badge.name,
      description: `Reached ${badge.total.toLocaleString()} total views`,
      icon: badge.icon,
      category: 'milestone',
      isEarned,
      earnedAt: isEarned ? '2025-06-20T00:00:00Z' : null,
      progress: Math.min(criticStats.totalViews, badge.total),
      total: badge.total,
      color: badge.color,
    })
  })

  // Engagement Badges
  const engagementBadges = [
    {
      id: 'top-engaged',
      name: 'Top Engaged Critic',
      description: 'Top 10% engagement rate',
      icon: 'trending-up',
      isEarned: criticStats.totalFollowers > 500 && criticStats.avgRating > 7.5,
      color: '#EC4899',
    },
    {
      id: 'community-favorite',
      name: 'Community Favorite',
      description: 'Top 10% follower growth',
      icon: 'heart',
      isEarned: criticStats.totalFollowers > 1000,
      color: '#EF4444',
    },
    {
      id: 'consistent-contributor',
      name: 'Consistent Contributor',
      description: '30+ days streak',
      icon: 'calendar-check',
      isEarned: criticStats.totalReviews > 50,
      color: '#10B981',
    },
  ]

  engagementBadges.forEach((badge) => {
    badges.push({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      category: 'engagement',
      isEarned: badge.isEarned,
      earnedAt: badge.isEarned ? '2025-05-10T00:00:00Z' : null,
      progress: badge.isEarned ? 100 : Math.floor(Math.random() * 80),
      total: 100,
      color: badge.color,
    })
  })

  // Quality Badges
  const qualityBadges = [
    {
      id: 'verified-critic',
      name: 'Verified Critic',
      description: 'Official verification',
      icon: 'badge-check',
      isEarned: criticStats.isVerified,
      color: '#00BFFF',
    },
    {
      id: 'trusted-voice',
      name: 'Trusted Voice',
      description: '90%+ helpful votes',
      icon: 'shield-check',
      isEarned: criticStats.avgRating > 7.0 && criticStats.totalReviews > 100,
      color: '#10B981',
    },
    {
      id: 'detailed-reviewer',
      name: 'Detailed Reviewer',
      description: 'Avg review length >500 words',
      icon: 'file-text',
      isEarned: criticStats.totalReviews > 75,
      color: '#8B5CF6',
    },
  ]

  qualityBadges.forEach((badge) => {
    badges.push({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      category: 'quality',
      isEarned: badge.isEarned,
      earnedAt: badge.isEarned ? '2025-04-01T00:00:00Z' : null,
      progress: badge.isEarned ? 100 : Math.floor(Math.random() * 90),
      total: 100,
      color: badge.color,
    })
  })

  const totalEarned = badges.filter((b) => b.isEarned).length
  const totalAvailable = badges.length

  return {
    badges,
    totalEarned,
    totalAvailable,
  }
}

