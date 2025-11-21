"use client"

import React, { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Camera, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvatarUploadProps {
  avatarUrl?: string
  username?: string
  onUpload?: (file: File) => Promise<void>
  isLoading?: boolean
  className?: string
}

/**
 * Avatar upload component with preview
 * Allows users to upload and preview their profile avatar
 */
export const AvatarUpload = React.forwardRef<HTMLDivElement, AvatarUploadProps>(
  ({ avatarUrl, username = "U", onUpload, isLoading = false, className }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && onUpload) {
        await onUpload(file)
      }
    }

    const handleClick = () => {
      fileInputRef.current?.click()
    }

    return (
      <div ref={ref} className={cn("flex items-center space-x-6", className)}>
        <div className="relative group">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={username} />
            <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClick}
            disabled={isLoading}
            className="absolute bottom-0 right-0 rounded-full bg-gray-700/80 border-gray-600 hover:bg-gray-600 group-hover:opacity-100 opacity-0 transition-opacity"
            aria-label="Change avatar"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
            aria-label="Upload avatar"
          />
        </div>
      </div>
    )
  }
)

AvatarUpload.displayName = "AvatarUpload"

