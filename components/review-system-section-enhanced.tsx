"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {
  Edit,
  ThumbsUp,
  ThumbsDown,
  Star,
  ChevronDown,
  ChevronUp,
  Check,
  Filter,
  SortAsc,
  SortDesc,
  X,
  MessageSquare,
  Share,
  Flag,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

interface Review {
  id: string
  userId: string
  username: string
  avatarUrl?: string
  rating: number
  verified: boolean
  date: string
  content: string
  containsSpoilers: boolean
  helpfulCount: number
  unhelpfulCount: number
  userVote?: "helpful" | "unhelpful" | null
  comments?: number
  shares?: number
}

interface ReviewSystemSectionEnhancedProps {
  movie: {
    id: string
    title: string
    sidduScore: number
    reviewCount: number
    ratingDistribution: {
      rating: number
      count: number
    }[]
    sentimentAnalysis: {
      positive: number
      neutral: number
      negative: number
      keyPhrases: string[]
    }
    reviews: Review[]
  }
}

export function ReviewSystemSectionEnhanced({ movie }: ReviewSystemSectionEnhancedProps) {
  const [activeFilter, setActiveFilter] = useState("latest")
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({})
  const [visibleSpoilers, setVisibleSpoilers] = useState<Record<string, boolean>>({})
  const [reviewVotes, setReviewVotes] = useState<Record<string, "helpful" | "unhelpful" | null>>({})
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showSortPanel, setShowSortPanel] = useState(false)
  const [ratingFilter, setRatingFilter] = useState<number[]>([0, 10])
  const [verifiedFilter, setVerifiedFilter] = useState(false)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest" | "most-helpful">("newest")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [reviewText, setReviewText] = useState("")
  const [containsSpoilers, setContainsSpoilers] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewSuccess, setShowReviewSuccess] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  // Find the max count for scaling the distribution bars
  const maxCount = Math.max(...movie.ratingDistribution.map((item) => item.count))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const barVariants = {
    hidden: { width: 0 },
    visible: (custom: number) => ({
      width: `${(custom / maxCount) * 100}%`,
      transition: { duration: 0.5, ease: "easeOut" },
    }),
  }

  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }))
  }

  const toggleSpoilerVisibility = (reviewId: string) => {
    setVisibleSpoilers((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }))
  }

  const handleVote = (reviewId: string, voteType: "helpful" | "unhelpful") => {
    setReviewVotes((prev) => ({
      ...prev,
      [reviewId]: prev[reviewId] === voteType ? null : voteType,
    }))
  }

  const handleSubmitReview = () => {
    if (!userRating || !reviewText) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowReviewForm(false)
      setShowReviewSuccess(true)

      // Reset form
      setUserRating(null)
      setReviewText("")
      setContainsSpoilers(false)

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowReviewSuccess(false)
      }, 5000)
    }, 1500)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 10 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-[#FFD700] fill-[#FFD700]" : "text-[#3A3A3A]"}`} />
    ))
  }

  const renderRatingStars = () => {
    return Array.from({ length: 10 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 cursor-pointer transition-transform ${
          (hoveredRating !== null ? i < hoveredRating : i < (userRating || 0))
            ? "text-[#FFD700] fill-[#FFD700]"
            : "text-[#3A3A3A] hover:text-[#FFD700]"
        }`}
        onMouseEnter={() => setHoveredRating(i + 1)}
        onMouseLeave={() => setHoveredRating(null)}
        onClick={() => setUserRating(i + 1)}
      />
    ))
  }

  // Filter and sort reviews
  const getFilteredAndSortedReviews = () => {
    let filtered = [...movie.reviews]

    // Apply rating filter
    filtered = filtered.filter((review) => review.rating >= ratingFilter[0] && review.rating <= ratingFilter[1])

    // Apply verified filter
    if (verifiedFilter) {
      filtered = filtered.filter((review) => review.verified)
    }

    // Apply tab filter
    if (activeFilter === "verified") {
      filtered = filtered.filter((review) => review.verified)
    } else if (activeFilter === "spoiler-free") {
      filtered = filtered.filter((review) => !review.containsSpoilers)
    }

    // Apply sorting
    switch (sortOrder) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating)
        break
      case "most-helpful":
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount)
        break
    }

    return filtered
  }

  const filteredReviews = getFilteredAndSortedReviews()

  return (
    <motion.section
      ref={sectionRef}
      className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Section Title with Animation */}
      <motion.div className="flex items-center justify-between mb-6" variants={itemVariants}>
        <h2 className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0]">
          Reviews
          <Badge className="ml-2 bg-[#282828] text-[#A0A0A0]">{movie.reviewCount}</Badge>
        </h2>

        {!showReviewForm && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] font-inter"
              onClick={() => setShowReviewForm(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Write a Review
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Review Success Message */}
      <AnimatePresence>
        {showReviewSuccess && (
          <motion.div
            className="bg-green-900/20 border border-green-700 text-green-400 p-4 rounded-lg mb-6 flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              <span>Your review has been submitted successfully! Thank you for your contribution.</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-green-400 hover:text-green-300 hover:bg-green-900/30"
              onClick={() => setShowReviewSuccess(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            className="bg-[#282828] rounded-lg p-6 mb-8 border border-[#3A3A3A]"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#E0E0E0]">Write Your Review</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#A0A0A0] hover:text-[#E0E0E0]"
                onClick={() => setShowReviewForm(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mb-6">
              <label className="block text-[#E0E0E0] mb-2">Your Rating</label>
              <div className="flex gap-1 mb-2">{renderRatingStars()}</div>
              {userRating && <p className="text-sm text-[#A0A0A0]">You've rated this movie {userRating}/10</p>}
            </div>

            <div className="mb-6">
              <label className="block text-[#E0E0E0] mb-2">Your Review</label>
              <textarea
                className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-md p-3 text-[#E0E0E0] min-h-[150px]"
                placeholder="Share your thoughts about this movie..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            <div className="mb-6 flex items-center">
              <Checkbox
                id="contains-spoilers"
                checked={containsSpoilers}
                onCheckedChange={(checked) => setContainsSpoilers(checked === true)}
              />
              <label htmlFor="contains-spoilers" className="ml-2 text-[#E0E0E0]">
                This review contains spoilers
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="border-[#A0A0A0] text-[#E0E0E0]"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD]"
                onClick={handleSubmitReview}
                disabled={!userRating || !reviewText || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating Summary */}
      <motion.div className="bg-[#151515] rounded-lg p-6 md:p-8 mb-8" variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: SidduScore and Count */}
          <div className="flex flex-col items-center md:items-start">
            <motion.div
              className="bg-[#00BFFF] text-[#1A1A1A] rounded-full h-24 w-24 flex items-center justify-center font-inter font-bold text-4xl mb-4 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              {movie.sidduScore}
              <motion.div
                className="absolute inset-0 rounded-full bg-[#00BFFF]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            <p className="text-[#E0E0E0] font-dmsans text-lg mb-2">{movie.reviewCount} Verified Reviews</p>
            <div className="flex items-center gap-2 text-[#A0A0A0] text-sm">
              <span>Based on audience ratings</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>SidduScore is calculated based on verified user reviews</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Right Column: Distribution and Sentiment */}
          <div>
            {/* Rating Distribution */}
            <div className="mb-6">
              <h3 className="text-[#E0E0E0] font-inter font-medium text-lg mb-3">Rating Distribution</h3>
              <div className="space-y-2">
                {movie.ratingDistribution.map((item, index) => (
                  <div key={item.rating} className="flex items-center gap-2">
                    <span className="text-[#A0A0A0] font-dmsans w-6 text-right">{item.rating}</span>
                    <div className="h-4 bg-[#282828] rounded-full flex-1 overflow-hidden">
                      <motion.div
                        className="h-full bg-[#00BFFF]"
                        custom={item.count}
                        variants={barVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                      />
                    </div>
                    <span className="text-[#A0A0A0] font-dmsans w-10">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div>
              <h3 className="text-[#E0E0E0] font-inter font-medium text-lg mb-3">What People Are Saying</h3>
              <div className="flex gap-2 mb-3">
                <span className="text-[#00BFFF] font-dmsans">{movie.sentimentAnalysis.positive}% Positive</span>
                <span className="text-[#A0A0A0]">•</span>
                <span className="text-[#E0E0E0] font-dmsans">{movie.sentimentAnalysis.neutral}% Neutral</span>
                <span className="text-[#A0A0A0]">•</span>
                <span className="text-[#FF4500] font-dmsans">{movie.sentimentAnalysis.negative}% Negative</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.sentimentAnalysis.keyPhrases.map((phrase, index) => (
                  <motion.span
                    key={index}
                    className="bg-[#282828] text-[#E0E0E0] px-3 py-1 rounded-full text-sm font-dmsans cursor-pointer hover:bg-[#3A3A3A] transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {phrase}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Review Filters and Controls */}
      <motion.div className="mb-6" variants={itemVariants}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <Tabs defaultValue={activeFilter} onValueChange={setActiveFilter} className="w-full">
            <TabsList className="bg-[#1A1A1A] border-b border-[#282828] w-full justify-start overflow-x-auto pb-1 scrollbar-hide">
              <TabsTrigger
                value="latest"
                className="data-[state=active]:text-[#00BFFF] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none px-4 font-inter"
              >
                Latest
              </TabsTrigger>
              <TabsTrigger
                value="top"
                className="data-[state=active]:text-[#00BFFF] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none px-4 font-inter"
              >
                Top Rated
              </TabsTrigger>
              <TabsTrigger
                value="verified"
                className="data-[state=active]:text-[#00BFFF] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none px-4 font-inter"
              >
                Verified
              </TabsTrigger>
              <TabsTrigger
                value="spoiler-free"
                className="data-[state=active]:text-[#00BFFF] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none px-4 font-inter"
              >
                Spoiler Free
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Popover open={showFilterPanel} onOpenChange={setShowFilterPanel}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0]">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-[#282828] border-[#3A3A3A]">
                <div className="space-y-4">
                  <h4 className="font-medium text-[#E0E0E0]">Filter Reviews</h4>

                  <div className="space-y-2">
                    <h5 className="text-sm text-[#A0A0A0]">Rating Range</h5>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, 10]}
                        max={10}
                        step={1}
                        value={ratingFilter}
                        onValueChange={setRatingFilter}
                        className="my-4"
                      />
                      <div className="flex justify-between text-xs text-[#A0A0A0]">
                        <span>{ratingFilter[0]}</span>
                        <span>{ratingFilter[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm text-[#A0A0A0]">Review Type</h5>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verified-only"
                        checked={verifiedFilter}
                        onCheckedChange={(checked) => setVerifiedFilter(checked === true)}
                      />
                      <label
                        htmlFor="verified-only"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#E0E0E0]"
                      >
                        Verified reviews only
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD]"
                      onClick={() => setShowFilterPanel(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={showSortPanel} onOpenChange={setShowSortPanel}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0]">
                  {sortOrder === "newest" || sortOrder === "oldest" ? (
                    <SortDesc className="h-4 w-4 mr-2" />
                  ) : (
                    <SortAsc className="h-4 w-4 mr-2" />
                  )}
                  Sort
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-[#282828] border-[#3A3A3A]">
                <div className="space-y-4">
                  <h4 className="font-medium text-[#E0E0E0]">Sort Reviews</h4>

                  <RadioGroup value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="newest" id="newest" />
                      <Label htmlFor="newest" className="text-[#E0E0E0]">
                        Newest First
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oldest" id="oldest" />
                      <Label htmlFor="oldest" className="text-[#E0E0E0]">
                        Oldest First
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="highest" id="highest" />
                      <Label htmlFor="highest" className="text-[#E0E0E0]">
                        Highest Rated
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lowest" id="lowest" />
                      <Label htmlFor="lowest" className="text-[#E0E0E0]">
                        Lowest Rated
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="most-helpful" id="most-helpful" />
                      <Label htmlFor="most-helpful" className="text-[#E0E0E0]">
                        Most Helpful
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex justify-end">
                    <Button
                      className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD]"
                      onClick={() => setShowSortPanel(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters Display */}
        {(ratingFilter[0] > 0 || ratingFilter[1] < 10 || verifiedFilter) && (
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="text-sm text-[#A0A0A0]">Active Filters:</div>

            {(ratingFilter[0] > 0 || ratingFilter[1] < 10) && (
              <Badge className="bg-[#282828] text-[#E0E0E0] font-normal">
                Rating: {ratingFilter[0]} - {ratingFilter[1]}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-transparent"
                  onClick={() => setRatingFilter([0, 10])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {verifiedFilter && (
              <Badge className="bg-[#282828] text-[#E0E0E0] font-normal">
                Verified Only
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-transparent"
                  onClick={() => setVerifiedFilter(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            <Button
              variant="link"
              className="text-[#00BFFF] hover:text-[#00A3DD] p-0 h-auto text-sm"
              onClick={() => {
                setRatingFilter([0, 10])
                setVerifiedFilter(false)
              }}
            >
              Clear All
            </Button>
          </div>
        )}
      </motion.div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.length === 0 ? (
          <motion.div className="col-span-2 bg-[#282828] rounded-lg p-8 text-center" variants={itemVariants}>
            <div className="mb-4 text-[#A0A0A0]">
              <MessageSquare className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-medium text-[#E0E0E0] mb-2">No reviews match your filters</h3>
            <p className="text-[#A0A0A0] mb-4">Try adjusting your filters or be the first to write a review!</p>
            <Button
              className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD]"
              onClick={() => {
                setRatingFilter([0, 10])
                setVerifiedFilter(false)
                setShowReviewForm(true)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Write a Review
            </Button>
          </motion.div>
        ) : (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              custom={index}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-[#282828] border-none shadow-md hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  {/* Review Header */}
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mr-3">
                      <motion.div
                        className="w-10 h-10 rounded-full overflow-hidden bg-[#3A3A3A]"
                        whileHover={{ scale: 1.1 }}
                      >
                        {review.avatarUrl ? (
                          <Image
                            src={review.avatarUrl || "/placeholder.svg?height=40&width=40&query=user avatar"}
                            alt={review.username}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#A0A0A0]">
                            {review.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h4 className="font-inter font-medium text-[#E0E0E0] mr-2">{review.username}</h4>
                        {review.verified && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="bg-[#00BFFF]/10 text-[#00BFFF] text-xs px-2 py-0.5 rounded-full flex items-center">
                                  <Check className="w-3 h-3 mr-1" />
                                  <span>Verified</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This user has verified they watched this movie</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div className="flex mr-3">{renderStars(review.rating)}</div>
                        <span className="text-[#A0A0A0] text-sm font-dmsans">{review.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    {review.containsSpoilers && !visibleSpoilers[review.id] ? (
                      <div className="bg-[#1A1A1A] p-4 rounded-md">
                        <p className="text-[#A0A0A0] font-dmsans mb-2">This review contains spoilers</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A] font-dmsans"
                          onClick={() => toggleSpoilerVisibility(review.id)}
                        >
                          Show Spoilers
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p
                          className={`text-[#E0E0E0] font-dmsans ${
                            !expandedReviews[review.id] && review.content.length > 300 ? "line-clamp-4" : ""
                          }`}
                        >
                          {review.content}
                        </p>
                        {review.content.length > 300 && (
                          <motion.button
                            onClick={() => toggleExpandReview(review.id)}
                            className="text-[#00BFFF] hover:text-[#00A3DD] transition-colors mt-2 font-dmsans text-sm flex items-center"
                            whileHover={{ x: expandedReviews[review.id] ? -3 : 3 }}
                          >
                            {expandedReviews[review.id] ? (
                              <>
                                Show Less <ChevronUp className="ml-1 w-4 h-4" />
                              </>
                            ) : (
                              <>
                                Read More <ChevronDown className="ml-1 w-4 h-4" />
                              </>
                            )}
                          </motion.button>
                        )}
                        {review.containsSpoilers && visibleSpoilers[review.id] && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A] font-dmsans mt-2"
                            onClick={() => toggleSpoilerVisibility(review.id)}
                          >
                            Hide Spoilers
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Review Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-dmsans text-[#A0A0A0]">Was this review helpful?</div>
                    <div className="flex items-center gap-4">
                      <motion.button
                        className={`flex items-center gap-1 ${
                          reviewVotes[review.id] === "helpful" ? "text-[#00BFFF]" : "text-[#A0A0A0]"
                        } hover:text-[#00BFFF] transition-colors`}
                        onClick={() => handleVote(review.id, "helpful")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpfulCount + (reviewVotes[review.id] === "helpful" ? 1 : 0)}</span>
                      </motion.button>
                      <motion.button
                        className={`flex items-center gap-1 ${
                          reviewVotes[review.id] === "unhelpful" ? "text-[#FF4500]" : "text-[#A0A0A0]"
                        } hover:text-[#FF4500] transition-colors`}
                        onClick={() => handleVote(review.id, "unhelpful")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{review.unhelpfulCount + (reviewVotes[review.id] === "unhelpful" ? 1 : 0)}</span>
                      </motion.button>

                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.button
                                className="text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </motion.button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Comment on this review</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.button
                                className="text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Share className="w-4 h-4" />
                              </motion.button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Share this review</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.button
                                className="text-[#A0A0A0] hover:text-[#FF4500] transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Flag className="w-4 h-4" />
                              </motion.button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Report this review</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {filteredReviews.length > 0 && (
        <motion.div className="flex justify-center mt-8" variants={itemVariants} custom={filteredReviews.length}>
          <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
            Load More Reviews
          </Button>
        </motion.div>
      )}
    </motion.section>
  )
}
