"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Film, Link, Plus, Crop } from "lucide-react"
import { DragDropUpload } from "../drag-drop-upload"
import { MediaUploadPreview } from "../media-upload-preview"
import { ImageCropTool } from "../image-crop-tool"
import type { ProfileFormData } from "../../types"
import { toast } from "@/hooks/use-toast"

interface MediaPortfolioStepEnhancedProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

interface UploadFile {
  id: string
  file: File
  preview: string
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
}

export function MediaPortfolioStepEnhanced({ data, updateData }: MediaPortfolioStepEnhancedProps) {
  const [profilePhotoFiles, setProfilePhotoFiles] = useState<UploadFile[]>([])
  const [coverPhotoFiles, setCoverPhotoFiles] = useState<UploadFile[]>([])
  const [galleryFiles, setGalleryFiles] = useState<UploadFile[]>([])
  const [showreelFiles, setShowreelFiles] = useState<UploadFile[]>([])
  const [newPortfolioLink, setNewPortfolioLink] = useState({ platform: "", url: "" })
  const [cropImage, setCropImage] = useState<{ image: string; type: string } | null>(null)

  // Simulate file upload with progress
  const simulateUpload = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const duration = 2000 + Math.random() * 3000 // 2-5 seconds
      const interval = 100
      let progress = 0

      const timer = setInterval(() => {
        progress += (interval / duration) * 100

        if (progress >= 100) {
          clearInterval(timer)
          // Simulate 10% chance of error
          if (Math.random() > 0.9) {
            reject(new Error("Upload failed"))
          } else {
            resolve()
          }
        }
      }, interval)
    })
  }, [])

  const handleFilesSelected = useCallback(
    async (files: File[], type: "profile" | "cover" | "gallery" | "showreel") => {
      const newFiles: UploadFile[] = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "uploading" as const,
      }))

      // Add files to appropriate state
      switch (type) {
        case "profile":
          setProfilePhotoFiles(newFiles)
          break
        case "cover":
          setCoverPhotoFiles(newFiles)
          break
        case "gallery":
          setGalleryFiles((prev) => [...prev, ...newFiles])
          break
        case "showreel":
          setShowreelFiles(newFiles)
          break
      }

      // Simulate upload for each file
      for (const uploadFile of newFiles) {
        try {
          await simulateUpload(uploadFile.file)

          // Update file status to success
          switch (type) {
            case "profile":
              setProfilePhotoFiles((prev) =>
                prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "success", progress: 100 } : f)),
              )
              break
            case "cover":
              setCoverPhotoFiles((prev) =>
                prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "success", progress: 100 } : f)),
              )
              break
            case "gallery":
              setGalleryFiles((prev) =>
                prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "success", progress: 100 } : f)),
              )
              break
            case "showreel":
              setShowreelFiles((prev) =>
                prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "success", progress: 100 } : f)),
              )
              break
          }

          toast({
            title: "Upload successful",
            description: `${uploadFile.file.name} has been uploaded.`,
          })
        } catch (error) {
          // Update file status to error
          const errorMessage = error instanceof Error ? error.message : "Upload failed"

          switch (type) {
            case "profile":
              setProfilePhotoFiles((prev) =>
                prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error", error: errorMessage } : f)),
              )
              break
            case "cover":
              setCoverPhotoFiles((prev) =>
                prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error", error: errorMessage } : f)),
              )
              break
            case "gallery":
              setGalleryFiles((prev) =>
                prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error", error: errorMessage } : f)),
              )
              break
            case "showreel":
              setShowreelFiles((prev) =>
                prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error", error: errorMessage } : f)),
              )
              break
          }

          toast({
            title: "Upload failed",
            description: errorMessage,
            variant: "destructive",
          })
        }
      }
    },
    [simulateUpload],
  )

  const handleRemoveFile = (id: string, type: string) => {
    switch (type) {
      case "profile":
        setProfilePhotoFiles((prev) => prev.filter((f) => f.id !== id))
        break
      case "cover":
        setCoverPhotoFiles((prev) => prev.filter((f) => f.id !== id))
        break
      case "gallery":
        setGalleryFiles((prev) => prev.filter((f) => f.id !== id))
        break
      case "showreel":
        setShowreelFiles((prev) => prev.filter((f) => f.id !== id))
        break
    }
  }

  const handleRetryUpload = async (id: string, type: string) => {
    // Find the file to retry
    let fileToRetry: UploadFile | undefined

    switch (type) {
      case "profile":
        fileToRetry = profilePhotoFiles.find((f) => f.id === id)
        break
      case "cover":
        fileToRetry = coverPhotoFiles.find((f) => f.id === id)
        break
      case "gallery":
        fileToRetry = galleryFiles.find((f) => f.id === id)
        break
      case "showreel":
        fileToRetry = showreelFiles.find((f) => f.id === id)
        break
    }

    if (fileToRetry) {
      // Reset status to uploading
      switch (type) {
        case "profile":
          setProfilePhotoFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 0 } : f)),
          )
          break
        case "cover":
          setCoverPhotoFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 0 } : f)))
          break
        case "gallery":
          setGalleryFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 0 } : f)))
          break
        case "showreel":
          setShowreelFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 0 } : f)))
          break
      }

      // Retry upload
      try {
        await simulateUpload(fileToRetry.file)

        // Update status to success
        switch (type) {
          case "profile":
            setProfilePhotoFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, status: "success", progress: 100 } : f)),
            )
            break
          case "cover":
            setCoverPhotoFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, status: "success", progress: 100 } : f)),
            )
            break
          case "gallery":
            setGalleryFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "success", progress: 100 } : f)))
            break
          case "showreel":
            setShowreelFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "success", progress: 100 } : f)))
            break
        }

        toast({
          title: "Upload successful",
          description: `${fileToRetry.file.name} has been uploaded.`,
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed"

        switch (type) {
          case "profile":
            setProfilePhotoFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)),
            )
            break
          case "cover":
            setCoverPhotoFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)),
            )
            break
          case "gallery":
            setGalleryFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)),
            )
            break
          case "showreel":
            setShowreelFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)),
            )
            break
        }

        toast({
          title: "Upload failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    }
  }

  const handleAddPortfolioLink = () => {
    if (newPortfolioLink.platform && newPortfolioLink.url) {
      const links = data.portfolioLinks || []
      updateData({ portfolioLinks: [...links, newPortfolioLink] })
      setNewPortfolioLink({ platform: "", url: "" })

      toast({
        title: "Portfolio link added",
        description: `${newPortfolioLink.platform} link has been added to your profile.`,
      })
    }
  }

  const handleRemovePortfolioLink = (index: number) => {
    const links = data.portfolioLinks || []
    updateData({ portfolioLinks: links.filter((_, i) => i !== index) })

    toast({
      title: "Portfolio link removed",
      description: "The link has been removed from your profile.",
    })
  }

  const handleCropImage = (croppedImage: string) => {
    // Handle the cropped image based on type
    if (cropImage?.type === "profile") {
      // Update profile photo with cropped version
      updateData({ profilePhoto: { url: croppedImage, id: "cropped-profile" } })
    } else if (cropImage?.type === "cover") {
      // Update cover photo with cropped version
      updateData({ coverPhoto: { url: croppedImage, id: "cropped-cover" } })
    }

    setCropImage(null)

    toast({
      title: "Image cropped",
      description: "Your image has been cropped successfully.",
    })
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
              <div className="flex items-center justify-between">
                <Label>Profile Photo (Headshot) *</Label>
                {profilePhotoFiles.length > 0 && profilePhotoFiles[0].status === "success" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCropImage({ image: profilePhotoFiles[0].preview, type: "profile" })}
                    className="h-7 text-xs"
                  >
                    <Crop className="w-3 h-3 mr-1" />
                    Crop
                  </Button>
                )}
              </div>

              {profilePhotoFiles.length === 0 ? (
                <DragDropUpload
                  onFilesSelected={(files) => handleFilesSelected(files, "profile")}
                  acceptedTypes={["image/*"]}
                  maxFiles={1}
                  maxSize={5}
                  className="aspect-square"
                >
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload headshot</p>
                    <p className="text-xs text-gray-500 mt-1">Recommended: 400x400px</p>
                  </div>
                </DragDropUpload>
              ) : (
                <MediaUploadPreview
                  files={profilePhotoFiles}
                  onRemove={(id) => handleRemoveFile(id, "profile")}
                  onRetry={(id) => handleRetryUpload(id, "profile")}
                  maxFiles={1}
                />
              )}
            </div>

            {/* Cover Photo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Cover Photo</Label>
                {coverPhotoFiles.length > 0 && coverPhotoFiles[0].status === "success" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCropImage({ image: coverPhotoFiles[0].preview, type: "cover" })}
                    className="h-7 text-xs"
                  >
                    <Crop className="w-3 h-3 mr-1" />
                    Crop
                  </Button>
                )}
              </div>

              {coverPhotoFiles.length === 0 ? (
                <DragDropUpload
                  onFilesSelected={(files) => handleFilesSelected(files, "cover")}
                  acceptedTypes={["image/*"]}
                  maxFiles={1}
                  maxSize={10}
                  className="aspect-[3/1]"
                >
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload cover</p>
                    <p className="text-xs text-gray-500 mt-1">Recommended: 1200x400px</p>
                  </div>
                </DragDropUpload>
              ) : (
                <MediaUploadPreview
                  files={coverPhotoFiles}
                  onRemove={(id) => handleRemoveFile(id, "cover")}
                  onRetry={(id) => handleRetryUpload(id, "cover")}
                  maxFiles={1}
                />
              )}
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
          <DragDropUpload
            onFilesSelected={(files) => handleFilesSelected(files, "gallery")}
            acceptedTypes={["image/*"]}
            maxFiles={20}
            maxSize={10}
            className="min-h-[200px]"
          />

          {galleryFiles.length > 0 && (
            <div className="mt-6">
              <MediaUploadPreview
                files={galleryFiles}
                onRemove={(id) => handleRemoveFile(id, "gallery")}
                onRetry={(id) => handleRetryUpload(id, "gallery")}
                maxFiles={20}
              />
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
              {showreelFiles.length === 0 ? (
                <DragDropUpload
                  onFilesSelected={(files) => handleFilesSelected(files, "showreel")}
                  acceptedTypes={["video/*"]}
                  maxFiles={1}
                  maxSize={500}
                  className="h-32"
                >
                  <div className="flex items-center gap-3 p-4">
                    <Film className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Click to upload video</p>
                      <p className="text-xs text-gray-500">MP4, MOV up to 500MB</p>
                    </div>
                  </div>
                </DragDropUpload>
              ) : (
                <MediaUploadPreview
                  files={showreelFiles}
                  onRemove={(id) => handleRemoveFile(id, "showreel")}
                  onRetry={(id) => handleRetryUpload(id, "showreel")}
                  maxFiles={1}
                />
              )}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePortfolioLink(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Crop Tool */}
      {cropImage && (
        <ImageCropTool
          image={cropImage.image}
          aspectRatio={cropImage.type === "profile" ? 1 : 3}
          onCrop={handleCropImage}
          onCancel={() => setCropImage(null)}
          open={!!cropImage}
        />
      )}
    </div>
  )
}
