"use client"

import type React from "react"

import { Textarea } from "@/components/ui/textarea"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon, FileImage } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Movie } from "@/types"

interface MovieMediaFormProps {
  initialValues: Partial<Pick<Movie, "poster" | "backdrop" | "galleryImages" | "trailerUrl" | "trailerEmbed">>
  onChanges: (
    updates: Partial<Pick<Movie, "poster" | "backdrop" | "galleryImages" | "trailerUrl" | "trailerEmbed">>,
  ) => void
}

export function MovieMediaForm({ initialValues, onChanges }: MovieMediaFormProps) {
  const [poster, setPoster] = useState(initialValues.poster || "/inception-movie-poster.png")
  const [backdrop, setBackdrop] = useState(initialValues.backdrop || "/dark-blue-city-skyline.png")
  const [gallery, setGallery] = useState(initialValues.galleryImages || ["/inception-scene-thumbnail.png"])
  const [trailerUrl, setTrailerUrl] = useState(initialValues.trailerUrl || "")
  const [trailerEmbed, setTrailerEmbed] = useState(initialValues.trailerEmbed || "")

  const handleFileUpload = (type: "poster" | "backdrop" | "gallery") => {
    // Simulate file upload
    if (type === "poster") {
      setPoster("/new-poster.png") // Simulate new poster
      onChanges({ poster: "/new-poster.png" })
    } else if (type === "backdrop") {
      setBackdrop("/new-backdrop.png") // Simulate new backdrop
      onChanges({ backdrop: "/new-backdrop.png" })
    } else if (type === "gallery") {
      const newGallery = [...gallery, "/new-gallery-image.png"]
      setGallery(newGallery)
      onChanges({ galleryImages: newGallery })
    }
  }

  const removeGalleryImage = (index: number) => {
    const newGallery = gallery.filter((_, i) => i !== index)
    setGallery(newGallery)
    onChanges({ galleryImages: newGallery })
  }

  const handleTrailerUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setTrailerUrl(newUrl)
    onChanges({ trailerUrl: newUrl })
  }

  const handleTrailerEmbedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newEmbed = e.target.value
    setTrailerEmbed(newEmbed)
    onChanges({ trailerEmbed: newEmbed })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Movie Poster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden">
                {poster ? (
                  <Image src={poster || "/placeholder.svg"} alt="Movie poster" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon size={48} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Upload Poster</Label>
                <p className="text-sm text-muted-foreground mb-4">Recommended size: 1000x1500px (2:3 ratio)</p>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={() => handleFileUpload("poster")}
                    className="hidden"
                    id="poster-upload"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("poster-upload")?.click()}
                  >
                    <Upload size={16} className="mr-2" />
                    Choose File
                  </Button>
                  <Input
                    placeholder="Or enter image URL"
                    value={poster}
                    onChange={(e) => {
                      setPoster(e.target.value)
                      onChanges({ poster: e.target.value })
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backdrop Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {backdrop ? (
                <Image src={backdrop || "/placeholder.svg"} alt="Movie backdrop" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FileImage size={48} className="text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-4">Recommended size: 1920x1080px (16:9 ratio)</p>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={() => handleFileUpload("backdrop")}
                  className="hidden"
                  id="backdrop-upload"
                />
                <Button variant="outline" onClick={() => document.getElementById("backdrop-upload")?.click()}>
                  <Upload size={16} className="mr-2" />
                  Upload Backdrop
                </Button>
                <Input
                  placeholder="Or enter image URL"
                  className="flex-1"
                  value={backdrop}
                  onChange={(e) => {
                    setBackdrop(e.target.value)
                    onChanges({ backdrop: e.target.value })
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {gallery.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-video bg-muted rounded-lg overflow-hidden group"
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeGalleryImage(index)}
                >
                  <X size={16} />
                </Button>
              </motion.div>
            ))}
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={() => handleFileUpload("gallery")}
                className="hidden"
                id="gallery-upload"
              />
              <Button variant="ghost" onClick={() => document.getElementById("gallery-upload")?.click()}>
                <Upload size={20} className="mr-2" />
                Add Images
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trailer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trailer-url">YouTube/Vimeo URL</Label>
              <Input
                id="trailer-url"
                placeholder="https://youtube.com/watch?v=..."
                value={trailerUrl}
                onChange={handleTrailerUrlChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailer-embed">Or Embed Code</Label>
              <Textarea
                id="trailer-embed"
                placeholder="<iframe>...</iframe>"
                rows={4}
                value={trailerEmbed}
                onChange={handleTrailerEmbedChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
