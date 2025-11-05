"use client"

import { useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { UseFormReturn } from "react-hook-form"

interface UseUnsavedChangesOptions {
  enabled?: boolean
  onBeforeUnload?: () => void
}

/**
 * Hook to track unsaved form changes and warn on page navigation
 * Works with React Hook Form
 *
 * @param form - React Hook Form instance
 * @param options - Configuration options
 * @returns Object with isDirty, reset, and save methods
 */
export function useUnsavedChanges(
  form: UseFormReturn<any>,
  options: UseUnsavedChangesOptions = {}
) {
  const { enabled = true, onBeforeUnload } = options
  const router = useRouter()
  const isDirtyRef = useRef(false)

  // Track form dirty state
  useEffect(() => {
    isDirtyRef.current = form.formState.isDirty
  }, [form.formState.isDirty])

  // Warn on page unload if there are unsaved changes
  useEffect(() => {
    if (!enabled || !isDirtyRef.current) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
      onBeforeUnload?.()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [enabled, onBeforeUnload])

  // Warn on route change if there are unsaved changes
  useEffect(() => {
    if (!enabled || !isDirtyRef.current) return

    const handleRouteChange = () => {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      )
      if (!confirmed) {
        throw new Error("Route change cancelled")
      }
    }

    // Store original push method
    const originalPush = router.push
    router.push = ((path: string) => {
      if (isDirtyRef.current) {
        handleRouteChange()
      }
      return originalPush(path)
    }) as typeof router.push

    return () => {
      router.push = originalPush
    }
  }, [enabled, router])

  // Reset form to initial state
  const reset = useCallback(() => {
    form.reset()
    isDirtyRef.current = false
  }, [form])

  // Mark as saved (clear dirty flag)
  const markAsSaved = useCallback(() => {
    isDirtyRef.current = false
  }, [])

  return {
    isDirty: form.formState.isDirty,
    reset,
    markAsSaved,
  }
}

