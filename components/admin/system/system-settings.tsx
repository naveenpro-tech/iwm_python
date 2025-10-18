"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Settings, Save, RefreshCw, Globe, Shield, Zap, FileText, BellRing, Check, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Mock system settings data
const systemSettings = {
  general: {
    siteName: "Siddu Global Entertainment Hub",
    siteDescription:
      "The definitive digital destination for celebrating cinematic masterpieces and visual treats from across the globe, while also providing real-time cricket updates for India's passionate fans.",
    maintenanceMode: false,
    maintenanceMessage: "We're currently performing scheduled maintenance. Please check back soon!",
    analyticsId: "UA-123456789-1",
    maxUploadSize: 50, // MB
    defaultPaginationLimit: 20,
    enableDebugMode: false,
  },
  content: {
    enableUserReviews: true,
    reviewModeration: "post", // pre, post, none
    enableComments: true,
    commentModeration: "post", // pre, post, none
    defaultContentLanguage: "en",
    enableContentTranslation: true,
    supportedLanguages: ["en", "hi", "ta", "te", "ml", "bn", "fr", "es", "de", "ja", "zh"],
    adultContentFilter: "moderate", // strict, moderate, none
    enablePulseSystem: true,
    maxImagesPerPost: 10,
    maxVideoDuration: 5, // minutes
    enableAIContentDetection: true,
  },
  security: {
    enableTwoFactorAuth: true,
    requireEmailVerification: true,
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    passwordRequireNumber: true,
    passwordRequireUppercase: true,
    sessionTimeout: 60, // minutes
    maxLoginAttempts: 5,
    lockoutDuration: 30, // minutes
    enableCaptcha: true,
    allowedOrigins: ["https://siddu.com", "https://admin.siddu.com"],
    enableCSRFProtection: true,
    enableXSSProtection: true,
  },
  localization: {
    defaultLanguage: "en",
    defaultTimezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h", // 12h, 24h
    firstDayOfWeek: "monday", // sunday, monday
    enableAutoTranslation: true,
    currencySymbol: "₹",
    measurementSystem: "metric", // metric, imperial
  },
  performance: {
    enableCaching: true,
    cacheTTL: 3600, // seconds
    enableImageOptimization: true,
    enableLazyLoading: true,
    enableMinification: true,
    enableCompression: true,
    enableCDN: true,
    cdnUrl: "https://cdn.siddu.com",
    enableServiceWorker: true,
    enablePrefetching: true,
  },
  notifications: {
    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableInAppNotifications: true,
    adminEmailRecipients: "admin@siddu.com, support@siddu.com",
    defaultFromEmail: "noreply@siddu.com",
    notificationDigestFrequency: "daily", // instant, daily, weekly
    enableMarketingEmails: true,
  },
}

