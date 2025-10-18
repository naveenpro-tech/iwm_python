"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  MessageCircle,
  Share2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { generateMovieHashtags, formatHashtagsForSharing } from "@/lib/hashtag-generator"

interface SocialShareProps {
  title: string
  description?: string
  url: string
  year?: number | string
  genres?: string[]
  director?: string
  hashtags?: string[]
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function SocialShare({
  title,
  description,
  url,
  year,
  genres = [],
  director,
  hashtags,
  variant = "outline",
  size = "default",
}: SocialShareProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // Generate hashtags if not provided
  const generatedHashtags = hashtags || generateMovieHashtags({
    title,
    year,
    genres,
    director,
    maxHashtags: 8,
  })

  const hashtagString = generatedHashtags.length > 0 ? ` ${formatHashtagsForSharing(generatedHashtags)}` : ""
  const fullText = `${title}${description ? ` - ${description}` : ""}${hashtagString}`

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(fullText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${fullText} ${url}`)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description || ""}\n\n${url}`)}`,
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400")
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Share2 className="h-4 w-4" />
          {size !== "icon" && "Share"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer">
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          <span>Share on Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer">
          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
          <span>Share on X (Twitter)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("linkedin")} className="cursor-pointer">
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          <span>Share on LinkedIn</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("whatsapp")} className="cursor-pointer">
          <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
          <span>Share on WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("email")} className="cursor-pointer">
          <Mail className="h-4 w-4 mr-2 text-gray-600" />
          <span>Share via Email</span>
        </DropdownMenuItem>
        <div className="border-t my-1" />
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Copy className="h-4 w-4 mr-2" />
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

