"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import type { ProfileFormData } from "../../types"

interface ProfessionalIdentityStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

const actorPhysicalAttributes = [
  { id: "height", label: "Height", placeholder: "e.g., 5'10\"" },
  { id: "weight", label: "Weight Range", placeholder: "e.g., 150-160 lbs" },
  { id: "hairColor", label: "Hair Color", placeholder: "e.g., Brown" },
  { id: "eyeColor", label: "Eye Color", placeholder: "e.g., Blue" },
  { id: "ethnicity", label: "Ethnicity", placeholder: "Optional" },
  { id: "bodyType", label: "Body Type", placeholder: "e.g., Athletic" },
]

const crewDepartments = [
  "Camera",
  "Lighting",
  "Sound",
  "Production",
  "Post-Production",
  "Art Department",
  "Costume",
  "Makeup",
  "Special Effects",
  "Stunts",
]

export function ProfessionalIdentityStep({ data, updateData }: ProfessionalIdentityStepProps) {
  const [newLanguage, setNewLanguage] = useState({ language: "", proficiency: "basic" })
  const [newSecondaryRole, setNewSecondaryRole] = useState("")

  const handleAddLanguage = () => {
    if (newLanguage.language) {
      const languages = data.languages || []
      updateData({ languages: [...languages, newLanguage] })
      setNewLanguage({ language: "", proficiency: "basic" })
    }
  }

  const handleRemoveLanguage = (index: number) => {
    const languages = data.languages || []
    updateData({ languages: languages.filter((_, i) => i !== index) })
  }

  const handleAddSecondaryRole = () => {
    if (newSecondaryRole) {
      const roles = data.secondaryRoles || []
      updateData({ secondaryRoles: [...roles, newSecondaryRole] })
      setNewSecondaryRole("")
    }
  }

  const handleRemoveSecondaryRole = (role: string) => {
    const roles = data.secondaryRoles || []
    updateData({ secondaryRoles: roles.filter((r) => r !== role) })
  }

  return (
    <div className="space-y-6">
      {/* Primary Role */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Professional Identity</CardTitle>
          <CardDescription>Define your primary role and professional details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryRole">Primary Role *</Label>
              <Select
                value={data.primaryRole}
                onValueChange={(value: "actor" | "crew") => updateData({ primaryRole: value })}
              >
                <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A]">
                  <SelectValue placeholder="Select your primary role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actor">Actor</SelectItem>
                  <SelectItem value="crew">Crew Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unionStatus">Union Status</Label>
              <Select value={data.unionStatus} onValueChange={(value: any) => updateData({ unionStatus: value })}>
                <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A]">
                  <SelectValue placeholder="Select union status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sag-aftra">SAG-AFTRA</SelectItem>
                  <SelectItem value="non-union">Non-Union</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                value={data.yearsOfExperience || ""}
                onChange={(e) => updateData({ yearsOfExperience: Number.parseInt(e.target.value) })}
                className="bg-[#1A1A1A] border-[#3A3A3A]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalWebsite">Professional Website</Label>
              <Input
                id="professionalWebsite"
                type="url"
                value={data.professionalWebsite || ""}
                onChange={(e) => updateData({ professionalWebsite: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A]"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Secondary Roles */}
          <div className="space-y-2">
            <Label>Secondary Roles</Label>
            <div className="flex gap-2">
              <Input
                value={newSecondaryRole}
                onChange={(e) => setNewSecondaryRole(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A]"
                placeholder="e.g., Director, Writer, Producer"
                onKeyPress={(e) => e.key === "Enter" && handleAddSecondaryRole()}
              />
              <Button
                type="button"
                onClick={handleAddSecondaryRole}
                size="sm"
                className="bg-[#00BFFF] hover:bg-[#0099CC] text-black"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.secondaryRoles?.map((role) => (
                <Badge key={role} variant="secondary" className="bg-[#3A3A3A] text-white">
                  {role}
                  <button onClick={() => handleRemoveSecondaryRole(role)} className="ml-2 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <Label>Languages Spoken</Label>
            <div className="flex gap-2">
              <Input
                value={newLanguage.language}
                onChange={(e) => setNewLanguage({ ...newLanguage, language: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A]"
                placeholder="Language"
              />
              <Select
                value={newLanguage.proficiency}
                onValueChange={(value) => setNewLanguage({ ...newLanguage, proficiency: value })}
              >
                <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                  <SelectItem value="native">Native</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleAddLanguage}
                size="sm"
                className="bg-[#00BFFF] hover:bg-[#0099CC] text-black"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {data.languages?.map((lang, index) => (
                <div key={index} className="flex items-center justify-between bg-[#1A1A1A] p-2 rounded">
                  <span>
                    {lang.language} - {lang.proficiency}
                  </span>
                  <button onClick={() => handleRemoveLanguage(index)} className="text-red-400 hover:text-red-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Details */}
      {data.primaryRole === "actor" && (
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Actor Details</CardTitle>
            <CardDescription>Physical attributes for casting (all optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age Range for Casting</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={data.actorDetails?.ageRange?.min || ""}
                    onChange={(e) =>
                      updateData({
                        actorDetails: {
                          ...data.actorDetails,
                          ageRange: {
                            ...data.actorDetails?.ageRange!,
                            min: Number.parseInt(e.target.value),
                          },
                        },
                      })
                    }
                    className="bg-[#1A1A1A] border-[#3A3A3A]"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={data.actorDetails?.ageRange?.max || ""}
                    onChange={(e) =>
                      updateData({
                        actorDetails: {
                          ...data.actorDetails,
                          ageRange: {
                            ...data.actorDetails?.ageRange!,
                            max: Number.parseInt(e.target.value),
                          },
                        },
                      })
                    }
                    className="bg-[#1A1A1A] border-[#3A3A3A]"
                  />
                </div>
              </div>

              {actorPhysicalAttributes.map((attr) => (
                <div key={attr.id} className="space-y-2">
                  <Label htmlFor={attr.id}>{attr.label}</Label>
                  <Input
                    id={attr.id}
                    value={data.actorDetails?.[attr.id as keyof typeof data.actorDetails] || ""}
                    onChange={(e) =>
                      updateData({
                        actorDetails: {
                          ...data.actorDetails,
                          [attr.id]: e.target.value,
                        },
                      })
                    }
                    className="bg-[#1A1A1A] border-[#3A3A3A]"
                    placeholder={attr.placeholder}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.primaryRole === "crew" && (
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Crew Details</CardTitle>
            <CardDescription>Your department and technical expertise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={data.crewDetails?.department}
                onValueChange={(value) =>
                  updateData({
                    crewDetails: { ...data.crewDetails!, department: value },
                  })
                }
              >
                <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A]">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  {crewDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept.toLowerCase().replace(" ", "-")}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional crew fields would go here */}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
