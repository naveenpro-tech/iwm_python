"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, Upload, Camera } from "lucide-react"
import Image from "next/image"
import type { ProfileFormData } from "../../types"

interface BasicInfoStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

export function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
  const [newCompany, setNewCompany] = useState("")

  const handleAddCompany = () => {
    if (newCompany.trim() && !data.companyAffiliation?.includes(newCompany.trim())) {
      updateData({
        companyAffiliation: [...(data.companyAffiliation || []), newCompany.trim()],
      })
      setNewCompany("")
    }
  }

  const handleRemoveCompany = (company: string) => {
    updateData({
      companyAffiliation: data.companyAffiliation?.filter((c) => c !== company),
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Enter your basic professional information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={data.name || ""}
                onChange={(e) => updateData({ name: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="e.g. Steven Spielberg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="officialTitle">Official Title/Role</Label>
              <Input
                id="officialTitle"
                value={data.officialTitle || ""}
                onChange={(e) => updateData({ officialTitle: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="e.g. Film Director & Producer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Company Affiliation(s)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {data.companyAffiliation?.map((company) => (
                <div key={company} className="bg-[#3A3A3A] text-white px-3 py-1 rounded-full flex items-center text-sm">
                  {company}
                  <button
                    type="button"
                    onClick={() => handleRemoveCompany(company)}
                    className="ml-2 text-gray-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <Input
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF] rounded-r-none"
                placeholder="e.g. Universal Pictures"
              />
              <Button
                type="button"
                onClick={handleAddCompany}
                className="rounded-l-none bg-[#00BFFF] hover:bg-[#0099CC] text-black"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biography/Statement</Label>
            <Textarea
              id="bio"
              value={data.bio || ""}
              onChange={(e) => updateData({ bio: e.target.value })}
              className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF] min-h-[200px]"
              placeholder="Share your professional journey, achievements, and vision..."
            />
            <p className="text-xs text-gray-400">
              {data.bio?.length || 0}/2000 characters (Rich text formatting coming soon)
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>Upload a professional headshot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-4 bg-[#1A1A1A] rounded-full overflow-hidden border-2 border-[#3A3A3A]">
                {data.profilePhoto ? (
                  <Image src={data.profilePhoto || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Camera className="w-12 h-12" />
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className="border-[#3A3A3A] hover:bg-[#3A3A3A]"
                onClick={() => updateData({ profilePhoto: "/christopher-nolan.png" })}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-gray-400 mt-2">Recommended: 400x400px, max 2MB</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Cover Photo</CardTitle>
            <CardDescription>Upload a banner image for your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-full h-32 mb-4 bg-[#1A1A1A] rounded-lg overflow-hidden border-2 border-[#3A3A3A]">
                {data.coverPhoto ? (
                  <Image src={data.coverPhoto || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Camera className="w-12 h-12" />
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className="border-[#3A3A3A] hover:bg-[#3A3A3A]"
                onClick={() => updateData({ coverPhoto: "/dark-blue-city-skyline.png" })}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Cover
              </Button>
              <p className="text-xs text-gray-400 mt-2">Recommended: 1500x500px, max 5MB</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
