"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Newspaper, Plus, Trash2, ExternalLink, Upload, Grid, List } from "lucide-react"
import Image from "next/image"
import type { ProfileFormData, PressItem } from "../../types"

interface PressKitStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

export function PressKitStep({ data, updateData }: PressKitStepProps) {
  const [type, setType] = useState<"article" | "interview" | "review" | "press_release" | "website">("article")
  const [title, setTitle] = useState("")
  const [source, setSource] = useState("")
  const [url, setUrl] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const handleAddPressItem = () => {
    if (title && source && url) {
      const newPressItem: PressItem = {
        id: `press-${Date.now()}`,
        type,
        title,
        source,
        url,
        thumbnail: thumbnail || undefined,
        date: new Date(),
      }

      updateData({
        pressKit: [...(data.pressKit || []), newPressItem],
      })

      // Reset form
      setTitle("")
      setSource("")
      setUrl("")
      setThumbnail("")
    }
  }

  const handleRemovePressItem = (id: string) => {
    updateData({
      pressKit: data.pressKit?.filter((item) => item.id !== id),
    })
  }

  const getTypeIcon = (itemType: string) => {
    switch (itemType) {
      case "interview":
        return "🎙️"
      case "review":
        return "⭐"
      case "press_release":
        return "📢"
      case "website":
        return "🌐"
      default:
        return "📰"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Add Press & Media</CardTitle>
          <CardDescription>Add articles, interviews, reviews, and other media coverage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Media Type</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A]">
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent className="bg-[#282828] border-[#3A3A3A]">
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="press_release">Press Release</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="e.g. The New York Times"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
              placeholder="e.g. Director's Vision for New Film"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
              placeholder="https://example.com/article"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail Image (Optional)</Label>
            <div className="flex">
              <Input
                id="thumbnail"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF] rounded-r-none"
                placeholder="Thumbnail URL or upload"
                disabled
              />
              <Button
                variant="outline"
                className="rounded-l-none border-[#3A3A3A] hover:bg-[#3A3A3A]"
                onClick={() => setThumbnail("/placeholder.svg?height=200&width=300&query=news+article")}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            onClick={handleAddPressItem}
            disabled={!title || !source || !url}
            className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Press Kit
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Press Kit</CardTitle>
            <CardDescription>Manage your media coverage and press materials</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`border-[#3A3A3A] ${viewMode === "grid" ? "bg-[#3A3A3A]" : "hover:bg-[#3A3A3A]"}`}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("list")}
              className={`border-[#3A3A3A] ${viewMode === "list" ? "bg-[#3A3A3A]" : "hover:bg-[#3A3A3A]"}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.pressKit && data.pressKit.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.pressKit.map((item) => (
                  <div key={item.id} className="bg-[#1A1A1A] rounded-lg overflow-hidden">
                    <div className="relative h-32 bg-[#3A3A3A]">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="w-10 h-10 text-gray-500" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-[#282828] rounded-full px-2 py-1 text-xs">
                        {getTypeIcon(item.type)}{" "}
                        {item.type.replace("_", " ").charAt(0).toUpperCase() + item.type.replace("_", " ").slice(1)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePressItem(item.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-[#3A3A3A] h-6 w-6 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium line-clamp-1">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.source}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          {item.date ? new Date(item.date).toLocaleDateString() : ""}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#00BFFF] hover:text-[#00BFFF] hover:bg-[#3A3A3A] h-6 p-1"
                          onClick={() => window.open(item.url, "_blank")}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          <span className="text-xs">View</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data.pressKit.map((item) => (
                  <div key={item.id} className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
                    <div className="w-12 h-12 rounded bg-[#3A3A3A] flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-xl">{getTypeIcon(item.type)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-300">{item.source}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.date ? new Date(item.date).toLocaleDateString() : ""}
                          </p>
                        </div>
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#00BFFF] hover:text-[#00BFFF] hover:bg-[#3A3A3A] h-6 w-6 p-0 mr-1"
                            onClick={() => window.open(item.url, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePressItem(item.id)}
                            className="text-gray-400 hover:text-white hover:bg-[#3A3A3A] h-6 w-6 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Newspaper className="w-12 h-12 mx-auto mb-3 text-gray-500" />
              <p>No press items added yet</p>
              <p className="text-sm">Add articles, interviews, and other media coverage to your press kit</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
