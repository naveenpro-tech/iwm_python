"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Info, Shield, Eye, Users, UserCog, Lock, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export function PrivacySettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    dataRetention: {
      profileDataRetention: "2-years",
      inactiveAccountPolicy: "archive",
      dataExportFormat: "json",
      automaticDeletion: true,
    },
    visibilityControls: {
      defaultProfileVisibility: "registered",
      allowAnonymousBrowsing: true,
      hideContactInfoByDefault: true,
      allowProfileIndexing: false,
    },
    consentManagement: {
      requireExplicitConsent: true,
      consentUpdateFrequency: "major-changes",
      allowConsentWithdrawal: true,
      trackConsentHistory: true,
    },
    privacyPolicy: {
      currentVersion: "2.1",
      lastUpdated: "2023-11-15",
      requireAcceptance: true,
      policyText:
        "This is the privacy policy for the Talent Hub. It outlines how we collect, use, and protect your personal information...",
    },
  })

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Settings saved",
      description: "Your privacy settings have been updated successfully.",
    })

    setIsSaving(false)
  }

  const updateSettings = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Privacy Settings</h2>
            <p className="text-muted-foreground">Configure privacy and data protection settings for the Talent Hub</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isSaving ? "Saving..." : "Save Changes"}
            {!isSaving && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
        <Separator className="my-6" />
      </motion.div>

      <Tabs defaultValue="data-retention" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="data-retention" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Data Retention</span>
          </TabsTrigger>
          <TabsTrigger value="visibility" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>Visibility Controls</span>
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span>Consent Management</span>
          </TabsTrigger>
          <TabsTrigger value="policy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Privacy Policy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data-retention">
          <motion.div className="grid gap-6" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Data Retention Policies</CardTitle>
                  <CardDescription>
                    Configure how long user data is stored and what happens to inactive accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profile-data-retention">Profile Data Retention Period</Label>
                      <Select
                        value={settings.dataRetention.profileDataRetention}
                        onValueChange={(value) => updateSettings("dataRetention", "profileDataRetention", value)}
                      >
                        <SelectTrigger id="profile-data-retention" className="w-full mt-1.5">
                          <SelectValue placeholder="Select retention period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6-months">6 Months</SelectItem>
                          <SelectItem value="1-year">1 Year</SelectItem>
                          <SelectItem value="2-years">2 Years</SelectItem>
                          <SelectItem value="5-years">5 Years</SelectItem>
                          <SelectItem value="indefinite">Indefinite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="inactive-account-policy">Inactive Account Policy</Label>
                      <Select
                        value={settings.dataRetention.inactiveAccountPolicy}
                        onValueChange={(value) => updateSettings("dataRetention", "inactiveAccountPolicy", value)}
                      >
                        <SelectTrigger id="inactive-account-policy" className="w-full mt-1.5">
                          <SelectValue placeholder="Select policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="notify">Notify User</SelectItem>
                          <SelectItem value="archive">Archive Account</SelectItem>
                          <SelectItem value="anonymize">Anonymize Data</SelectItem>
                          <SelectItem value="delete">Delete Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="data-export-format">Data Export Format</Label>
                      <Select
                        value={settings.dataRetention.dataExportFormat}
                        onValueChange={(value) => updateSettings("dataRetention", "dataExportFormat", value)}
                      >
                        <SelectTrigger id="data-export-format" className="w-full mt-1.5">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="xml">XML</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="automatic-deletion">Automatic Deletion</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically delete user data after retention period
                        </p>
                      </div>
                      <Switch
                        id="automatic-deletion"
                        checked={settings.dataRetention.automaticDeletion}
                        onCheckedChange={(checked) => updateSettings("dataRetention", "automaticDeletion", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="visibility">
          <motion.div className="grid gap-6" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Visibility Controls</CardTitle>
                  <CardDescription>
                    Configure default visibility settings and privacy controls for talent profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Default Profile Visibility</Label>
                      <RadioGroup
                        value={settings.visibilityControls.defaultProfileVisibility}
                        onValueChange={(value) =>
                          updateSettings("visibilityControls", "defaultProfileVisibility", value)
                        }
                        className="grid grid-cols-1 gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label htmlFor="public" className="flex items-center gap-2 font-normal">
                            <Users className="h-4 w-4" />
                            Public (visible to everyone)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="registered" id="registered" />
                          <Label htmlFor="registered" className="flex items-center gap-2 font-normal">
                            <UserCog className="h-4 w-4" />
                            Registered Users Only
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="industry" id="industry" />
                          <Label htmlFor="industry" className="flex items-center gap-2 font-normal">
                            <Lock className="h-4 w-4" />
                            Industry Professionals Only
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="anonymous-browsing">Allow Anonymous Browsing</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow non-logged in users to browse talent profiles
                        </p>
                      </div>
                      <Switch
                        id="anonymous-browsing"
                        checked={settings.visibilityControls.allowAnonymousBrowsing}
                        onCheckedChange={(checked) =>
                          updateSettings("visibilityControls", "allowAnonymousBrowsing", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="hide-contact-info">Hide Contact Info by Default</Label>
                        <p className="text-sm text-muted-foreground">
                          Hide contact information until explicitly shared
                        </p>
                      </div>
                      <Switch
                        id="hide-contact-info"
                        checked={settings.visibilityControls.hideContactInfoByDefault}
                        onCheckedChange={(checked) =>
                          updateSettings("visibilityControls", "hideContactInfoByDefault", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="profile-indexing">Allow Profile Indexing by Search Engines</Label>
                        <p className="text-sm text-muted-foreground">Allow search engines to index talent profiles</p>
                      </div>
                      <Switch
                        id="profile-indexing"
                        checked={settings.visibilityControls.allowProfileIndexing}
                        onCheckedChange={(checked) =>
                          updateSettings("visibilityControls", "allowProfileIndexing", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="consent">
          <motion.div className="grid gap-6" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Consent Management</CardTitle>
                  <CardDescription>Configure how user consent is collected, stored, and managed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="explicit-consent">Require Explicit Consent</Label>
                        <p className="text-sm text-muted-foreground">
                          Require users to explicitly consent to data processing
                        </p>
                      </div>
                      <Switch
                        id="explicit-consent"
                        checked={settings.consentManagement.requireExplicitConsent}
                        onCheckedChange={(checked) =>
                          updateSettings("consentManagement", "requireExplicitConsent", checked)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="consent-update-frequency">Consent Update Frequency</Label>
                      <Select
                        value={settings.consentManagement.consentUpdateFrequency}
                        onValueChange={(value) => updateSettings("consentManagement", "consentUpdateFrequency", value)}
                      >
                        <SelectTrigger id="consent-update-frequency" className="w-full mt-1.5">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="every-login">Every Login</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                          <SelectItem value="major-changes">Only for Major Changes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="consent-withdrawal">Allow Consent Withdrawal</Label>
                        <p className="text-sm text-muted-foreground">Allow users to withdraw consent at any time</p>
                      </div>
                      <Switch
                        id="consent-withdrawal"
                        checked={settings.consentManagement.allowConsentWithdrawal}
                        onCheckedChange={(checked) =>
                          updateSettings("consentManagement", "allowConsentWithdrawal", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="consent-history">Track Consent History</Label>
                        <p className="text-sm text-muted-foreground">Keep a record of all consent changes</p>
                      </div>
                      <Switch
                        id="consent-history"
                        checked={settings.consentManagement.trackConsentHistory}
                        onCheckedChange={(checked) =>
                          updateSettings("consentManagement", "trackConsentHistory", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="policy">
          <motion.div className="grid gap-6" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy Management</CardTitle>
                  <CardDescription>Manage the platform's privacy policy and related settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="policy-version">Current Version</Label>
                      <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1.5">
                        {settings.privacyPolicy.currentVersion}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="last-updated">Last Updated</Label>
                      <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1.5">
                        {settings.privacyPolicy.lastUpdated}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="require-acceptance">Require Policy Acceptance</Label>
                      <p className="text-sm text-muted-foreground">Require users to accept the privacy policy</p>
                    </div>
                    <Switch
                      id="require-acceptance"
                      checked={settings.privacyPolicy.requireAcceptance}
                      onCheckedChange={(checked) => updateSettings("privacyPolicy", "requireAcceptance", checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="policy-text">Privacy Policy Text</Label>
                    <Textarea
                      id="policy-text"
                      value={settings.privacyPolicy.policyText}
                      onChange={(e) => updateSettings("privacyPolicy", "policyText", e.target.value)}
                      className="min-h-[200px] mt-1.5"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Info className="mr-2 h-4 w-4" />
                    Changes to the privacy policy may require user re-consent
                  </div>
                  <Button variant="outline">Preview Policy</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
