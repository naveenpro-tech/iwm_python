"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  Film,
  Hash,
  Clock,
  ChevronDown,
  ChevronUp,
  Verified,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface EnhancedPulseCardProps {
  post: {
    id: string
    author: {
      id: string
      name: string
      username: string
      avatarUrl: string
      isVerified?: boolean
    }
    content: string
    mediaUrls?: { type: "image" | "video"; url: string }[]
    tags?: string[]
    movieTags?: { id: string; title: string; posterUrl?: string }[]
    mood?: string
    createdAt: string // ISO string
    likes: number
    comments: number
    shares: number
    isLikedByCurrentUser?: boolean
    isBookmarkedByCurrentUser?: boolean
  }
  className?: string
  onLike?: (postId: string) => void
  onBookmark?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
}

export function EnhancedPulseCard({ post, className, onLike, onBookmark, onComment, onShare }: EnhancedPulseCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser || false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarkedByCurrentUser || false)
  const [showFullContent, setShowFullContent] = useState(false)
  const [isContentTruncated, setIsContentTruncated] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      // Check if content is overflowing after a brief delay to allow rendering
      const timer = setTimeout(() => {
        if (contentRef.current) {
          // Check again as component might unmount
          setIsContentTruncated(contentRef.current.scrollHeight > contentRef.current.clientHeight)
        }
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [post.content, showFullContent])

  const toggleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    if (onLike) onLike(post.id)
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    if (onBookmark) onBookmark(post.id)
  }

  const handleComment = () => {
    if (onComment) onComment(post.id)
    // Placeholder for actual comment functionality
    console.log("Comment clicked for post:", post.id)
  }

  const handleShare = () => {
    if (onShare) onShare(post.id)
    // Placeholder for actual share functionality
    console.log("Share clicked for post:", post.id)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const renderContent = () => {
    // Basic linkification for URLs, @mentions, #hashtags, $movietags
    const linkedContent = post.content
      .replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-siddu-electric-blue hover:underline">$1</a>',
      )
      .replace(/@(\w+)/g, '<a href="/profile/$1" class="text-siddu-purple-primary hover:underline">@$1</a>')
      .replace(/#(\w+)/g, '<a href="/tags/$1" class="text-siddu-accent-yellow hover:underline">#$1</a>')
      .replace(/\$(\w[\w\s-]*\w)/g, (match, movieTitle) => {
        const movie = post.movieTags?.find((mt) => mt.title === movieTitle.trim())
        return movie ? `<a href="/movies/${movie.id}" class="text-blue-400 hover:underline">$${movieTitle}</a>` : match
      })
    return <div dangerouslySetInnerHTML={{ __html: linkedContent }} />
  }

  return (
    <motion.div
      className={cn(
        "bg-siddu-bg-card-dark border border-siddu-border-subtle rounded-xl overflow-hidden shadow-lg",
        className,
      )}
      layout
    >
      <div className="p-3 md:p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="h-10 w-10 md:h-11 md:w-11 ring-1 ring-siddu-purple-primary/30">
                <AvatarImage
                  src={post.author.avatarUrl || "/placeholder.svg?width=44&height=44&query=avatar"}
                  alt={post.author.name}
                />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/profile/${post.author.username}`}
                  className="font-semibold text-siddu-text-light hover:underline"
                >
                  {post.author.name}
                </Link>
                {post.author.isVerified && (
                  <Verified size={16} className="text-siddu-purple-primary fill-siddu-purple-primary" />
                )}
              </div>
              <div className="flex items-center text-xs text-siddu-text-subtle flex-wrap">
                <Link href={`/profile/${post.author.username}`} className="hover:underline">
                  @{post.author.username}
                </Link>
                <span className="mx-1.5">•</span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Clock size={12} />
                  {formatTimeAgo(post.createdAt)}
                </span>
                {post.mood && (
                  <>
                    <span className="mx-1.5">•</span>
                    <span className="whitespace-nowrap">Feeling {post.mood}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="More options"
                variant="ghost"
                size="icon"
                className="rounded-full text-siddu-text-subtle hover:text-siddu-text-light hover:bg-siddu-border-subtle/50 h-8 w-8"
              >
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-siddu-bg-card border-siddu-border-subtle text-siddu-text-light"
            >
              <DropdownMenuItem className="focus:bg-siddu-bg-card-dark focus:text-siddu-electric-blue">
                Not interested
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-siddu-bg-card-dark focus:text-siddu-electric-blue">
                Follow @{post.author.username}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-siddu-border-subtle" />
              <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-400">
                Report post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          ref={contentRef}
          className={cn(
            "text-siddu-text-light mb-2 prose prose-sm prose-invert max-w-none prose-a:text-siddu-electric-blue prose-a:no-underline hover:prose-a:underline",
            !showFullContent && "max-h-[100px] overflow-hidden text-ellipsis",
          )}
        >
          {renderContent()}
        </div>
        {isContentTruncated && (
          <Button
            variant="link"
            size="sm"
            className="text-siddu-purple-primary hover:text-siddu-purple-primary/80 p-0 h-auto -mt-1 mb-2"
            onClick={() => setShowFullContent(!showFullContent)}
          >
            {showFullContent ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                Show more
              </>
            )}
          </Button>
        )}

        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div
            className={cn(
              "grid gap-1.5 mb-3 rounded-lg overflow-hidden",
              post.mediaUrls.length === 1 ? "grid-cols-1" : "grid-cols-2",
              post.mediaUrls.length > 2 && "md:grid-cols-2",
            )}
          >
            {post.mediaUrls.slice(0, 4).map((media, index) => (
              <motion.div
                key={index}
                className={cn(
                  "relative rounded-md overflow-hidden bg-siddu-bg-card",
                  post.mediaUrls?.length === 1 ? "aspect-[16/9]" : "aspect-square",
                  post.mediaUrls.length === 3 && index === 0 && "col-span-2 aspect-[16/9]",
                  post.mediaUrls.length > 4 && index === 3 && "relative",
                )}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={media.url || "/placeholder.svg?query=media"}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {post.mediaUrls.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold">
                    +{post.mediaUrls.length - 4}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {(post.tags?.length || 0) + (post.movieTags?.length || 0) > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags?.map((tag) => (
              <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                <Badge
                  variant="secondary"
                  className="bg-siddu-purple-secondary/30 hover:bg-siddu-purple-secondary/50 text-siddu-purple-primary flex items-center gap-1 cursor-pointer text-xs px-1.5 py-0.5"
                >
                  <Hash size={12} />
                  {tag}
                </Badge>
              </Link>
            ))}
            {post.movieTags?.map((movie) => (
              <Link key={movie.id} href={`/movies/${movie.id}`}>
                <Badge
                  variant="secondary"
                  className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 flex items-center gap-1 cursor-pointer text-xs px-1.5 py-0.5"
                >
                  <Film size={12} />
                  {movie.title}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-siddu-border-subtle text-sm">
          <Button
            aria-label={isLiked ? "Unlike" : "Like"}
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-1.5 text-siddu-text-subtle hover:text-red-500",
              isLiked && "text-red-500",
            )}
            onClick={toggleLike}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            <span>{likeCount}</span>
          </Button>
          <Button
            aria-label="Comment"
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 text-siddu-text-subtle hover:text-siddu-electric-blue"
            onClick={handleComment}
          >
            <MessageCircle size={18} />
            <span>{post.comments}</span>
          </Button>
          <Button
            aria-label="Share"
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 text-siddu-text-subtle hover:text-green-500"
            onClick={handleShare}
          >
            <Share size={18} />
            <span>{post.shares}</span>
          </Button>
          <Button
            aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
            variant="ghost"
            size="icon"
            className={cn(
              "text-siddu-text-subtle hover:text-siddu-accent-yellow h-8 w-8",
              isBookmarked && "text-siddu-accent-yellow",
            )}
            onClick={toggleBookmark}
          >
            <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
