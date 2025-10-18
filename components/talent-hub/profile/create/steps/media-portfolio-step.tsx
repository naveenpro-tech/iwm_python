"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, ImageIcon, Film, Link, X, Plus } from "lucide-react"
import type { ProfileFormData } from "../../types"

interface MediaPortfolioStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

export function MediaPortfolioStep({ data, updateData }: MediaPortfolioStepProps) {
  const [dragActive, setDragActive] = useState(false)
  const [newPortfolioLink, setNewPortfolioLink] = useState({ platform: "", url: "" })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log("Files dropped:", e.dataTransfer.files)
    }
  }

  const handleAddPortfolioLink = () => {
    if (newPortfolioLink.platform && newPortfolioLink.url) {
      const links = data.portfolioLinks || []
      updateData({ portfolioLinks: [...links, newPortfolioLink] })
      setNewPortfolioLink({ platform: "", url: "" })
    }
  }

  const handleRemovePortfolioLink = (index: number) => {
    const links = data.portfolioLinks || []
    updateData({ portfolioLinks: links.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      {/* Profile & Cover Photos */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Profile Photos</CardTitle>
          <CardDescription>Upload your headshot and cover photo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Photo */}
            <div className="space-y-2">
              <Label>Profile Photo (Headshot) *</Label>
              <div className="relative aspect-square bg-[#1A1A1A] rounded-lg border-2 border-dashed border-[#3A3A3A] hover:border-[#00BFFF] transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => console.log("Profile photo selected:", e.target.files)}
                />
                <div className="flex flex-col items-center justify-center h-full">
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">Click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended: 400x400px</p>
                </div>
              </div>
            </div>

            {/* Cover Photo */}
            <div className="space-y-2">
              <Label>Cover Photo</Label>
              <div className="relative aspect-video bg-[#1A1A1A] rounded-lg border-2 border-dashed border-[#3A3A3A] hover:border-[#00BFFF] transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => console.log("Cover photo selected:", e.target.files)}
                />
                <div className="flex flex-col items-center justify-center h-full">
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">Click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended: 1200x400px</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Photos Gallery */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Photo Gallery</CardTitle>
          <CardDescription>Add additional photos showcasing your work and range</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative min-h-[200px] bg-[#1A1A1A] rounded-lg border-2 border-dashed ${
              dragActive ? "border-[#00BFFF] bg-[#00BFFF]/10" : "border-[#3A3A3A]"
            } transition-colors`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => console.log("Gallery photos selected:", e.target.files)}
            />
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-400">Drag & drop photos here</p>
              <p className="text-xs text-gray-500 mt-1">or click to browse</p>
            </div>
          </div>

          {/* Photo Grid Preview */}
          {data.additionalPhotos && data.additionalPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {data.additionalPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt={photo.caption || "Gallery photo"}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      const photos = data.additionalPhotos?.filter((p) => p.id !== photo.id)
                      updateData({ additionalPhotos: photos })
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Showreel/Demo Reel */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Showreel / Demo Reel</CardTitle>
          <CardDescription>Upload or link to your professional reel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Upload Video</Label>
              <div className="relative bg-[#1A1A1A] rounded-lg border-2 border-dashed border-[#3A3A3A] hover:border-[#00BFFF] transition-colors cursor-pointer p-4">
                <input
                  type="file"
                  accept="video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => console.log("Showreel selected:", e.target.files)}
                />
                <div className="flex items-center gap-3">
                  <Film className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Click to upload video</p>
                    <p className="text-xs text-gray-500">MP4, MOV up to 500MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Or paste video link</Label>
              <Input
                placeholder="YouTube or Vimeo URL"
                value={data.showreel?.url || ""}
                onChange={(e) =>
                  updateData({
                    showreel: { ...data.showreel!, url: e.target.value, platform: "youtube" },
                  })
                }
                className="bg-[#1A1A1A] border-[#3A3A3A]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Links */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Portfolio Links</CardTitle>
          <CardDescription>Add links to your professional profiles and portfolios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Platform (e.g., IMDB)"
              value={newPortfolioLink.platform}
              onChange={(e) => setNewPortfolioLink({ ...newPortfolioLink, platform: e.target.value })}
              className="bg-[#1A1A1A] border-[#3A3A3A]"
            />
            <Input
              placeholder="URL"
              value={newPortfolioLink.url}
              onChange={(e) => setNewPortfolioLink({ ...newPortfolioLink, url: e.target.value })}
              className="bg-[#1A1A1A] border-[#3A3A3A]"
            />
            <Button
              type="button"
              onClick={handleAddPortfolioLink}
              size="sm"
              className="bg-[#00BFFF] hover:bg-[#0099CC] text-black"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {data.portfolioLinks && data.portfolioLinks.length > 0 && (
            <div className="space-y-2">
              {data.portfolioLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between bg-[#1A1A1A] p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Link className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{link.platform}</p>
                      <p className="text-xs text-gray-400">{link.url}</p>
                    </div>
                  </div>
                  <button onClick={() => handleRemovePortfolioLink(index)} className="text-red-400 hover:text-red-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
