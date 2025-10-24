'use client'

/**
 * Pulse Main Feed Component
 * Contains composer, tabs, and feed
 */

import { ReactNode } from 'react'

interface PulseMainFeedProps {
  composer: ReactNode
  tabs: ReactNode
  feed: ReactNode
}

export default function PulseMainFeed({
  composer,
  tabs,
  feed,
}: PulseMainFeedProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Composer */}
      <div>{composer}</div>

      {/* Feed Tabs (Sticky) */}
      <div className="sticky top-16 z-10 bg-[#1A1A1A]">
        {tabs}
      </div>

      {/* Feed */}
      <div>{feed}</div>
    </div>
  )
}

