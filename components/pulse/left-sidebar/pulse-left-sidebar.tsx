'use client'

/**
 * Pulse Left Sidebar Component
 * Contains user profile, quick navigation, and stats
 */

import { CurrentUser, UserDailyStats } from '@/types/pulse'
import UserProfileCard from './user-profile-card'
import QuickNavigation from './quick-navigation'
import QuickStats from './quick-stats'

interface PulseLeftSidebarProps {
  currentUser: CurrentUser
  userStats: UserDailyStats
}

export default function PulseLeftSidebar({
  currentUser,
  userStats,
}: PulseLeftSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      <UserProfileCard user={currentUser} />
      <QuickNavigation
        notificationCount={currentUser.notification_count}
        messageCount={currentUser.message_count}
      />
      <QuickStats stats={userStats} />
    </div>
  )
}

