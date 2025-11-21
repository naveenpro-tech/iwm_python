"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Plus } from "lucide-react"
import type { FormData } from "../../types"

interface RequirementsStepProps {
  data: Partial<FormData>
  onUpdate: (data: Partial<FormData>) => void
}

export default function RequirementsStep({ data, onUpdate }: RequirementsStepProps) {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0)
  const [newSkill, setNewSkill] = useState("")
  const [newLanguage, setNewLanguage] = useState({ language: "", proficiency: "fluent" })

  const selectedRole = data.roles?.[selectedRoleIndex]

  const updateRoleRequirements = (requirements: any) => {
    if (!data.roles) return

    const updatedRoles = [...data.roles]
    updatedRoles[selectedRoleIndex] = {
      ...updatedRoles[selectedRoleIndex],
      requirements: {
        ...updatedRoles[selectedRoleIndex].requirements,
        ...requirements,
      },
    }

    onUpdate({ roles: updatedRoles })
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = selectedRole?.requirements?.skills || []
      updateRoleRequirements({
        skills: [...currentSkills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = selectedRole?.requirements?.skills || []
    updateRoleRequirements({
      skills: currentSkills.filter((skill) => skill !== skillToRemove),
    })
  }

  const addLanguage = () => {
    if (newLanguage.language.trim()) {
      const currentLanguages = selectedRole?.requirements?.languages || []
      updateRoleRequirements({
        languages: [...currentLanguages, newLanguage],
      })
      setNewLanguage({ language: "", proficiency: "fluent" })
    }
  }

  const removeLanguage = (index: number) => {
    const currentLanguages = selectedRole?.requirements?.languages || []
    updateRoleRequirements({
      languages: currentLanguages.filter((_, i) => i !== index),
    })
  }

  if (!data.roles || data.roles.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 bg-[#282828] border-[#3A3A3A] text-center">
          <p className="text-[#A0A0A0]">Please add at least one role in the previous step.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-6">Requirements & Preferences</h2>

        {/* Role Selector */}
        {data.roles.length > 1 && (
          <div className="mb-6">
            <Label>Select Role to Configure</Label>
            <Select
              value={selectedRoleIndex.toString()}
              onValueChange={(value) => setSelectedRoleIndex(Number.parseInt(value))}
            >
              <SelectTrigger className="bg-[#282828] border-[#3A3A3A]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {data.roles.map((role, index) => (
                  <SelectItem key={role.id} value={index.toString()}>
                    {role.title} ({role.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Card className="p-6 bg-[#282828] border-[#3A3A3A]">
          <h3 className="font-semibold mb-4">Requirements for: {selectedRole?.title}</h3>

          {/* Age Range */}
          <div className="space-y-2 mb-6">
            <Label>Age Range</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                placeholder="Min"
                value={selectedRole?.requirements?.ageRange?.min || ""}
                onChange={(e) =>
                  updateRoleRequirements({
                    ageRange: {
                      min: Number.parseInt(e.target.value) || 18,
                      max: selectedRole?.requirements?.ageRange?.max || 65,
                    },
                  })
                }
                className="w-24 bg-[#1A1A1A] border-[#3A3A3A]"
              />
              <span className="text-[#A0A0A0]">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={selectedRole?.requirements?.ageRange?.max || ""}
                onChange={(e) =>
                  updateRoleRequirements({
                    ageRange: {
                      min: selectedRole?.requirements?.ageRange?.min || 18,
                      max: Number.parseInt(e.target.value) || 65,
                    },
                  })
                }
                className="w-24 bg-[#1A1A1A] border-[#3A3A3A]"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2 mb-6">
            <Label>Gender</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Male", "Female", "Non-binary", "Open to All"].map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <Checkbox
                    id={gender}
                    checked={selectedRole?.requirements?.gender?.includes(gender) || false}
                    onCheckedChange={(checked) => {
                      const currentGenders = selectedRole?.requirements?.gender || []
                      if (checked) {
                        updateRoleRequirements({ gender: [...currentGenders, gender] })
                      } else {
                        updateRoleRequirements({ gender: currentGenders.filter((g) => g !== gender) })
                      }
                    }}
                  />
                  <Label htmlFor={gender} className="font-normal cursor-pointer">
                    {gender}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Ethnicity */}
          <div className="space-y-2 mb-6">
            <Label>Ethnicity</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Asian", "Black", "Hispanic/Latino", "Middle Eastern", "White", "Open to All"].map((ethnicity) => (
                <div key={ethnicity} className="flex items-center space-x-2">
                  <Checkbox
                    id={ethnicity}
                    checked={selectedRole?.requirements?.ethnicity?.includes(ethnicity) || false}
                    onCheckedChange={(checked) => {
                      const currentEthnicities = selectedRole?.requirements?.ethnicity || []
                      if (checked) {
                        updateRoleRequirements({ ethnicity: [...currentEthnicities, ethnicity] })
                      } else {
                        updateRoleRequirements({ ethnicity: currentEthnicities.filter((e) => e !== ethnicity) })
                      }
                    }}
                  />
                  <Label htmlFor={ethnicity} className="font-normal cursor-pointer">
                    {ethnicity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2 mb-6">
            <Label>Language Requirements</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Language"
                value={newLanguage.language}
                onChange={(e) => setNewLanguage({ ...newLanguage, language: e.target.value })}
                className="flex-1 bg-[#1A1A1A] border-[#3A3A3A]"
              />
              <Select
                value={newLanguage.proficiency}
                onValueChange={(value) => setNewLanguage({ ...newLanguage, proficiency: value })}
              >
                <SelectTrigger className="w-32 bg-[#1A1A1A] border-[#3A3A3A]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="native">Native</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addLanguage} size="sm" className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedRole?.requirements?.languages?.map((lang, index) => (
                <Badge key={index} variant="secondary" className="bg-[#3A3A3A]">
                  {lang.language} ({lang.proficiency})
                  <button onClick={() => removeLanguage(index)} className="ml-2 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Physical Attributes */}
          <div className="space-y-2 mb-6">
            <Label htmlFor="physicalAttributes">Physical Attributes (Optional)</Label>
            <Textarea
              id="physicalAttributes"
              value={selectedRole?.requirements?.physicalAttributes || ""}
              onChange={(e) => updateRoleRequirements({ physicalAttributes: e.target.value })}
              placeholder="e.g., Must be comfortable with stunts, specific height requirements"
              rows={2}
              className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
            />
          </div>

          {/* Skills */}
          <div className="space-y-2 mb-6">
            <Label>Required Skills</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
                className="flex-1 bg-[#1A1A1A] border-[#3A3A3A]"
              />
              <Button onClick={addSkill} size="sm" className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedRole?.requirements?.skills?.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-[#3A3A3A]">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2 mb-6">
            <Label>Experience Level</Label>
            <RadioGroup
              value={selectedRole?.requirements?.experienceLevel || "intermediate"}
              onValueChange={(value) => updateRoleRequirements({ experienceLevel: value })}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner" className="font-normal cursor-pointer">
                    Beginner
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate" className="font-normal cursor-pointer">
                    Intermediate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="professional" />
                  <Label htmlFor="professional" className="font-normal cursor-pointer">
                    Professional
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Union Status */}
          <div className="space-y-2">
            <Label>Union Status</Label>
            <Select
              value={selectedRole?.requirements?.unionStatus}
              onValueChange={(value) => updateRoleRequirements({ unionStatus: value })}
            >
              <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A]">
                <SelectValue placeholder="Select union status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sag-aftra">SAG-AFTRA Only</SelectItem>
                <SelectItem value="non-union">Non-Union Only</SelectItem>
                <SelectItem value="both">Both Welcome</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>
    </div>
  )
}
