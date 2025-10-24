'use client'

/**
 * Empty State Component
 * Shown when no posts are available
 */

import { Inbox } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox size={64} className="text-[#3A3A3A] mb-4" />
      <h3 className="text-xl font-bold text-[#E0E0E0] mb-2">No pulses yet</h3>
      <p className="text-[#A0A0A0] max-w-md">
        Be the first to share something! Start a conversation about your favorite movies or cricket matches.
      </p>
    </div>
  )
}

