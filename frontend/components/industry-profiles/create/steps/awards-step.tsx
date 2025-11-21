"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Award, Plus, Trash2, MoveVertical } from "lucide-react"
import type { ProfileFormData, Award as AwardType } from "../../types"

interface AwardsStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

export function AwardsStep({ data, updateData }: AwardsStepProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [year, setYear] = useState<number | "">("")
  const [project, setProject] = useState("")
  const [isNomination, setIsNomination] = useState(false)

  const handleAddAward = () => {
    if (name && year && project) {
      const newAward: AwardType = {
        id: `award-${Date.now()}`,
        name,
        category: category || undefined,
        year: Number(year),
        project,
        isNomination,
      }

      updateData({
        awards: [...(data.awards || []), newAward],
      })

      // Reset form
      setName("")
      setCategory("")
      setYear("")
      setProject("")
      setIsNomination(false)
    }
  }

  const handleRemoveAward = (id: string) => {
    updateData({
      awards: data.awards?.filter((award) => award.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Add Award or Recognition</CardTitle>
          <CardDescription>Add awards, nominations, and other industry recognition</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Award Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="e.g. Academy Award"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="e.g. Best Director"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value ? Number.parseInt(e.target.value) : "")}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="e.g. 2023"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Project/Film</Label>
              <Input
                id="project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="e.g. Oppenheimer"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isNomination" checked={isNomination} onCheckedChange={setIsNomination} />
            <Label htmlFor="isNomination">This is a nomination (not a win)</Label>
          </div>

          <Button
            onClick={handleAddAward}
            disabled={!name || !year || !project}
            className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Award
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Awards & Recognition</CardTitle>
            <CardDescription>Manage your industry accolades</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-[#3A3A3A] hover:bg-[#3A3A3A]">
            <MoveVertical className="w-4 h-4 mr-2" />
            Reorder
          </Button>
        </CardHeader>
        <CardContent>
          {data.awards && data.awards.length > 0 ? (
            <div className="space-y-3">
              {data.awards
                .sort((a, b) => b.year - a.year)
                .map((award) => (
                  <div key={award.id} className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${award.isNomination ? "bg-[#3A3A3A]" : "bg-[#FFD700]/20"}`}
                    >
                      <Award className={`w-5 h-5 ${award.isNomination ? "text-gray-300" : "text-[#FFD700]"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium flex items-center">
                            {award.name}
                            {award.isNomination && <span className="ml-2 text-sm text-gray-400">(Nomination)</span>}
                          </h4>
                          {award.category && <p className="text-sm text-gray-300">{award.category}</p>}
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <span>{award.year}</span>
                            <span className="mx-2">•</span>
                            <span>{award.project}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAward(award.id)}
                          className="text-gray-400 hover:text-white hover:bg-[#3A3A3A] h-6 w-6 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Award className="w-12 h-12 mx-auto mb-3 text-gray-500" />
              <p>No awards added yet</p>
              <p className="text-sm">Add your awards and nominations to showcase your achievements</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
