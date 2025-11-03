"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, RefreshCw, Check, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FeatureFlag {
  id: number
  feature_key: string
  feature_name: string
  is_enabled: boolean
  category: string
  description: string | null
  display_order: number
  created_at: string
  updated_at: string
  updated_by: number | null
}

interface FeatureFlagsResponse {
  total: number
  flags: FeatureFlag[]
}

const CATEGORY_LABELS: Record<string, string> = {
  core_navigation: "Core Navigation",
  content: "Content Features",
  community: "Community Features",
  personal: "Personal Features",
  critic: "Critic Features",
  discovery: "Discovery Features",
  settings: "Settings Features",
  support: "Support Features",
  reviews: "Review Features",
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  core_navigation: "Essential navigation features for the application",
  content: "Content discovery and exploration features",
  community: "Social and community engagement features",
  personal: "User personal features (always recommended to keep enabled)",
  critic: "Critic hub and verification features",
  discovery: "Advanced discovery and comparison tools",
  settings: "User settings and preferences",
  support: "Help and support features",
  reviews: "Review and rating features",
}

export function FeatureManagement() {
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSavedMessage, setShowSavedMessage] = useState(false)
  const [activeCategory, setActiveCategory] = useState("core_navigation")
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchFlags()
  }, [])

  const fetchFlags = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/feature-flags`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch feature flags")
      }

      const data: FeatureFlagsResponse = await response.json()
      setFlags(data.flags)
      setPendingChanges({})
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleChange = (featureKey: string, enabled: boolean) => {
    setPendingChanges((prev) => ({
      ...prev,
      [featureKey]: enabled,
    }))
  }

  const handleSaveChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/feature-flags/bulk`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          updates: pendingChanges,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save feature flags")
      }

      // Refresh flags from server
      await fetchFlags()

      // Show success message
      setShowSavedMessage(true)
      setTimeout(() => setShowSavedMessage(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscardChanges = () => {
    setPendingChanges({})
  }

  const getEffectiveValue = (flag: FeatureFlag): boolean => {
    return pendingChanges.hasOwnProperty(flag.feature_key)
      ? pendingChanges[flag.feature_key]
      : flag.is_enabled
  }

  const hasChanges = Object.keys(pendingChanges).length > 0

  const categories = Array.from(new Set(flags.map((f) => f.category))).sort()

  const getFlagsByCategory = (category: string) => {
    return flags.filter((f) => f.category === category).sort((a, b) => a.display_order - b.display_order)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Feature Management</h2>
          <p className="text-gray-400 mt-1">Control which features are visible to users</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchFlags} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {hasChanges && (
            <>
              <Button variant="outline" size="sm" onClick={handleDiscardChanges}>
                Discard
              </Button>
              <Button size="sm" onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSavedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3"
          >
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-green-500 font-medium">Feature flags saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-500">{error}</span>
        </div>
      )}

      {/* Pending Changes Badge */}
      {hasChanges && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-500">
            You have {Object.keys(pendingChanges).length} unsaved change{Object.keys(pendingChanges).length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 bg-gray-800 border border-gray-700">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="data-[state=active]:bg-gray-700 text-xs md:text-sm"
            >
              {CATEGORY_LABELS[category] || category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4 mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{CATEGORY_LABELS[category] || category}</CardTitle>
                <CardDescription className="text-gray-400">
                  {CATEGORY_DESCRIPTIONS[category] || "Manage features in this category"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getFlagsByCategory(category).map((flag) => {
                  const effectiveValue = getEffectiveValue(flag)
                  const hasChange = pendingChanges.hasOwnProperty(flag.feature_key)

                  return (
                    <div
                      key={flag.feature_key}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        hasChange ? "bg-yellow-500/5 border-yellow-500/20" : "bg-gray-900/50 border-gray-700"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Label htmlFor={flag.feature_key} className="text-white font-medium cursor-pointer">
                            {flag.feature_name}
                          </Label>
                          {hasChange && <Badge variant="outline" className="text-yellow-500 border-yellow-500">Modified</Badge>}
                        </div>
                        {flag.description && (
                          <p className="text-sm text-gray-400 mt-1">{flag.description}</p>
                        )}
                      </div>
                      <Switch
                        id={flag.feature_key}
                        checked={effectiveValue}
                        onCheckedChange={(checked) => handleToggleChange(flag.feature_key, checked)}
                      />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

