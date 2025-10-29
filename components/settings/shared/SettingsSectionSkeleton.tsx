"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SettingsSectionSkeletonProps {
  count?: number
  className?: string
}

/**
 * Loading skeleton for settings sections
 * Matches SettingsSection layout
 */
export const SettingsSectionSkeleton = React.forwardRef<
  HTMLDivElement,
  SettingsSectionSkeletonProps
>(({ count = 3, className }, ref) => {
  return (
    <Card ref={ref} className={cn("", className)}>
      <CardHeader>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>

      <CardContent className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
        ))}

        <div className="flex gap-3 pt-4 border-t">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  )
})

SettingsSectionSkeleton.displayName = "SettingsSectionSkeleton"

