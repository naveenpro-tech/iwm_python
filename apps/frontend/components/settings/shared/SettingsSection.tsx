"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  onSave?: () => Promise<void> | void
  onCancel?: () => void
  isLoading?: boolean
  isSaving?: boolean
  error?: string | null
  success?: boolean
  isDirty?: boolean
  className?: string
}

/**
 * Container component for a settings section
 * Includes title, description, form, and save button
 * Shows loading/error/success states
 */
export const SettingsSection = React.forwardRef<
  HTMLDivElement,
  SettingsSectionProps
>(
  (
    {
      title,
      description,
      children,
      onSave,
      onCancel,
      isLoading = false,
      isSaving = false,
      error,
      success = false,
      isDirty = false,
      className,
    },
    ref
  ) => {
    const handleSave = async () => {
      if (onSave) {
        await onSave()
      }
    }

    return (
      <Card ref={ref} className={cn("", className)}>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              {error && (
                <div
                  className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md"
                  role="alert"
                >
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">
                      Error
                    </p>
                    <p className="text-sm text-destructive/80">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {success && !isDirty && (
                <div
                  className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-md"
                  role="status"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">
                      Saved successfully
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {children}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                {onCancel && (
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                )}
                {onSave && (
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !isDirty}
                    className="gap-2"
                  >
                    {isSaving && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    )
  }
)

SettingsSection.displayName = "SettingsSection"