export function SystemSettings() {
  const [settings, setSettings] = useState(systemSettings)
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [showSavedMessage, setShowSavedMessage] = useState(false)
  const [confirmResetOpen, setConfirmResetOpen] = useState(false)

  // Handle toggle change
  const handleToggleChange = (category: string, setting: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: checked,
      },
    }))
  }

  // Handle input change
  const handleInputChange = (category: string, setting: string, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }))
  }

  // Handle select change
  const handleSelectChange = (category: string, setting: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }))
  }

  // Handle save settings
  const handleSaveSettings = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setShowSavedMessage(true)

      // Hide saved message after 3 seconds
      setTimeout(() => {
        setShowSavedMessage(false)
      }, 3000)
    }, 1500)
  }

  // Handle reset settings
  const handleResetSettings = () => {
    setSettings(systemSettings)
    setConfirmResetOpen(false)
  }

  return (
    <Card className="shadow-lg border-border/40">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>Configure platform-wide settings and preferences</CardDescription>
          </div>
          <div className="flex gap-2">
            <AlertDialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all settings?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all system settings to their default values. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetSettings}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Reset Settings
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Saved message */}
        <AnimatePresence>
          {showSavedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-16 right-8 bg-green-500/90 text-white px-4 py-2 rounded-md shadow-lg flex items-center"
            >
              <Check className="mr-2 h-4 w-4" />
              Settings saved successfully
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="localization" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Localization</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <BellRing className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Accordion type="single" collapsible className="w-full" defaultValue="site-info">
              <AccordionItem value="site-info">
                <AccordionTrigger className="text-base font-medium">Site Information</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input
                      id="site-name"
                      value={settings.general.siteName}
                      onChange={(e) => handleInputChange("general", "siteName", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="site-description">Site Description</Label>
                    <Textarea
                      id="site-description"
                      rows={3}
                      value={settings.general.siteDescription}
                      onChange={(e) => handleInputChange("general", "siteDescription", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="analytics-id">Google Analytics ID</Label>
                    <Input
                      id="analytics-id"
                      value={settings.general.analyticsId}
                      onChange={(e) => handleInputChange("general", "analyticsId", e.target.value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="maintenance">
                <AccordionTrigger className="text-base font-medium">Maintenance Mode</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
                      <div className="text-sm text-muted-foreground">
                        When enabled, the site will display a maintenance message to all users
                      </div>
                    </div>
                    <Switch
                      id="maintenance-mode"
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(checked) => handleToggleChange("general", "maintenanceMode", checked)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="maintenance-message">Maintenance Message</Label>
                    <Textarea
                      id="maintenance-message"
                      rows={3}
                      value={settings.general.maintenanceMessage}
                      onChange={(e) => handleInputChange("general", "maintenanceMessage", e.target.value)}
                      disabled={!settings.general.maintenanceMode}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="uploads">
                <AccordionTrigger className="text-base font-medium">Upload Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="max-upload-size">Maximum Upload Size (MB)</Label>
                    <Input
                      id="max-upload-size"
                      type="number"
                      value={settings.general.maxUploadSize}
                      onChange={(e) => handleInputChange("general", "maxUploadSize", Number.parseInt(e.target.value))}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pagination">
                <AccordionTrigger className="text-base font-medium">Pagination Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="default-pagination">Default Items Per Page</Label>
                    <Input
                      id="default-pagination"
                      type="number"
                      value={settings.general.defaultPaginationLimit}
                      onChange={(e) =>
                        handleInputChange("general", "defaultPaginationLimit", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="debug">
                <AccordionTrigger className="text-base font-medium">Debug Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="debug-mode">Enable Debug Mode</Label>
                      <div className="text-sm text-muted-foreground">
                        When enabled, detailed error messages will be displayed
                      </div>
                    </div>
                    <Switch
                      id="debug-mode"
                      checked={settings.general.enableDebugMode}
                      onCheckedChange={(checked) => handleToggleChange("general", "enableDebugMode", checked)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="content">
            <Accordion type="single" collapsible className="w-full" defaultValue="user-content">
              <AccordionItem value="user-content">
                <AccordionTrigger className="text-base font-medium">User Content Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-reviews">Enable User Reviews</Label>
                      <div className="text-sm text-muted-foreground">
                        Allow users to submit reviews for movies and content
                      </div>
                    </div>
                    <Switch
                      id="enable-reviews"
                      checked={settings.content.enableUserReviews}
                      onCheckedChange={(checked) => handleToggleChange("content", "enableUserReviews", checked)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="review-moderation">Review Moderation</Label>
                    <Select
                      value={settings.content.reviewModeration}
                      onValueChange={(value) => handleSelectChange("content", "reviewModeration", value)}
                      disabled={!settings.content.enableUserReviews}
                    >
                      <SelectTrigger id="review-moderation">
                        <SelectValue placeholder="Select moderation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre">Pre-moderation (approve before publishing)</SelectItem>
                        <SelectItem value="post">Post-moderation (review after publishing)</SelectItem>
                        <SelectItem value="none">No moderation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-comments">Enable Comments</Label>
                      <div className="text-sm text-muted-foreground">Allow users to comment on content</div>
                    </div>
                    <Switch
                      id="enable-comments"
                      checked={settings.content.enableComments}
                      onCheckedChange={(checked) => handleToggleChange("content", "enableComments", checked)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="comment-moderation">Comment Moderation</Label>
                    <Select
                      value={settings.content.commentModeration}
                      onValueChange={(value) => handleSelectChange("content", "commentModeration", value)}
                      disabled={!settings.content.enableComments}
                    >
                      <SelectTrigger id="comment-moderation">
                        <SelectValue placeholder="Select moderation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre">Pre-moderation (approve before publishing)</SelectItem>
                        <SelectItem value="post">Post-moderation (review after publishing)</SelectItem>
                        <SelectItem value="none">No moderation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="content-filtering">
                <AccordionTrigger className="text-base font-medium">Content Filtering</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="adult-content-filter">Adult Content Filter</Label>
                    <Select
                      value={settings.content.adultContentFilter}
                      onValueChange={(value) => handleSelectChange("content", "adultContentFilter", value)}
                    >
                      <SelectTrigger id="adult-content-filter">
                        <SelectValue placeholder="Select filter level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strict">Strict (block all adult content)</SelectItem>
                        <SelectItem value="moderate">Moderate (warn users)</SelectItem>
                        <SelectItem value="none">None (no filtering)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ai-content-detection">Enable AI Content Detection</Label>
                      <div className="text-sm text-muted-foreground">Use AI to detect inappropriate content</div>
                    </div>
                    <Switch
                      id="ai-content-detection"
                      checked={settings.content.enableAIContentDetection}
                      onCheckedChange={(checked) => handleToggleChange("content", "enableAIContentDetection", checked)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="language-settings">
                <AccordionTrigger className="text-base font-medium">Language Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="default-content-language">Default Content Language</Label>
                    <Select
                      value={settings.content.defaultContentLanguage}
                      onValueChange={(value) => handleSelectChange("content", "defaultContentLanguage", value)}
                    >
                      <SelectTrigger id="default-content-language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                        <SelectItem value="te">Telugu</SelectItem>
                        <SelectItem value="ml">Malayalam</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="content-translation">Enable Content Translation</Label>
                      <div className="text-sm text-muted-foreground">
                        Allow content to be translated into multiple languages
                      </div>
                    </div>
                    <Switch
                      id="content-translation"
                      checked={settings.content.enableContentTranslation}
                      onCheckedChange={(checked) => handleToggleChange("content", "enableContentTranslation", checked)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pulse-system">
                <AccordionTrigger className="text-base font-medium">Pulse System</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-pulse">Enable Pulse System</Label>
                      <div className="text-sm text-muted-foreground">Allow users to create and share Pulse posts</div>
                    </div>
                    <Switch
                      id="enable-pulse"
                      checked={settings.content.enablePulseSystem}
                      onCheckedChange={(checked) => handleToggleChange("content", "enablePulseSystem", checked)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="max-images-per-post">Maximum Images Per Post</Label>
                    <Input
                      id="max-images-per-post"
                      type="number"
                      value={settings.content.maxImagesPerPost}
                      onChange={(e) =>
                        handleInputChange("content", "maxImagesPerPost", Number.parseInt(e.target.value))
                      }
                      disabled={!settings.content.enablePulseSystem}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="max-video-duration">Maximum Video Duration (minutes)</Label>
                    <Input
                      id="max-video-duration"
                      type="number"
                      value={settings.content.maxVideoDuration}
                      onChange={(e) =>
                        handleInputChange("content", "maxVideoDuration", Number.parseInt(e.target.value))
                      }
                      disabled={!settings.content.enablePulseSystem}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="security">
            <Accordion type="single" collapsible className="w-full" defaultValue="authentication">
              <AccordionItem value="authentication">
                <AccordionTrigger className="text-base font-medium">Authentication Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor-auth">Enable Two-Factor Authentication</Label>
                      <div className="text-sm text-muted-foreground">Allow users to enable 2FA for their accounts</div>
                    </div>
                    <Switch
                      id="two-factor-auth"
                      checked={settings.security.enableTwoFactorAuth}
                      onCheckedChange={(checked) => handleToggleChange("security", "enableTwoFactorAuth", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-verification">Require Email Verification</Label>
                      <div className="text-sm text-muted-foreground">
                        Require users to verify their email address before accessing the platform
                      </div>
                    </div>
                    <Switch
                      id="email-verification"
                      checked={settings.security.requireEmailVerification}
                      onCheckedChange={(checked) => handleToggleChange("security", "requireEmailVerification", checked)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="password-policy">
                <AccordionTrigger className="text-base font-medium">Password Policy</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="password-min-length">Minimum Password Length</Label>
                    <Input
                      id="password-min-length"
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) =>
                        handleInputChange("security", "passwordMinLength", Number.parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="password-special-char">Require Special Character</Label>
                    </div>
                    <Switch
                      id="password-special-char"
                      checked={settings.security.passwordRequireSpecialChar}
                      onCheckedChange={(checked) =>
                        handleToggleChange("security", "passwordRequireSpecialChar", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="password-number">Require Number</Label>
                    </div>
                    <Switch
                      id="password-number"
                      checked={settings.security.passwordRequireNumber}
                      onCheckedChange={(checked) => handleToggleChange("security", "passwordRequireNumber", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="password-uppercase">Require Uppercase Letter</Label>
                    </div>
                    <Switch
                      id="password-uppercase"
                      checked={settings.security.passwordRequireUppercase}
                      onCheckedChange={(checked) => handleToggleChange("security", "passwordRequireUppercase", checked)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="session-settings">
                <AccordionTrigger className="text-base font-medium">Session Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleInputChange("security", "sessionTimeout", Number.parseInt(e.target.value))}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="login-security">
                <AccordionTrigger className="text-base font-medium">Login Security</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="max-login-attempts">Maximum Login Attempts</Label>
                    <Input
                      id="max-login-attempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) =>
                        handleInputChange("security", "maxLoginAttempts", Number.parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockout-duration"
                      type="number"
                      value={settings.security.lockoutDuration}
                      onChange={(e) =>
                        handleInputChange("security", "lockoutDuration", Number.parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-captcha">Enable CAPTCHA</Label>
                      <div className="text-sm text-muted-foreground">
                        Require CAPTCHA verification for login and registration
                      </div>
                    </div>
                    <Switch
                      id="enable-captcha"
                      checked={settings.security.enableCaptcha}
                      onCheckedChange={(checked) => handleToggleChange("security", "enableCaptcha", checked)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="protection">
                <AccordionTrigger className="text-base font-medium">Protection Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="csrf-protection">Enable CSRF Protection</Label>
                      <div className="text-sm text-muted-foreground">
                        Protect against Cross-Site Request Forgery attacks
                      </div>
                    </div>
                    <Switch
                      id="csrf-protection"
                      checked={settings.security.enableCSRFProtection}
                      onCheckedChange={(checked) => handleToggleChange("security", "enableCSRFProtection", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="xss-protection">Enable XSS Protection</Label>
                      <div className="text-sm text-muted-foreground">Protect against Cross-Site Scripting attacks</div>
                    </div>
                    <Switch
                      id="xss-protection"
                      checked={settings.security.enableXSSProtection}
                      onCheckedChange={(checked) => handleToggleChange("security", "enableXSSProtection", checked)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="allowed-origins">Allowed Origins (CORS)</Label>
                    <Textarea
                      id="allowed-origins"
                      rows={3}
                      value={settings.security.allowedOrigins.join("\n")}
                      onChange={(e) => handleInputChange("security", "allowedOrigins", e.target.value.split("\n"))}
                    />
                    <div className="text-xs text-muted-foreground">
                      Enter one origin per line (e.g., https://example.com)
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="localization">
            <Accordion type="single" collapsible className="w-full" defaultValue="language">
              <AccordionItem value="language">
                <AccordionTrigger className="text-base font-medium">Language Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="default-language">Default Language</Label>
                    <Select
                      value={settings.localization.defaultLanguage}
                      onValueChange={(value) => handleSelectChange("localization", "defaultLanguage", value)}
                    >
                      <SelectTrigger id="default-language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                        <SelectItem value="te">Telugu</SelectItem>
                        <SelectItem value="ml">Malayalam</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-translation">Enable Auto-Translation</Label>
                      <div className="text-sm text-muted-foreground">
                        Automatically translate content based on user's language preference
                      </div>
                    </div>
                    <Switch
                      id="auto-translation"
                      checked={settings.localization.enableAutoTranslation}
                      onCheckedChange={(checked) =>
                        handleToggleChange("localization", "enableAutoTranslation", checked)
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="timezone">
                <AccordionTrigger className="text-base font-medium">Time & Date Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="default-timezone">Default Timezone</Label>
                    <Select
                      value={settings.localization.defaultTimezone}
                      onValueChange={(value) => handleSelectChange("localization", "defaultTimezone", value)}
                    >
                      <SelectTrigger id="default-timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select
                      value={settings.localization.dateFormat}
                      onValueChange={(value) => handleSelectChange("localization", "dateFormat", value)}
                    >
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="DD-MMM-YYYY">DD-MMM-YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="time-format">Time Format</Label>
                    <Select
                      value={settings.localization.timeFormat}
                      onValueChange={(value) => handleSelectChange("localization", "timeFormat", value)}
                    >
                      <SelectTrigger id="time-format">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="first-day">First Day of Week</Label>
                    <Select
                      value={settings.localization.firstDayOfWeek}
                      onValueChange={(value) => handleSelectChange("localization", "firstDayOfWeek", value)}
                    >
                      <SelectTrigger id="first-day">
                        <SelectValue placeholder="Select first day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="regional">
                <AccordionTrigger className="text-base font-medium">Regional Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="currency-symbol">Currency Symbol</Label>
                    <Input
                      id="currency-symbol"
                      value={settings.localization.currencySymbol}
                      onChange={(e) => handleInputChange("localization", "currencySymbol", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="measurement-system">Measurement System</Label>
                    <Select
                      value={settings.localization.measurementSystem}
                      onValueChange={(value) => handleSelectChange("localization", "measurementSystem", value)}
                    >
                      <SelectTrigger id="measurement-system">
                        <SelectValue placeholder="Select measurement system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (km, kg)</SelectItem>
                        <SelectItem value="imperial">Imperial (miles, lbs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="performance">
            <Accordion type="single" collapsible className="w-full" defaultValue="caching">
              <AccordionItem value="caching">
                <AccordionTrigger className="text-base font-medium">Caching Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-caching">Enable Caching</Label>
                      <div className="text-sm text-muted-foreground">
                        Cache pages and API responses for faster loading
                      </div>
                    </div>
                    <Switch
                      id="enable-caching"
                      checked={settings.performance.enableCaching}
                      onCheckedChange={(checked) => handleToggleChange("performance", "enableCaching", checked)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cache-ttl">Cache TTL (seconds)</Label>
                    <Input
                      id="cache-ttl"
                      type="number"
                      value={settings.performance.cacheTTL}
                      onChange={(e) => handleInputChange("performance", "cacheTTL", Number.parseInt(e.target.value))}
                      disabled={!settings.performance.enableCaching}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="optimization">
                <AccordionTrigger className="text-base font-medium">Optimization Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="image-optimization">Enable Image Optimization</Label>
                      <div className="text-sm text-muted-foreground">
                        Automatically optimize images for faster loading
                      </div>
                    </div>
                    <Switch
                      id="image-optimization"
                      checked={settings.performance.enableImageOptimization}
                      onCheckedChange={(checked) =>
                        handleToggleChange("performance", "enableImageOptimization", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lazy-loading">Enable Lazy Loading</Label>
                      <div className="text-sm text-muted-foreground">
                        Load images and content only when they become visible
                      </div>
                    </div>
                    <Switch
                      id="lazy-loading"
                      checked={settings.performance.enableLazyLoading}
                      onCheckedChange={(checked) => handleToggleChange("performance", "enableLazyLoading", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="minification">Enable Minification</Label>
                      <div className="text-sm text-muted-foreground">Minify HTML, CSS, and JavaScript files</div>
                    </div>
                    <Switch
                      id="minification"
                      checked={settings.performance.enableMinification}
                      onCheckedChange={(checked) => handleToggleChange("performance", "enableMinification", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compression">Enable Compression</Label>
                      <div className="text-sm text-muted-foreground">Compress responses using gzip or brotli</div>
                    </div>
                    <Switch
                      id="compression"
                      checked={settings.performance.enableCompression}
                      onCheckedChange={(checked) => handleToggleChange("performance", "enableCompression", checked)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cdn">
                <AccordionTrigger className="text-base font-medium">CDN Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-cdn">Enable CDN</Label>
                      <div className="text-sm text-muted-foreground">
                        Serve static assets through a Content Delivery Network
                      </div>
                    </div>
                    <Switch
                      id="enable-cdn"
                      checked={settings.performance.enableCDN}
                      onCheckedChange={(checked) => handleToggleChange("performance", "enableCDN", checked)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cdn-url">CDN URL</Label>
                    <Input
                      id="cdn-url"
                      value={settings.performance.cdnUrl}
                      onChange={(e) => handleInputChange("performance", "cdnUrl", e.target.value)}
                      disabled={!settings.performance.enableCDN}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="advanced">
                <AccordionTrigger className="text-base font-medium">Advanced Performance Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="service-worker">Enable Service Worker</Label>
                      <div className="text-sm text-muted-foreground">
                        Use service workers for offline support and faster loading
                      </div>
                    </div>
                    <Switch
                      id="service-worker"
                      checked={settings.performance.enableServiceWorker}
                      onCheckedChange={(checked) => handleToggleChange("performance", "enableServiceWorker", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="prefetching">Enable Prefetching</Label>
                      <div className="text-sm text-muted-foreground">
                        Prefetch resources that are likely to be needed
                      </div>
                    </div>
                    <Switch
                      id="prefetching"
                      checked={settings.performance.enablePrefetching}
                      onCheckedChange={(checked) => handleToggleChange("performance", "enablePrefetching", checked)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="notifications">
            <Accordion type="single" collapsible className="w-full" defaultValue="channels">
              <AccordionItem value="channels">
                <AccordionTrigger className="text-base font-medium">Notification Channels</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Enable Email Notifications</Label>
                      <div className="text-sm text-muted-foreground">Send notifications via email</div>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.notifications.enableEmailNotifications}
                      onCheckedChange={(checked) =>
                        handleToggleChange("notifications", "enableEmailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Enable Push Notifications</Label>
                      <div className="text-sm text-muted-foreground">Send notifications to user devices</div>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.notifications.enablePushNotifications}
                      onCheckedChange={(checked) =>
                        handleToggleChange("notifications", "enablePushNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="in-app-notifications">Enable In-App Notifications</Label>
                      <div className="text-sm text-muted-foreground">Show notifications within the application</div>
                    </div>
                    <Switch
                      id="in-app-notifications"
                      checked={settings.notifications.enableInAppNotifications}
                      onCheckedChange={(checked) =>
                        handleToggleChange("notifications", "enableInAppNotifications", checked)
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="email-settings">
                <AccordionTrigger className="text-base font-medium">Email Settings</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="from-email">Default From Email</Label>
                    <Input
                      id="from-email"
                      type="email"
                      value={settings.notifications.defaultFromEmail}
                      onChange={(e) => handleInputChange("notifications", "defaultFromEmail", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="admin-recipients">Admin Email Recipients</Label>
                    <Input
                      id="admin-recipients"
                      value={settings.notifications.adminEmailRecipients}
                      onChange={(e) => handleInputChange("notifications", "adminEmailRecipients", e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground">Comma-separated list of email addresses</div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="digest">
                <AccordionTrigger className="text-base font-medium">Notification Digest</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="digest-frequency">Notification Digest Frequency</Label>
                    <Select
                      value={settings.notifications.notificationDigestFrequency}
                      onValueChange={(value) =>
                        handleSelectChange("notifications", "notificationDigestFrequency", value)
                      }
                    >
                      <SelectTrigger id="digest-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Instant (send immediately)</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="marketing">
                <AccordionTrigger className="text-base font-medium">Marketing Emails</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Enable Marketing Emails</Label>
                      <div className="text-sm text-muted-foreground">Send promotional emails to users</div>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={settings.notifications.enableMarketingEmails}
                      onCheckedChange={(checked) =>
                        handleToggleChange("notifications", "enableMarketingEmails", checked)
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Info className="h-4 w-4 mr-1" />
          Changes will be applied immediately after saving
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setConfirmResetOpen(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
