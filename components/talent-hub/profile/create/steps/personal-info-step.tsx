"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Lock, Users } from "lucide-react"
import type { ProfileFormData } from "../../types"

interface PersonalInfoStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

export function PersonalInfoStep({ data, updateData }: PersonalInfoStepProps) {
  const handlePrivacyChange = (field: string, level: string) => {
    updateData({
      privacySettings: {
        ...data.privacySettings!,
        sectionPrivacy: {
          ...data.privacySettings?.sectionPrivacy,
          [field]: level,
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>This information helps casting directors and crew leaders find you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={data.fullName || ""}
                onChange={(e) => updateData({ fullName: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="professionalName">Professional/Stage Name</Label>
              <Input
                id="professionalName"
                value={data.professionalName || ""}
                onChange={(e) => updateData({ professionalName: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A]"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email *</Label>
                <PrivacyToggle
                  value={data.privacySettings?.sectionPrivacy?.email || "verified-only"}
                  onChange={(value) => handlePrivacyChange("email", value)}
                />
              </div>
              <Input
                id="email"
                type="email"
                value={data.email || ""}
                onChange={(e) => updateData({ email: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A]"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone">Phone Number</Label>
                <PrivacyToggle
                  value={data.privacySettings?.sectionPrivacy?.phone || "private"}
                  onChange={(value) => handlePrivacyChange("phone", value)}
                />
              </div>
              <Input
                id="phone"
                type="tel"
                value={data.phone || ""}
                onChange={(e) => updateData({ phone: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A]"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Location</Label>
              <PrivacyToggle
                value={data.privacySettings?.sectionPrivacy?.location || "public"}
                onChange={(value) => handlePrivacyChange("location", value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="City"
                value={data.location?.city || ""}
                onChange={(e) =>
                  updateData({
                    location: { ...data.location!, city: e.target.value },
                  })
                }
                className="bg-[#1A1A1A] border-[#3A3A3A]"
              />
              <Input
                placeholder="State/Province"
                value={data.location?.state || ""}
                onChange={(e) =>
                  updateData({
                    location: { ...data.location!, state: e.target.value },
                  })
                }
                className="bg-[#1A1A1A] border-[#3A3A3A]"
              />
              <Input
                placeholder="Country"
                value={data.location?.country || ""}
                onChange={(e) =>
                  updateData({
                    location: { ...data.location!, country: e.target.value },
                  })
                }
                className="bg-[#1A1A1A] border-[#3A3A3A]"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split("T")[0] : ""}
                onChange={(e) => updateData({ dateOfBirth: new Date(e.target.value) })}
                className="bg-[#1A1A1A] border-[#3A3A3A]"
              />
              <p className="text-xs text-gray-400">Used for age calculation only</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="genderIdentity">Gender Identity</Label>
              <Input
                id="genderIdentity"
                value={data.genderIdentity || ""}
                onChange={(e) => updateData({ genderIdentity: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A]"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pronouns">Pronouns</Label>
              <Input
                id="pronouns"
                value={data.pronouns || ""}
                onChange={(e) => updateData({ pronouns: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A]"
                placeholder="e.g., they/them"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PrivacyToggle({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const options = [
    { value: "public", icon: Globe, label: "Public" },
    { value: "verified-only", icon: Users, label: "Industry" },
    { value: "private", icon: Lock, label: "Private" },
  ]

  return (
    <div className="flex items-center gap-1">
      {options.map((option) => {
        const Icon = option.icon
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-1 rounded transition-colors ${
              value === option.value ? "bg-[#00BFFF] text-black" : "bg-[#3A3A3A] text-gray-400 hover:text-white"
            }`}
            title={option.label}
          >
            <Icon className="w-3 h-3" />
          </button>
        )
      })}
    </div>
  )
}
