"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Send, X, AlertTriangle, Paperclip, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { NewTriviaData } from "./types"
import { triviaCategoriesList } from "./types"

interface TriviaContributionFormProps {
  movieId: string
  movieTitle: string
  onClose: () => void
  onSubmit: (data: NewTriviaData) => void
}

export function TriviaContributionForm({ movieId, movieTitle, onClose, onSubmit }: TriviaContributionFormProps) {
  const [formData, setFormData] = useState<Omit<NewTriviaData, "movieId" | "submittedDate">>({
    content: "",
    category: "",
    source: "",
    isSpoiler: false,
    mediaFile: null,
    tagsInput: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({ ...prev, mediaFile: "File size should not exceed 5MB." }))
        setFileName(null)
        handleChange("mediaFile", null)
        if (fileInputRef.current) fileInputRef.current.value = "" // Clear the file input
        return
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"]
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, mediaFile: "Invalid file type. Allowed: JPG, PNG, GIF, MP4, WebM." }))
        setFileName(null)
        handleChange("mediaFile", null)
        if (fileInputRef.current) fileInputRef.current.value = "" // Clear the file input
        return
      }
      setFileName(file.name)
      handleChange("mediaFile", file)
      if (errors.mediaFile) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.mediaFile
          return newErrors
        })
      }
    } else {
      setFileName(null)
      handleChange("mediaFile", null)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.content.trim()) newErrors.content = "Trivia content is required"
    else if (formData.content.length < 20) newErrors.content = "Trivia content must be at least 20 characters"
    else if (formData.content.length > 1000) newErrors.content = "Trivia content must be less than 1000 characters"

    if (!formData.category) newErrors.category = "Category is required"

    if (formData.source.length > 200) newErrors.source = "Source must be less than 200 characters"

    if (formData.tagsInput && formData.tagsInput.split(",").some((tag) => tag.length > 30)) {
      newErrors.tagsInput = "Each tag must be 30 characters or less."
    }
    if (formData.tagsInput && formData.tagsInput.split(",").length > 5) {
      newErrors.tagsInput = "Maximum of 5 tags allowed."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        ...formData,
        movieId,
        submittedDate: new Date().toISOString(),
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mb-6"
    >
      <Card className="bg-[#282828] border-gray-700 shadow-xl">
        <CardHeader className="pb-4 border-b border-gray-700/70">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white">Contribute Trivia</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8"
              aria-label="Close contribution form"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            Share an interesting fact about <span className="font-semibold text-[#00BFFF]">{movieTitle}</span>.
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-300 font-medium">
                Trivia Content <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="E.g., 'The iconic spinning top scene was filmed practically...'"
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                className="bg-[#1A1A1A] border-gray-600 text-white resize-none min-h-[120px] focus:border-[#00BFFF] focus:ring-[#00BFFF]"
                aria-required="true"
                aria-invalid={!!errors.content}
                aria-describedby="content-error"
              />
              {errors.content && (
                <p id="content-error" className="text-red-400 text-xs flex items-center gap-1 pt-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {errors.content}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300 font-medium">
                  Category <span className="text-red-400">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger
                    id="category"
                    className="bg-[#1A1A1A] border-gray-600 text-white focus:border-[#00BFFF] focus:ring-[#00BFFF]"
                    aria-required="true"
                    aria-invalid={!!errors.category}
                    aria-describedby="category-error"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-gray-600 text-white">
                    {triviaCategoriesList
                      .filter((c) => c.value !== "all")
                      .map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="capitalize hover:bg-gray-700">
                          {cat.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p id="category-error" className="text-red-400 text-xs flex items-center gap-1 pt-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {errors.category}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="source" className="text-gray-300 font-medium">
                  Source (Optional)
                </Label>
                <Input
                  id="source"
                  placeholder="E.g., Director's commentary, IMDb URL"
                  value={formData.source}
                  onChange={(e) => handleChange("source", e.target.value)}
                  className="bg-[#1A1A1A] border-gray-600 text-white focus:border-[#00BFFF] focus:ring-[#00BFFF]"
                  aria-describedby="source-error"
                />
                {errors.source && (
                  <p id="source-error" className="text-red-400 text-xs flex items-center gap-1 pt-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {errors.source}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagsInput" className="text-gray-300 font-medium">
                Tags (Optional, comma-separated, max 5)
              </Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="tagsInput"
                  placeholder="e.g., behind-the-scenes, nolan, visual-effect"
                  value={formData.tagsInput || ""}
                  onChange={(e) => handleChange("tagsInput", e.target.value)}
                  className="bg-[#1A1A1A] border-gray-600 text-white pl-10 focus:border-[#00BFFF] focus:ring-[#00BFFF]"
                  aria-describedby="tags-error"
                />
              </div>
              {errors.tagsInput && (
                <p id="tags-error" className="text-red-400 text-xs flex items-center gap-1 pt-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {errors.tagsInput}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mediaFile" className="text-gray-300 font-medium">
                Media (Optional - Image/Video up to 5MB)
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#1A1A1A] border-gray-600 text-gray-300 hover:border-[#00BFFF] hover:text-[#00BFFF]"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  {fileName ? "Change File" : "Attach File"}
                </Button>
                {fileName && <span className="text-sm text-gray-400 truncate max-w-[200px]">{fileName}</span>}
                {fileName && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setFileName(null)
                      handleChange("mediaFile", null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="text-gray-500 hover:text-red-400 h-7 w-7"
                    aria-label="Remove selected file"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input
                id="mediaFile"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
                aria-describedby="mediaFile-error"
              />
              {errors.mediaFile && (
                <p id="mediaFile-error" className="text-red-400 text-xs flex items-center gap-1 pt-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {errors.mediaFile}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <Checkbox
                id="isSpoiler"
                checked={formData.isSpoiler}
                onCheckedChange={(checked) => handleChange("isSpoiler", Boolean(checked))}
                className="border-gray-500 data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]"
              />
              <Label htmlFor="isSpoiler" className="text-gray-300 cursor-pointer text-sm font-medium">
                This trivia contains spoilers
              </Label>
            </div>
          </form>
        </CardContent>

        <CardFooter className="border-t border-gray-700/70 pt-4 mt-2">
          <div className="flex justify-end w-full gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-white">
              <Send className="h-4 w-4 mr-2" />
              Submit Trivia
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
