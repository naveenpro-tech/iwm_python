"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Film, AtSign, Hash, Smile, X, ChevronDown, Send, Eye, LucideImage } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EnhancedPulseComposerProps {
  onSubmit?: (data: PulsePostData) => void
  className?: string
  initialValue?: string
  placeholder?: string
  autoFocus?: boolean
  userAvatarUrl?: string
}

export interface PulsePostData {
  content: string
  media?: File[]
  tags?: string[]
  mentions?: { id: string; name: string }[]
  movieTags?: { id: string; title: string }[]
  mood?: string
  visibility?: "public" | "followers" | "private"
}

const moods = [
  { name: "Excited", emoji: "😃" },
  { name: "Thoughtful", emoji: "🤔" },
  { name: "Impressed", emoji: "😮" },
  { name: "Disappointed", emoji: "😞" },
  { name: "Amused", emoji: "😂" },
  { name: "Inspired", emoji: "✨" },
  { name: "Confused", emoji: "😕" },
  { name: "Nostalgic", emoji: "🥹" },
]

const mockMovieSuggestions = [
  { id: "m1", title: "Inception", posterUrl: "/inception-movie-poster.png" },
  { id: "m2", title: "The Dark Knight", posterUrl: "/dark-knight-poster.png" },
  { id: "m3", title: "Interstellar", posterUrl: "/interstellar-poster.png" },
  { id: "m4", title: "Oppenheimer", posterUrl: "/oppenheimer-inspired-poster.png" },
]

const mockPeopleSuggestions = [
  { id: "p1", name: "Christopher Nolan", avatarUrl: "/christopher-nolan.png" },
  { id: "p2", name: "Leonardo DiCaprio", avatarUrl: "/leonardo-dicaprio.png" },
  { id: "p3", name: "Cillian Murphy", avatarUrl: "/cillian-murphy-portrait.png" },
]

const mockTagSuggestions = ["CinematicMasterpiece", "MustWatch", "FilmReview", "ClassicFilm", "Cinematography"]

