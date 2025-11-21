'use client'

/**
 * Infinite Scroll Trigger Component
 * Uses Intersection Observer to trigger load more
 */

import { useEffect, useRef } from 'react'
import LoadingSpinner from './loading-spinner'

interface InfiniteScrollTriggerProps {
  onIntersect: () => void
  isLoading: boolean
}

export default function InfiniteScrollTrigger({
  onIntersect,
  isLoading,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onIntersect()
        }
      },
      { threshold: 0.1 }
    )

    if (triggerRef.current) {
      observer.observe(triggerRef.current)
    }

    return () => observer.disconnect()
  }, [onIntersect, isLoading])

  return (
    <div ref={triggerRef} className="flex justify-center py-8">
      {isLoading && <LoadingSpinner />}
    </div>
  )
}

