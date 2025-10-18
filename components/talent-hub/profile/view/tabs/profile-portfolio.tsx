"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Film, LinkIcon, X } from "lucide-react"
import Image from "next/image"
import type { TalentProfile } from "../../types"

interface ProfilePortfolioProps {
  profile: TalentProfile
}

export function ProfilePortfolio({ profile }: ProfilePortfolioProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)

  const openLightbox = (imageUrl: string) => {
    setCurrentImage(imageUrl)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setCurrentImage(null)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="bg-[#282828] border-b border-[#3A3A3A] w-full justify-start rounded-none p-0">
          <TabsTrigger
            value="photos"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] px-4 py-2"
          >
            Photos
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] px-4 py-2"
          >
            Videos
          </TabsTrigger>
          <TabsTrigger
            value="links"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] px-4 py-2"
          >
            Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="mt-6">
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-[#00BFFF]" />
                Photo Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.additionalPhotos && profile.additionalPhotos.length > 0 ? (
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {profile.additionalPhotos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => openLightbox(photo.url)}
                    >
                      <Image
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.caption || "Portfolio photo"}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Badge className="bg-[#00BFFF] text-black">
                          {photo.type === "headshot"
                            ? "Headshot"
                            : photo.type === "production"
                              ? "Production"
                              : "Behind the Scenes"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No photos added to the portfolio yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Film className="w-5 h-5 mr-2 text-[#00BFFF]" />
                Showreel & Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.showreel ? (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-[#1A1A1A] rounded-lg overflow-hidden">
                    <iframe
                      src={profile.showreel.url}
                      title="Showreel"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="flex items-center justify-between bg-[#1A1A1A] p-3 rounded-lg">
                    <div>
                      <p className="font-medium">Demo Reel</p>
                      <p className="text-sm text-gray-400">
                        {profile.showreel.platform === "youtube"
                          ? "YouTube"
                          : profile.showreel.platform === "vimeo"
                            ? "Vimeo"
                            : "Uploaded Video"}
                      </p>
                    </div>
                    {profile.showreel.duration && (
                      <Badge variant="outline" className="border-[#3A3A3A]">
                        {Math.floor(profile.showreel.duration / 60)}:
                        {(profile.showreel.duration % 60).toString().padStart(2, "0")}
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Film className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No showreel or videos added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="mt-6">
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="w-5 h-5 mr-2 text-[#00BFFF]" />
                Portfolio Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.portfolioLinks && profile.portfolioLinks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.portfolioLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1A1A1A] p-4 rounded-lg hover:bg-[#3A3A3A] transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center mr-3">
                          <LinkIcon className="w-5 h-5 text-[#00BFFF]" />
                        </div>
                        <div>
                          <p className="font-medium">{link.platform}</p>
                          <p className="text-sm text-gray-400 truncate">{link.url}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <LinkIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No portfolio links added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lightbox */}
      {lightboxOpen && currentImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="relative w-full h-full">
              <Image src={currentImage || "/placeholder.svg"} alt="Portfolio image" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
