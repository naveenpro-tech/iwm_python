"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ThumbsUp,
  ThumbsDown,
  Flag,
  User,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Share2,
  Heart,
  LinkIcon,
  VideoIcon,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Trivia } from "./types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TriviaItemProps {
  trivia: Trivia
  onVote: (triviaId: string, voteType: "up" | "down") => void
  onReport: (triviaId: string) => void
  onShare: (triviaId: string, content: string) => void
  onFavoriteToggle: (triviaId: string) => void
}

export function TriviaItem({ trivia, onVote, onReport, onShare, onFavoriteToggle }: TriviaItemProps) {
  const [isExpanded, setIsExpanded] = useState(trivia.spoiler ? false : true)

  const handleVoteClick = (voteType: "up" | "down") => {
    onVote(trivia.id, voteType)
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        layout
      >
        <Card className="bg-[#282828] border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-0">
            {trivia.spoiler && !isExpanded ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="destructive"
                    className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Spoiler Alert
                  </Badge>
                  {trivia.verified && (
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-400 border-green-500/30 flex items-center gap-1"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-400 mb-3 text-sm">This trivia contains spoilers. Reveal to read.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="text-[#00BFFF] border-[#00BFFF]/50 hover:bg-[#00BFFF]/10 hover:text-[#33CFFF]"
                >
                  Reveal Trivia
                </Button>
              </div>
            ) : (
              <>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-3 items-center">
                    <Badge variant="secondary" className="bg-[#3A3A3A] text-gray-200 border-gray-600 capitalize">
                      {trivia.category.replace("-", " ")}
                    </Badge>
                    {trivia.spoiler && (
                      <Badge
                        variant="destructive"
                        className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50 flex items-center gap-1"
                      >
                        <AlertTriangle className="h-3.5 w-3.5" /> Spoiler
                      </Badge>
                    )}
                    {trivia.verified && (
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-400 border-green-500/30 flex items-center gap-1"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </Badge>
                    )}
                  </div>

                  {trivia.mediaUrl && (
                    <div className="my-4 rounded-lg overflow-hidden border border-gray-700 max-h-80">
                      {trivia.mediaType === "image" ? (
                        <img
                          src={trivia.mediaUrl || "/placeholder.svg"}
                          alt="Trivia media"
                          className="w-full h-auto object-cover"
                        />
                      ) : trivia.mediaType === "video" ? (
                        <div className="aspect-video bg-black flex items-center justify-center text-gray-400">
                          {/* In a real app, use a video player or iframe for YouTube/Vimeo */}
                          <VideoIcon className="h-16 w-16 text-gray-500" />
                          <p className="ml-2">Video Placeholder: {trivia.mediaUrl}</p>
                        </div>
                      ) : null}
                    </div>
                  )}

                  <p className="text-gray-100 mb-4 leading-relaxed text-base">{trivia.content}</p>

                  {trivia.source && (
                    <div className="text-sm text-gray-400 mb-3 italic">
                      <span className="font-medium text-gray-300">Source:</span>{" "}
                      {isValidUrl(trivia.source) ? (
                        <a
                          href={trivia.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00BFFF] hover:underline"
                        >
                          {trivia.source} <LinkIcon className="inline h-3 w-3 ml-0.5" />
                        </a>
                      ) : (
                        trivia.source
                      )}
                    </div>
                  )}

                  {trivia.tags && trivia.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {trivia.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs bg-gray-700/50 border-gray-600 text-gray-300 px-1.5 py-0.5"
                        >
                          <Tag className="h-3 w-3 mr-1 text-gray-400" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center text-xs text-gray-500 mb-1 gap-x-3 gap-y-1">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1.5" />
                      <span>{trivia.submittedBy}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      <span>{new Date(trivia.submittedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-700/70 p-2 bg-[#242424]">
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVoteClick("up")}
                          className={cn(
                            "text-sm flex items-center gap-1.5 px-2 py-1 h-auto",
                            trivia.userVote === "up"
                              ? "text-green-400 bg-green-500/10 hover:bg-green-500/20"
                              : "text-gray-400 hover:text-green-400 hover:bg-gray-700",
                          )}
                          aria-pressed={trivia.userVote === "up"}
                          aria-label="Upvote"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {trivia.upvotes}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black text-white border-gray-700">
                        <p>Upvote</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVoteClick("down")}
                          className={cn(
                            "text-sm flex items-center gap-1.5 px-2 py-1 h-auto",
                            trivia.userVote === "down"
                              ? "text-red-400 bg-red-500/10 hover:bg-red-500/20"
                              : "text-gray-400 hover:text-red-400 hover:bg-gray-700",
                          )}
                          aria-pressed={trivia.userVote === "down"}
                          aria-label="Downvote"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          {trivia.downvotes}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black text-white border-gray-700">
                        <p>Downvote</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onFavoriteToggle(trivia.id)}
                          className={cn(
                            "text-sm h-8 w-8",
                            trivia.isFavorited
                              ? "text-pink-500 hover:text-pink-400 hover:bg-pink-500/10"
                              : "text-gray-400 hover:text-pink-500 hover:bg-gray-700",
                          )}
                          aria-pressed={trivia.isFavorited}
                          aria-label={trivia.isFavorited ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart className={cn("h-4 w-4", trivia.isFavorited && "fill-current")} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black text-white border-gray-700">
                        <p>{trivia.isFavorited ? "Remove from Favorites" : "Add to Favorites"}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onShare(trivia.id, trivia.content)}
                          className="text-sm text-gray-400 hover:text-[#00BFFF] hover:bg-gray-700 h-8 w-8"
                          aria-label="Share trivia"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black text-white border-gray-700">
                        <p>Share Trivia</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onReport(trivia.id)}
                          className="text-sm text-gray-400 hover:text-yellow-400 hover:bg-gray-700 h-8 w-8"
                          aria-label="Report trivia"
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black text-white border-gray-700">
                        <p>Report Trivia</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
}
