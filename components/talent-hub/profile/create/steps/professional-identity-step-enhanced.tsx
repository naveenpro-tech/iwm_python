"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import type { ProfileFormData } from "../../types"

interface ProfessionalIdentityStepEnhancedProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

const roleCategories = {
  acting: ["Lead", "Supporting", "Character", "Extra", "Voice Acting", "Motion Capture"],
  crew: [
    "Director",
    "Producer",
    "Cinematographer",
    "Editor",
    "Sound Designer",
    "Production Designer",
    "Costume Designer",
    "Makeup Artist",
    "Gaffer",
    "Grip",
    "Script Supervisor",
    "Assistant Director",
  ],
}

const ethnicityOptions = [
  "Asian",
  "Black/African",
  "Caucasian/White",
  "Hispanic/Latino",
  "Middle Eastern",
  "Native American",
  "Pacific Islander",
  "Mixed/Multiracial",
  "Prefer not to say",
]

const languageOptions = [
  { name: "English", proficiencies: ["Native", "Fluent", "Conversational", "Basic"] },
  { name: "Hindi", proficiencies: ["Native", "Fluent", "Conversational", "Basic"] },
  { name: "Spanish", proficiencies: ["Native", "Fluent", "Conversational", "Basic"] },
  { name: "French", proficiencies: ["Native", "Fluent", "Conversational", "Basic"] },
  { name: "Mandarin", proficiencies: ["Native", "Fluent", "Conversational", "Basic"] },
  { name: "Arabic", proficiencies: ["Native", "Fluent", "Conversational", "Basic"] },
]

export function ProfessionalIdentityStepEnhanced({ data, updateData }: ProfessionalIdentityStepEnhancedProps) {
  const [newSkill, setNewSkill] = useState("")
  const [selectedLanguages, setSelectedLanguages] = useState<{ language: string; proficiency: string }[]>(
    data.languages || [],
  )

  const handleRoleTypeChange = (type: "talent" | "crew" | "both") => {
    updateData({ profileType: type })
  }

  const handlePrimaryRoleChange = (roles: string[]) => {
    updateData({ primaryRoles: roles })
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const skills = data.skills || []
      updateData({ skills: [...skills, newSkill.trim()] })
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    const skills = data.skills || []
    updateData({ skills: skills.filter((skill) => skill !== skillToRemove) })
  }

  const handleLanguageAdd = (language: string, proficiency: string) => {
    const exists = selectedLanguages.some((l) => l.language === language)
    if (!exists) {
      const updatedLanguages = [...selectedLanguages, { language, proficiency }]
      setSelectedLanguages(updatedLanguages)
      updateData({ languages: updatedLanguages })
    }
  }

  const handleLanguageRemove = (language: string) => {
    const updatedLanguages = selectedLanguages.filter((l) => l.language !== language)
    setSelectedLanguages(updatedLanguages)
    updateData({ languages: updatedLanguages })
  }

  const handleEthnicityChange = (ethnicity: string) => {
    updateData({ ethnicity })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Professional Identity</h2>
        <p className="text-muted-foreground">
          Define your professional identity in the film industry to help casting directors find you for the right roles.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">I am a:</h3>
              <RadioGroup
                value={data.profileType || "talent"}
                onValueChange={(value) => handleRoleTypeChange(value as "talent" | "crew" | "both")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="talent" id="talent" />
                  <Label htmlFor="talent">Talent/Actor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="crew" id="crew" />
                  <Label htmlFor="crew">Crew Member</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Both</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Primary Roles</h3>
              <p className="text-sm text-muted-foreground">Select all roles that apply to you</p>

              <Tabs defaultValue="acting" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="acting">Acting Roles</TabsTrigger>
                  <TabsTrigger value="crew">Crew Roles</TabsTrigger>
                </TabsList>
                <TabsContent value="acting" className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {roleCategories.acting.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role}`}
                          checked={(data.primaryRoles || []).includes(role)}
                          onCheckedChange={(checked) => {
                            const currentRoles = data.primaryRoles || []
                            if (checked) {
                              handlePrimaryRoleChange([...currentRoles, role])
                            } else {
                              handlePrimaryRoleChange(currentRoles.filter((r) => r !== role))
                            }
                          }}
                        />
                        <Label htmlFor={`role-${role}`}>{role}</Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="crew" className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {roleCategories.crew.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role}`}
                          checked={(data.primaryRoles || []).includes(role)}
                          onCheckedChange={(checked) => {
                            const currentRoles = data.primaryRoles || []
                            if (checked) {
                              handlePrimaryRoleChange([...currentRoles, role])
                            } else {
                              handlePrimaryRoleChange(currentRoles.filter((r) => r !== role))
                            }
                          }}
                        />
                        <Label htmlFor={`role-${role}`}>{role}</Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Skills & Talents</h3>
              <p className="text-sm text-muted-foreground">Add skills that make you stand out</p>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add a skill (e.g., Horseback Riding, Martial Arts)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {(data.skills || []).map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {(data.skills || []).length === 0 && (
                  <p className="text-sm text-muted-foreground">No skills added yet</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Languages</h3>
              <p className="text-sm text-muted-foreground">Add languages you speak</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a language</option>
                    {languageOptions.map((lang) => (
                      <option key={lang.name} value={lang.name}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="proficiency">Proficiency</Label>
                  <select
                    id="proficiency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select proficiency</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const langSelect = document.getElementById("language") as HTMLSelectElement
                  const profSelect = document.getElementById("proficiency") as HTMLSelectElement
                  if (langSelect.value && profSelect.value) {
                    handleLanguageAdd(langSelect.value, profSelect.value)
                    langSelect.value = ""
                    profSelect.value = ""
                  }
                }}
              >
                Add Language
              </Button>

              <div className="flex flex-wrap gap-2 mt-2">
                {selectedLanguages.map((lang) => (
                  <Badge key={lang.language} variant="secondary" className="px-3 py-1">
                    {lang.language} ({lang.proficiency})
                    <button
                      type="button"
                      onClick={() => handleLanguageRemove(lang.language)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedLanguages.length === 0 && (
                  <p className="text-sm text-muted-foreground">No languages added yet</p>
                )}
              </div>
            </div>

            {(data.profileType === "talent" || data.profileType === "both") && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ethnicity</h3>
                <p className="text-sm text-muted-foreground">
                  This information helps casting directors find diverse talent for authentic representation
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {ethnicityOptions.map((ethnicity) => (
                    <div key={ethnicity} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={ethnicity}
                        id={`ethnicity-${ethnicity}`}
                        checked={data.ethnicity === ethnicity}
                        onClick={() => handleEthnicityChange(ethnicity)}
                      />
                      <Label htmlFor={`ethnicity-${ethnicity}`}>{ethnicity}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
