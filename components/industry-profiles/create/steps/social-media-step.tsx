"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Twitter, Instagram, Linkedin, Facebook, Youtube, Video, Globe, MoveVertical } from "lucide-react"
import type { ProfileFormData, SocialMediaLink } from "../../types"

interface SocialMediaStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

export function SocialMediaStep({ data, updateData }: SocialMediaStepProps) {
  const [platform, setPlatform] = useState<
    "twitter" | "instagram" | "linkedin" | "facebook" | "youtube" | "vimeo" | "other"
  >("twitter")
  const [handle, setHandle] = useState("")
  const [url, setUrl] = useState("")

  const handleAddSocialMedia = () => {
    if (handle && url) {
      const newSocialMedia: SocialMediaLink = {
        platform,
        handle,
        url,
      }

      updateData({
        socialMedia: [...(data.socialMedia || []), newSocialMedia],
      })

      // Reset form
      setHandle("")
      setUrl("")
    }
  }

  const handleRemoveSocialMedia = (platform: string, handle: string) => {
    updateData({
      socialMedia: data.socialMedia?.filter((social) => !(social.platform === platform && social.handle === handle)),
    })
  }

  const getPlatformIcon = (platformName: string) => {
    switch (platformName) {
      case "twitter":
        return <Twitter className="w-5 h-5" />
      case "instagram":
        return <Instagram className="w-5 h-5" />
      case "linkedin":
        return <Linkedin className="w-5 h-5" />
      case "facebook":
        return <Facebook className="w-5 h-5" />
      case "youtube":
        return <Youtube className="w-5 h-5" />
      case "vimeo":
        return <Video className="w-5 h-5" />
      default:
        return <Globe className="w-5 h-5" />
    }
  }

  const getPlatformColor = (platformName: string) => {
    switch (platformName) {
      case "twitter":
        return "text-[#1DA1F2] bg-[#1DA1F2]/10"
      case "instagram":
        return "text-[#E1306C] bg-[#E1306C]/10"
      case "linkedin":
        return "text-[#0077B5] bg-[#0077B5]/10"
      case "facebook":
        return "text-[#1877F2] bg-[#1877F2]/10"
      case "youtube":
        return "text-[#FF0000] bg-[#FF0000]/10"
      case "vimeo":
        return "text-[#1AB7EA] bg-[#1AB7EA]/10"
      default:
        return "text-gray-400 bg-gray-400/10"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Add Social Media</CardTitle>
          <CardDescription>Connect your official social media accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={(value: any) => setPlatform(value)}>
                <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A]">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-[#282828] border-[#3A3A3A]">
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="handle">Username/Handle</Label>
              <Input
                id="handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="e.g. @username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Profile URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="https://platform.com/username"
              />
            </div>
          </div>

          <Button
            onClick={handleAddSocialMedia}
            disabled={!handle || !url}
            className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Social Media
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Social Media</CardTitle>
            <CardDescription>Manage your connected social accounts</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-[#3A3A3A] hover:bg-[#3A3A3A]">
            <MoveVertical className="w-4 h-4 mr-2" />
            Reorder
          </Button>
        </CardHeader>
        <CardContent>
          {data.socialMedia && data.socialMedia.length > 0 ? (
            <div className="space-y-3">
              {data.socialMedia.map((social, index) => (
                <div key={index} className="bg-[#1A1A1A] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getPlatformColor(social.platform)}`}
                    >
                      {getPlatformIcon(social.platform)}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{social.platform}</p>
                      <p className="text-sm text-gray-400">{social.handle}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 border-[#3A3A3A] hover:bg-[#3A3A3A]"
                      onClick={() => window.open(social.url, "_blank")}
                    >
                      Visit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSocialMedia(social.platform, social.handle)}
                      className="text-gray-400 hover:text-white hover:bg-[#3A3A3A] h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="flex justify-center space-x-2 mb-3">
                <Twitter className="w-6 h-6 text-gray-500" />
                <Instagram className="w-6 h-6 text-gray-500" />
                <Linkedin className="w-6 h-6 text-gray-500" />
              </div>
              <p>No social media accounts added yet</p>
              <p className="text-sm">Connect your official social media accounts to your profile</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
