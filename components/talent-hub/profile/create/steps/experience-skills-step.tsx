"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Film, Briefcase } from "lucide-react"
import type { ProfileFormData, ProjectExperience } from "../../types"

interface ExperienceSkillsStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

const skillCategories = {
  actor: [
    { category: "Performance", items: ["Singing", "Dancing", "Stage Combat", "Improvisation", "Voice Acting"] },
    { category: "Accents & Dialects", items: ["British", "American Southern", "New York", "Australian", "Irish"] },
    { category: "Musical Instruments", items: ["Piano", "Guitar", "Violin", "Drums", "Saxophone"] },
    { category: "Sports & Physical", items: ["Martial Arts", "Horseback Riding", "Swimming", "Rock Climbing", "Yoga"] },
    { category: "Special Skills", items: ["Fire Breathing", "Juggling", "Magic Tricks", "Mime", "Puppetry"] },
  ],
  crew: [
    { category: "Camera", items: ["RED", "ARRI", "Blackmagic", "Sony", "Canon"] },
    { category: "Lighting", items: ["Gaffer", "Key Grip", "LED Systems", "Natural Light", "Studio Lighting"] },
    { category: "Sound", items: ["Boom Operation", "Sound Mixing", "ADR", "Foley", "Location Sound"] },
    {
      category: "Post-Production",
      items: ["Premiere Pro", "Final Cut", "DaVinci Resolve", "After Effects", "Pro Tools"],
    },
    {
      category: "Special Skills",
      items: ["Drone Operation", "Underwater Filming", "Steadicam", "Motion Control", "VFX"],
    },
  ],
}

export function ExperienceSkillsStep({ data, updateData }: ExperienceSkillsStepProps) {
  const [showAddExperience, setShowAddExperience] = useState(false)
  const [newExperience, setNewExperience] = useState<Partial<ProjectExperience>>({
    productionType: "film",
  })
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set())

  const handleAddExperience = () => {
    if (newExperience.title && newExperience.role) {
      const experience = data.experience || []
      updateData({
        experience: [
          ...experience,
          {
            ...newExperience,
            id: Date.now().toString(),
            year: newExperience.year || new Date().getFullYear(),
          } as ProjectExperience,
        ],
      })
      setNewExperience({ productionType: "film" })
      setShowAddExperience(false)
    }
  }

  const handleRemoveExperience = (id: string) => {
    const experience = data.experience || []
    updateData({ experience: experience.filter((exp) => exp.id !== id) })
  }

  const handleToggleSkill = (category: string, skill: string) => {
    const newSelectedSkills = new Set(selectedSkills)
    const skillKey = `${category}:${skill}`

    if (newSelectedSkills.has(skillKey)) {
      newSelectedSkills.delete(skillKey)
    } else {
      newSelectedSkills.add(skillKey)
    }

    setSelectedSkills(newSelectedSkills)

    // Update the data structure
    const skills = Array.from(newSelectedSkills).reduce((acc, key) => {
      const [cat, skillName] = key.split(":")
      const existing = acc.find((s) => s.category === cat)
      if (existing) {
        existing.items.push({ name: skillName, proficiency: "intermediate" })
      } else {
        acc.push({
          category: cat,
          items: [{ name: skillName, proficiency: "intermediate" }],
        })
      }
      return acc
    }, [] as any[])

    updateData({ skills })
  }

  const relevantSkills = skillCategories[data.primaryRole as keyof typeof skillCategories] || []

  return (
    <div className="space-y-6">
      {/* Experience Section */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Experience & Filmography</CardTitle>
          <CardDescription>Add your professional credits and work history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            onClick={() => setShowAddExperience(true)}
            className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>

          {showAddExperience && (
            <div className="bg-[#1A1A1A] p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Title *</Label>
                  <Input
                    value={newExperience.title || ""}
                    onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                    className="bg-[#282828] border-[#3A3A3A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Your Role *</Label>
                  <Input
                    value={newExperience.role || ""}
                    onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                    className="bg-[#282828] border-[#3A3A3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Production Type</Label>
                  <Select
                    value={newExperience.productionType}
                    onValueChange={(value: any) => setNewExperience({ ...newExperience, productionType: value })}
                  >
                    <SelectTrigger className="bg-[#282828] border-[#3A3A3A]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="film">Film</SelectItem>
                      <SelectItem value="tv">TV Series</SelectItem>
                      <SelectItem value="theater">Theater</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={newExperience.year || ""}
                    onChange={(e) => setNewExperience({ ...newExperience, year: Number.parseInt(e.target.value) })}
                    className="bg-[#282828] border-[#3A3A3A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Director/Company</Label>
                  <Input
                    value={newExperience.company || ""}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    className="bg-[#282828] border-[#3A3A3A]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newExperience.description || ""}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                  className="bg-[#282828] border-[#3A3A3A]"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleAddExperience}
                  className="bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                >
                  Add Experience
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddExperience(false)}
                  className="border-[#3A3A3A] hover:bg-[#282828]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Experience List */}
          <div className="space-y-3">
            {data.experience?.map((exp) => (
              <div key={exp.id} className="bg-[#1A1A1A] p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="p-2 bg-[#282828] rounded">
                      {exp.productionType === "film" ? (
                        <Film className="w-5 h-5 text-[#00BFFF]" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-[#00BFFF]" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{exp.title}</h4>
                      <p className="text-sm text-gray-400">
                        {exp.role} • {exp.year}
                      </p>
                      {exp.company && <p className="text-sm text-gray-500">{exp.company}</p>}
                      {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                    </div>
                  </div>
                  <button onClick={() => handleRemoveExperience(exp.id)} className="text-red-400 hover:text-red-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Skills & Abilities</CardTitle>
          <CardDescription>Select all skills that apply to your professional work</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {relevantSkills.map((category) => (
            <div key={category.category} className="space-y-3">
              <h3 className="font-medium text-sm text-gray-400">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill) => {
                  const isSelected = selectedSkills.has(`${category.category}:${skill}`)
                  return (
                    <Badge
                      key={skill}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[#00BFFF] text-black border-[#00BFFF]"
                          : "border-[#3A3A3A] hover:border-[#00BFFF]"
                      }`}
                      onClick={() => handleToggleSkill(category.category, skill)}
                    >
                      {skill}
                    </Badge>
                  )
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
