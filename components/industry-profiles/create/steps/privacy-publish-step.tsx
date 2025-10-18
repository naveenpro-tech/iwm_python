"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Globe, Users, Lock, AlertTriangle, CheckCircle2, Eye } from "lucide-react"
import type { ProfileFormData } from "../../types"

interface PrivacyPublishStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

export function PrivacyPublishStep({ data, updateData }: PrivacyPublishStepProps) {
  const profileCompleteness = calculateProfileCompleteness(data)

  const handlePrivacyChange = (field: string, value: string) => {
    updateData({
      privacySettings: {
        ...data.privacySettings!,
        [field]: value,
      },
    })
  }

  const handleAllowQuestionsChange = (checked: boolean) => {
    updateData({
      privacySettings: {
        ...data.privacySettings!,
        allowQuestions: checked,
      },
    })
  }

  const missingRequiredFields = getRequiredFieldsMissing(data)

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control who can see your profile and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base">Profile Visibility</Label>
              <p className="text-sm text-gray-400 mb-3">Who can view your complete profile</p>
              <RadioGroup
                value={data.privacySettings?.profileVisibility || "public"}
                onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#3A3A3A]">
                  <RadioGroupItem value="public" id="visibility-public" />
                  <Label htmlFor="visibility-public" className="flex items-center cursor-pointer">
                    <Globe className="w-5 h-5 mr-2 text-green-400" />
                    <div>
                      <p className="font-medium">Public</p>
                      <p className="text-sm text-gray-400">Anyone can view your profile</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#3A3A3A]">
                  <RadioGroupItem value="industry-only" id="visibility-industry" />
                  <Label htmlFor="visibility-industry" className="flex items-center cursor-pointer">
                    <Users className="w-5 h-5 mr-2 text-blue-400" />
                    <div>
                      <p className="font-medium">Industry Only</p>
                      <p className="text-sm text-gray-400">
                        Only verified industry professionals can view your profile
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#3A3A3A]">
                  <RadioGroupItem value="private" id="visibility-private" />
                  <Label htmlFor="visibility-private" className="flex items-center cursor-pointer">
                    <Lock className="w-5 h-5 mr-2 text-red-400" />
                    <div>
                      <p className="font-medium">Private</p>
                      <p className="text-sm text-gray-400">Only you can view your profile</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base">Contact Information Visibility</Label>
              <p className="text-sm text-gray-400 mb-3">Who can see your contact details</p>
              <RadioGroup
                value={data.privacySettings?.contactVisibility || "industry-only"}
                onValueChange={(value) => handlePrivacyChange("contactVisibility", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#3A3A3A]">
                  <RadioGroupItem value="public" id="contact-public" />
                  <Label htmlFor="contact-public" className="flex items-center cursor-pointer">
                    <Globe className="w-5 h-5 mr-2 text-green-400" />
                    <div>
                      <p className="font-medium">Public</p>
                      <p className="text-sm text-gray-400">Anyone can see your contact information</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#3A3A3A]">
                  <RadioGroupItem value="industry-only" id="contact-industry" />
                  <Label htmlFor="contact-industry" className="flex items-center cursor-pointer">
                    <Users className="w-5 h-5 mr-2 text-blue-400" />
                    <div>
                      <p className="font-medium">Industry Only</p>
                      <p className="text-sm text-gray-400">
                        Only verified industry professionals can see your contact information
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#3A3A3A]">
                  <RadioGroupItem value="private" id="contact-private" />
                  <Label htmlFor="contact-private" className="flex items-center cursor-pointer">
                    <Lock className="w-5 h-5 mr-2 text-red-400" />
                    <div>
                      <p className="font-medium">Private</p>
                      <p className="text-sm text-gray-400">Your contact information is hidden from everyone</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base">Messaging Permissions</Label>
              <p className="text-sm text-gray-400 mb-3">Who can send you direct messages</p>
              <RadioGroup
                value={data.privacySettings?.allowMessages || "industry-only"}
                onValueChange={(value) => handlePrivacyChange("allowMessages", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#3A3A3A]">
                  <RadioGroupItem value="all" id="messages-all" />
                  <Label htmlFor="messages-all" className="flex items-center cursor-pointer">
                    <Globe className="w-5 h-5 mr-2 text-green-400" />
                    <div>
                      <p className="font-medium">Everyone</p>
                      <p className="text-sm text-gray-400">Anyone can send you messages</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#3A3A3A]">
                  <RadioGroupItem value="industry-only" id="messages-industry" />
                  <Label htmlFor="messages-industry" className="flex items-center cursor-pointer">
                    <Users className="w-5 h-5 mr-2 text-blue-400" />
                    <div>
                      <p className="font-medium">Industry Only</p>
                      <p className="text-sm text-gray-400">Only verified industry professionals can message you</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#3A3A3A]">
                  <RadioGroupItem value="none" id="messages-none" />
                  <Label htmlFor="messages-none" className="flex items-center cursor-pointer">
                    <Lock className="w-5 h-5 mr-2 text-red-400" />
                    <div>
                      <p className="font-medium">No One</p>
                      <p className="text-sm text-gray-400">Disable direct messaging completely</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <Label className="font-medium">Allow Fan Questions</Label>
                  <p className="text-sm text-gray-400">Let fans submit questions for you to answer in your Pulses</p>
                </div>
              </div>
              <Switch
                checked={data.privacySettings?.allowQuestions || false}
                onCheckedChange={handleAllowQuestionsChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Completeness */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Profile Completeness</CardTitle>
          <CardDescription>Review your profile before publishing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full bg-[#1A1A1A] rounded-full h-4">
            <div
              className={`h-4 rounded-full ${
                profileCompleteness < 50 ? "bg-red-500" : profileCompleteness < 80 ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{ width: `${profileCompleteness}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span>Profile Completeness</span>
            <span className="font-medium">{profileCompleteness}%</span>
          </div>

          {missingRequiredFields.length > 0 && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-500 text-red-300">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Required fields missing</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  {missingRequiredFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {profileCompleteness >= 100 && (
            <Alert className="bg-green-900/20 border-green-500 text-green-300">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Profile Complete!</AlertTitle>
              <AlertDescription>Your profile is ready to be published.</AlertDescription>
            </Alert>
          )}

          <Button className="w-full mt-4 bg-[#1A1A1A] hover:bg-[#282828] border border-[#3A3A3A]">
            <Eye className="w-4 h-4 mr-2" />
            Preview Profile
          </Button>
        </CardContent>
      </Card>

      {/* Publish Profile */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Publish Your Profile</CardTitle>
          <CardDescription>Make your profile visible to the world</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black" disabled={profileCompleteness < 70}>
            Publish Profile
          </Button>
          {profileCompleteness < 70 && (
            <p className="text-sm text-yellow-400 mt-2">
              Your profile must be at least 70% complete before publishing.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function calculateProfileCompleteness(data: ProfileFormData): number {
  const requiredFields = [
    !!data.name,
    !!data.officialTitle,
    !!data.bio,
    !!data.profilePhoto,
    !!data.coverPhoto,
    data.companyAffiliation && data.companyAffiliation.length > 0,
    data.verificationDocuments && data.verificationDocuments.length > 0,
    data.filmography && data.filmography.length > 0,
  ]

  const optionalFields = [
    data.awards && data.awards.length > 0,
    data.pressKit && data.pressKit.length > 0,
    data.socialMedia && data.socialMedia.length > 0,
    data.scheduledPulses && data.scheduledPulses.length > 0,
  ]

  const requiredWeight = 0.7 // 70% of the score
  const optionalWeight = 0.3 // 30% of the score

  const requiredScore = requiredFields.filter(Boolean).length / requiredFields.length
  const optionalScore = optionalFields.filter(Boolean).length / optionalFields.length

  const totalScore = (requiredScore * requiredWeight + optionalScore * optionalWeight) * 100

  return Math.round(totalScore)
}

function getRequiredFieldsMissing(data: ProfileFormData): string[] {
  const missing: string[] = []

  if (!data.name) missing.push("Full Name")
  if (!data.officialTitle) missing.push("Official Title/Role")
  if (!data.bio) missing.push("Biography/Statement")
  if (!data.profilePhoto) missing.push("Profile Photo")
  if (!data.coverPhoto) missing.push("Cover Photo")
  if (!data.companyAffiliation || data.companyAffiliation.length === 0) missing.push("Company Affiliation")
  if (!data.verificationDocuments || data.verificationDocuments.length === 0) missing.push("Verification Documents")
  if (!data.filmography || data.filmography.length === 0) missing.push("Filmography")

  return missing
}