export function EnhancedPulseComposer({
  onSubmit,
  className,
  initialValue = "",
  placeholder: initialPlaceholder = "What's on your cinematic mind?",
  autoFocus = false,
  userAvatarUrl = "/user-avatar-1.png",
}: EnhancedPulseComposerProps) {
  const [content, setContent] = useState(initialValue)
  const [isExpanded, setIsExpanded] = useState(autoFocus)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [mentions, setMentions] = useState<{ id: string; name: string }[]>([])
  const [movieTags, setMovieTags] = useState<{ id: string; title: string }[]>([])
  const [mood, setMood] = useState<string | null>(null)
  const [visibility, setVisibility] = useState<"public" | "followers" | "private">("public")
  const [showSuggestions, setShowSuggestions] = useState<"none" | "movies" | "people" | "tags">("none")
  const [suggestionQuery, setSuggestionQuery] = useState("")
  const [placeholder, setPlaceholder] = useState(initialPlaceholder)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const composerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content, isExpanded])

  useEffect(() => {
    if (autoFocus && isExpanded && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus, isExpanded])

  useEffect(() => {
    setPlaceholder(isExpanded ? "Share your detailed thoughts, link movies, mention people..." : initialPlaceholder)
  }, [isExpanded, initialPlaceholder])

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (isExpanded && composerRef.current && !composerRef.current.contains(event.target as Node)) {
        if (
          content.trim() === "" &&
          mediaFiles.length === 0 &&
          tags.length === 0 &&
          mentions.length === 0 &&
          movieTags.length === 0 &&
          !mood
        ) {
          setIsExpanded(false)
          setShowSuggestions("none")
        }
      }
    },
    [isExpanded, content, mediaFiles, tags, mentions, movieTags, mood],
  )

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClickOutside])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)

    const cursorPos = e.target.selectionStart
    const textBeforeCursor = newContent.substring(0, cursorPos)
    const currentWordMatch = textBeforeCursor.match(/[@#$]\w*$/)

    if (currentWordMatch) {
      const trigger = currentWordMatch[0][0]
      const query = currentWordMatch[0].substring(1)
      setSuggestionQuery(query)
      if (trigger === "@") setShowSuggestions("people")
      else if (trigger === "#") setShowSuggestions("tags")
      else if (trigger === "$") setShowSuggestions("movies")
    } else {
      setShowSuggestions("none")
    }
  }

  const handleFocus = () => !isExpanded && setIsExpanded(true)

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFilesArray = Array.from(e.target.files)
      setMediaFiles((prev) => [...prev, ...newFilesArray])
      const newPreviewsArray = newFilesArray.map((file) => URL.createObjectURL(file))
      setMediaPreviews((prev) => [...prev, ...newPreviewsArray])
      if (fileInputRef.current) fileInputRef.current.value = "" // Reset file input
    }
  }

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index])
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const insertSuggestion = (textToInsert: string) => {
    if (!textareaRef.current) return
    const currentVal = textareaRef.current.value
    const cursorPos = textareaRef.current.selectionStart
    const textBeforeCursor = currentVal.substring(0, cursorPos)
    const textAfterCursor = currentVal.substring(cursorPos)

    const lastTriggerIndex = Math.max(
      textBeforeCursor.lastIndexOf("@"),
      textBeforeCursor.lastIndexOf("#"),
      textBeforeCursor.lastIndexOf("$"),
    )
    const textToReplace = textBeforeCursor.substring(lastTriggerIndex)

    const newTextBeforeCursor = textBeforeCursor.substring(0, lastTriggerIndex)

    const newContent = `${newTextBeforeCursor}${textToInsert} ${textAfterCursor}`
    setContent(newContent)
    setShowSuggestions("none")
    setSuggestionQuery("")

    // Focus and set cursor position after insertion
    setTimeout(() => {
      textareaRef.current?.focus()
      const newCursorPos = newTextBeforeCursor.length + textToInsert.length + 1
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const addMovieTagToList = (movie: { id: string; title: string }) => {
    if (!movieTags.some((m) => m.id === movie.id)) {
      setMovieTags((prev) => [...prev, movie])
    }
    insertSuggestion(`$${movie.title}`)
  }

  const addMentionToList = (person: { id: string; name: string }) => {
    if (!mentions.some((m) => m.id === person.id)) {
      setMentions((prev) => [...prev, person])
    }
    insertSuggestion(`@${person.name}`)
  }

  const addTagToList = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags((prev) => [...prev, tag])
    }
    insertSuggestion(`#${tag}`)
  }

  const removeEntity = (type: "tag" | "movieTag" | "mention", value: string) => {
    let entityText = ""
    if (type === "tag") {
      setTags((prev) => prev.filter((t) => t !== value))
      entityText = `#${value}`
    } else if (type === "movieTag") {
      const movie = movieTags.find((m) => m.id === value)
      if (movie) {
        setMovieTags((prev) => prev.filter((m) => m.id !== value))
        entityText = `$${movie.title}`
      }
    } else if (type === "mention") {
      const person = mentions.find((p) => p.id === value)
      if (person) {
        setMentions((prev) => prev.filter((p) => p.id !== value))
        entityText = `@${person.name}`
      }
    }
    // Remove the first occurrence of the entity text from content
    setContent((prev) => prev.replace(new RegExp(escapeRegExp(entityText) + "\\s?", "i"), ""))
  }

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
  }

  const handleSubmit = () => {
    if (content.trim() === "" && mediaFiles.length === 0) return
    if (onSubmit) {
      onSubmit({ content, media: mediaFiles, tags, mentions, movieTags, mood, visibility })
    }
    setContent("")
    setMediaFiles([])
    setMediaPreviews([])
    setTags([])
    setMentions([])
    setMovieTags([])
    setMood(null)
    if (!autoFocus) setIsExpanded(false)
    setShowSuggestions("none")
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  const filteredMovieSuggestions = mockMovieSuggestions.filter((movie) =>
    movie.title.toLowerCase().includes(suggestionQuery.toLowerCase()),
  )
  const filteredPeopleSuggestions = mockPeopleSuggestions.filter((person) =>
    person.name.toLowerCase().includes(suggestionQuery.toLowerCase()),
  )
  const filteredTagSuggestions = mockTagSuggestions.filter((tag) =>
    tag.toLowerCase().includes(suggestionQuery.toLowerCase()),
  )

  return (
    <motion.div
      ref={composerRef}
      className={cn(
        "bg-siddu-bg-card-dark border border-siddu-border-subtle rounded-xl p-3 md:p-4 shadow-lg",
        className,
      )}
      layout
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0 mt-1">
          <AvatarImage src={userAvatarUrl || "/placeholder.svg"} alt="Your avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextChange}
            onFocus={handleFocus}
            onClick={handleFocus} // Also expand on click
            placeholder={placeholder}
            className={cn(
              "min-h-[24px] w-full resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-siddu-text-light placeholder:text-siddu-text-subtle",
              isExpanded ? "min-h-[80px]" : "max-h-[24px] overflow-hidden whitespace-nowrap text-ellipsis",
            )}
            rows={isExpanded ? 3 : 1}
          />

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="pulse-composer-controls"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                {mediaPreviews.length > 0 && (
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 my-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {mediaPreviews.map((preview, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden aspect-video bg-siddu-bg-card">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt="Media preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMedia(index)}
                          className="absolute top-1 right-1 bg-black/70 rounded-full p-1 h-6 w-6 text-white hover:bg-black"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </motion.div>
                )}

                {(tags.length > 0 || movieTags.length > 0 || mentions.length > 0) && (
                  <motion.div className="flex flex-wrap gap-2 my-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-siddu-purple-secondary/30 hover:bg-siddu-purple-secondary/50 text-siddu-purple-primary flex items-center gap-1"
                      >
                        <Hash size={12} />
                        {tag}
                        <button onClick={() => removeEntity("tag", tag)} className="ml-1 opacity-70 hover:opacity-100">
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                    {movieTags.map((movie) => (
                      <Badge
                        key={movie.id}
                        variant="secondary"
                        className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 flex items-center gap-1"
                      >
                        <Film size={12} />
                        {movie.title}
                        <button
                          onClick={() => removeEntity("movieTag", movie.id)}
                          className="ml-1 opacity-70 hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                    {mentions.map((person) => (
                      <Badge
                        key={person.id}
                        variant="secondary"
                        className="bg-green-900/30 hover:bg-green-900/50 text-green-400 flex items-center gap-1"
                      >
                        <AtSign size={12} />
                        {person.name}
                        <button
                          onClick={() => removeEntity("mention", person.id)}
                          className="ml-1 opacity-70 hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </motion.div>
                )}

                {mood && (
                  <motion.div
                    className="my-3 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="text-sm text-siddu-text-subtle">Feeling:</span>
                    <Badge
                      variant="outline"
                      className="bg-siddu-bg-card text-siddu-text-light border-siddu-border-subtle flex items-center gap-1"
                    >
                      <span>{moods.find((m) => m.name === mood)?.emoji}</span>
                      {mood}
                      <button onClick={() => setMood(null)} className="ml-1 opacity-70 hover:opacity-100">
                        <X size={12} />
                      </button>
                    </Badge>
                  </motion.div>
                )}

                <AnimatePresence>
                  {showSuggestions !== "none" && (
                    <motion.div
                      className="mt-2 mb-3 bg-siddu-bg-card/80 backdrop-blur-sm border border-siddu-border-subtle rounded-lg overflow-hidden shadow-xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {showSuggestions === "movies" && (
                        <div className="p-2">
                          <div className="text-xs text-siddu-text-subtle mb-2 px-2">
                            Tag a movie: {suggestionQuery && `(searching "${suggestionQuery}")`}
                          </div>
                          <div className="max-h-[150px] overflow-y-auto space-y-1">
                            {filteredMovieSuggestions.map((movie) => (
                              <div
                                key={movie.id}
                                className="flex items-center gap-2 p-2 hover:bg-siddu-bg-card-dark rounded-md cursor-pointer"
                                onClick={() => addMovieTagToList(movie)}
                              >
                                <div className="w-8 h-12 rounded overflow-hidden bg-siddu-bg-card flex-shrink-0">
                                  <img
                                    src={movie.posterUrl || "/placeholder.svg?width=32&height=48&query=movie+poster"}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="text-sm text-siddu-text-light">{movie.title}</div>
                              </div>
                            ))}
                            {filteredMovieSuggestions.length === 0 && (
                              <p className="p-2 text-sm text-siddu-text-subtle">No movies found.</p>
                            )}
                          </div>
                        </div>
                      )}
                      {showSuggestions === "people" && (
                        <div className="p-2">
                          <div className="text-xs text-siddu-text-subtle mb-2 px-2">
                            Mention someone: {suggestionQuery && `(searching "${suggestionQuery}")`}
                          </div>
                          <div className="max-h-[150px] overflow-y-auto space-y-1">
                            {filteredPeopleSuggestions.map((person) => (
                              <div
                                key={person.id}
                                className="flex items-center gap-2 p-2 hover:bg-siddu-bg-card-dark rounded-md cursor-pointer"
                                onClick={() => addMentionToList(person)}
                              >
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarImage
                                    src={person.avatarUrl || "/placeholder.svg?width=32&height=32&query=avatar"}
                                    alt={person.name}
                                  />
                                  <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="text-sm text-siddu-text-light">{person.name}</div>
                              </div>
                            ))}
                            {filteredPeopleSuggestions.length === 0 && (
                              <p className="p-2 text-sm text-siddu-text-subtle">No people found.</p>
                            )}
                          </div>
                        </div>
                      )}
                      {showSuggestions === "tags" && (
                        <div className="p-2">
                          <div className="text-xs text-siddu-text-subtle mb-2 px-2">
                            Add a tag: {suggestionQuery && `(searching "${suggestionQuery}")`}
                          </div>
                          <div className="flex flex-wrap gap-2 p-2 max-h-[150px] overflow-y-auto">
                            {filteredTagSuggestions.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-siddu-purple-secondary/30 hover:bg-siddu-purple-secondary/50 text-siddu-purple-primary cursor-pointer"
                                onClick={() => addTagToList(tag)}
                              >
                                #{tag}
                              </Badge>
                            ))}
                            {filteredTagSuggestions.length === 0 && suggestionQuery && (
                              <Badge
                                variant="secondary"
                                className="bg-siddu-purple-secondary/30 hover:bg-siddu-purple-secondary/50 text-siddu-purple-primary cursor-pointer"
                                onClick={() => addTagToList(suggestionQuery)}
                              >
                                Add #{suggestionQuery}
                              </Badge>
                            )}
                            {filteredTagSuggestions.length === 0 && !suggestionQuery && (
                              <p className="text-sm text-siddu-text-subtle">No suggested tags.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between mt-3 border-t border-siddu-border-subtle pt-3">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleMediaUpload}
                      className="hidden"
                      accept="image/*,video/*"
                      multiple
                    />
                    <Button
                      aria-label="Add media"
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-siddu-text-subtle hover:text-siddu-electric-blue hover:bg-siddu-electric-blue/10"
                      onClick={triggerFileInput}
                    >
                      <LucideImage size={18} />
                    </Button>
                    <Button
                      aria-label="Tag movie"
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-siddu-text-subtle hover:text-siddu-electric-blue hover:bg-siddu-electric-blue/10"
                      onClick={() => setShowSuggestions((prev) => (prev === "movies" ? "none" : "movies"))}
                    >
                      <Film size={18} />
                    </Button>
                    <Button
                      aria-label="Mention person"
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-siddu-text-subtle hover:text-siddu-electric-blue hover:bg-siddu-electric-blue/10"
                      onClick={() => setShowSuggestions((prev) => (prev === "people" ? "none" : "people"))}
                    >
                      <AtSign size={18} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-label="Add mood"
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-siddu-text-subtle hover:text-siddu-electric-blue hover:bg-siddu-electric-blue/10"
                        >
                          <Smile size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="bg-siddu-bg-card border-siddu-border-subtle text-siddu-text-light"
                      >
                        <div className="grid grid-cols-4 gap-1 p-2">
                          {moods.map((m) => (
                            <DropdownMenuItem
                              key={m.name}
                              className="flex flex-col items-center justify-center p-2 hover:bg-siddu-bg-card-dark rounded-md cursor-pointer focus:bg-siddu-bg-card-dark focus:text-siddu-electric-blue"
                              onClick={() => setMood(m.name)}
                            >
                              <div className="text-xl">{m.emoji}</div>
                              <div className="text-xs mt-1">{m.name}</div>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-siddu-text-subtle hover:text-siddu-text-light flex items-center gap-1 hover:bg-siddu-border-subtle/50"
                        >
                          <Eye size={16} />
                          {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                          <ChevronDown size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-siddu-bg-card border-siddu-border-subtle text-siddu-text-light"
                      >
                        <DropdownMenuItem
                          className="focus:bg-siddu-bg-card-dark focus:text-siddu-electric-blue"
                          onClick={() => setVisibility("public")}
                        >
                          Public
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="focus:bg-siddu-bg-card-dark focus:text-siddu-electric-blue"
                          onClick={() => setVisibility("followers")}
                        >
                          Followers only
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="focus:bg-siddu-bg-card-dark focus:text-siddu-electric-blue"
                          onClick={() => setVisibility("private")}
                        >
                          Private
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      onClick={handleSubmit}
                      className="bg-siddu-purple-primary hover:bg-siddu-purple-primary/80 text-white px-4 py-2 rounded-full font-semibold"
                    >
                      <Send size={16} className="mr-2" />
                      Post
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
