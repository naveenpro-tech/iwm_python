"use client"

import { useState, useCallback, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { UseFormReturn } from "react-hook-form"

interface UseSettingsSectionOptions<T> {
  onFetch?: () => Promise<T>
  onSave?: (data: T) => Promise<void>
  onError?: (error: Error) => void
}

interface UseSettingsSectionReturn<T> {
  data: T | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  onSave: (data: T) => Promise<void>
  refetch: () => Promise<void>
}

/**
 * Hook to manage loading and saving logic for a settings section
 * Handles API calls, error states, and success toasts
 *
 * @param form - React Hook Form instance
 * @param options - Configuration options with onFetch and onSave callbacks
 * @returns Object with data, loading states, error, and save method
 */
export function useSettingsSection<T>(
  form: UseFormReturn<any>,
  options: UseSettingsSectionOptions<T> = {}
): UseSettingsSectionReturn<T> {
  const { onFetch, onSave, onError } = options
  const { toast } = useToast()

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (onFetch) {
          const fetchedData = await onFetch()
          setData(fetchedData)
          form.reset(fetchedData)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load settings"
        setError(errorMessage)
        onError?.(err instanceof Error ? err : new Error(errorMessage))
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [form, onFetch, onError, toast])

  // Save data
  const handleSave = useCallback(
    async (formData: T) => {
      setIsSaving(true)
      setError(null)

      try {
        if (onSave) {
          await onSave(formData)
        }

        setData(formData)
        form.reset(formData)

        toast({
          title: "Success",
          description: "Settings saved successfully",
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to save settings"
        setError(errorMessage)
        onError?.(err instanceof Error ? err : new Error(errorMessage))
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    },
    [form, onSave, onError, toast]
  )

  // Refetch data
  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (onFetch) {
        const fetchedData = await onFetch()
        setData(fetchedData)
        form.reset(fetchedData)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reload settings"
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [form, onFetch, onError])

  return {
    data,
    isLoading,
    isSaving,
    error,
    onSave: handleSave,
    refetch,
  }
}

