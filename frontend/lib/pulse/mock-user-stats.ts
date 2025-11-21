/**
 * Mock User Stats Data
 * Current user profile and daily stats
 */

import { CurrentUser, UserDailyStats } from '@/types/pulse'

export const mockCurrentUser: CurrentUser = {
  id: 'current-user-1',
  username: 'john_doe',
  display_name: 'John Doe',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe',
  is_verified: false,
  bio: 'Movie enthusiast and cricket fan 🎬🏏',
  follower_count: 1234,
  following_count: 847,
  pulse_count: 234,
  created_at: '2023-09-15T10:00:00Z',
  email: 'john.doe@example.com',
  notification_count: 3,
  message_count: 5,
  bookmark_count: 67,
}

export const mockUserDailyStats: UserDailyStats = {
  pulses_posted: 3,
  likes_received: 47,
  new_followers: 5,
  comments_received: 12,
}

