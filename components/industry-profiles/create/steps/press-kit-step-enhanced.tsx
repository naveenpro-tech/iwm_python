"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ImageIcon,
  Link2,
  Plus,
  X,
  Info,
  ExternalLink,
  CheckCircle,
  Newspaper,
  Youtube,
  Instagram,
  Twitter,
  Globe,
} from "lucide-react"
import PressKitUploader from "../media-upload/press-kit-uploader"

interface PressKitStepProps {
  onNext: () => void
  onBack: () => void
}

export default function PressKitStepEnhanced({ onNext, onBack }: PressKitStepProps) {
  const [activeTab, setActiveTab] = useState("media")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaUploaded, setMediaUploaded] = useState(false)
  const [pressLinks, setPressLinks] = useState<Array<{ id: string; title: string; url: string; source: string }>>([])
  const [newLink, setNewLink] = useState({ title: "", url: "", source: "" })
  const [socialLinks, setSocialLinks] = useState<Array<{ platform: string; url: string }>>([])
  const [newSocial, setNewSocial] = useState({ platform: "twitter", url: "" })
  const [bio, setBio] = useState("")

  const handleMediaUpload = (files: File[]) => {
    console.log("Uploaded files:", files)
    setMediaUploaded(true)
  }

  const handleMediaRemove = () => {
    console.log("Removed media")
    setMediaUploaded(false)
  }

  const handleAddPressLink = () => {
    if (newLink.title && newLink.url) {
      setPressLinks([...pressLinks, { id: `link-${Date.now()}`, ...newLink }])
      setNewLink({ title: "", url: "", source: "" })
    }
  }

  const handleRemovePressLink = (id: string) => {
    setPressLinks(pressLinks.filter((link) => link.id !== id))
  }

  const handleAddSocialLink = () => {
    if (newSocial.url) {
      setSocialLinks([...socialLinks, newSocial])
      setNewSocial({ platform: "twitter", url: "" })
    }
  }

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onNext()
    }, 2000)
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "youtube":
        return <Youtube className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">Press Kit & Media</h2>
        <p className="text-muted-foreground mt-1">
          Add media, press coverage, and social media links to enhance your professional profile
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="media" className="relative">
            <div className="flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Media</span>
              <span className="sm:hidden">Media</span>
            </div>
            {mediaUploaded && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-green-500">
                <CheckCircle className="h-3 w-3 text-white" />
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="press" className="relative">
            <div className="flex items-center">
              <Newspaper className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Press Coverage</span>
              <span className="sm:hidden">Press</span>
            </div>
            {pressLinks.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-green-500">
                <CheckCircle className="h-3 w-3 text-white" />
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="social" className="relative">
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Social Media</span>
              <span className="sm:hidden">Social</span>
            </div>
            {socialLinks.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-green-500">
                <CheckCircle className="h-3 w-3 text-white" />
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
                Media Gallery
              </CardTitle>
              <CardDescription>Upload high-quality images, videos, and documents for your press kit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <PressKitUploader onUpload={handleMediaUpload} onRemove={handleMediaRemove} maxFiles={5} />

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    Media Guidelines
                  </h4>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li>• Images should be high resolution (minimum 1920x1080px)</li>
                    <li>• Videos should be under 100MB and in MP4 format</li>
                    <li>• Documents should be in PDF format</li>
                    <li>• All media should be professional and relevant to your work</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="press" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Newspaper className="h-5 w-5 mr-2 text-purple-500" />
                Press Coverage
              </CardTitle>
              <CardDescription>
                Add links to interviews, articles, and reviews featuring you or your work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Article Title</Label>
                    <Input
                      id="title"
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      placeholder="e.g. Director's Vision for Latest Film"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source">Publication Source</Label>
                    <Input
                      id="source"
                      value={newLink.source}
                      onChange={(e) => setNewLink({ ...newLink, source: e.target.value })}
                      placeholder="e.g. Variety, Hollywood Reporter"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="url"
                      type="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      placeholder="https://example.com/article"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddPressLink}
                      disabled={!newLink.title || !newLink.url}
                      className="flex-shrink-0"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                {pressLinks.length > 0 ? (
                  <div className="space-y-3 mt-4">
                    <h4 className="text-sm font-medium">Added Press Links</h4>
                    <div className="space-y-2">
                      {pressLinks.map((link) => (
                        <div key={link.id} className="flex items-center justify-between bg-muted p-3 rounded-md group">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <Newspaper className="h-4 w-4 mr-2 text-muted-foreground" />
                              <p className="font-medium text-sm truncate">{link.title}</p>
                            </div>
                            {link.source && <p className="text-xs text-muted-foreground ml-6">{link.source}</p>}
                            <div className="flex items-center ml-6 mt-1">
                              <Link2 className="h-3 w-3 text-primary mr-1" />
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline truncate"
                              >
                                {link.url}
                              </a>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePressLink(link.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <Newspaper className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No press links added yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Globe className="h-5 w-5 mr-2 text-green-500" />
                Social Media & Bio
              </CardTitle>
              <CardDescription>Connect your social media profiles and add a professional bio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Social Media Links</h4>
                  <div className="flex gap-2">
                    <Select
                      value={newSocial.platform}
                      onValueChange={(value) => setNewSocial({ ...newSocial, platform: value })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="url"
                      value={newSocial.url}
                      onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                      placeholder="https://twitter.com/username"
                      className="flex-1"
                    />
                    <Button onClick={handleAddSocialLink} disabled={!newSocial.url} className="flex-shrink-0">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {socialLinks.length > 0 ? (
                    <div className="space-y-2">
                      {socialLinks.map((link, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-md group">
                          <div className="flex items-center">
                            {getSocialIcon(link.platform)}
                            <span className="ml-2 text-sm capitalize">{link.platform}</span>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-3 text-xs text-primary hover:underline flex items-center"
                            >
                              {link.url}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSocialLink(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <Globe className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No social media links added yet</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a professional bio that highlights your career achievements and expertise..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground text-right">{bio.length}/500 characters</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </motion.div>
  )
}
