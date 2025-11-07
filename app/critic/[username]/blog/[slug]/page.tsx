"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Clock, Eye, Share2, Twitter, Facebook, Link as LinkIcon, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CriticBlogPost } from "@/types/critic"
import { getApiUrl } from "@/lib/api-config"

export default function BlogPostPage() {
  const params = useParams()
  const username = params.username as string
  const slug = params.slug as string

  const [post, setPost] = useState<CriticBlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<CriticBlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch blog post from API
        const apiUrl = getApiUrl()
        const response = await fetch(`${apiUrl}/critic-blog/${username}/${slug}`)

        if (!response.ok) {
          throw new Error("Failed to fetch blog post")
        }

        const foundPost = await response.json()

        if (foundPost) {
          setPost(foundPost)
          // Fetch related posts from API
          try {
            const relatedResponse = await fetch(`${apiUrl}/critic-blog/${username}?tags=${foundPost.tags.join(",")}`)
            if (relatedResponse.ok) {
              const allBlogPosts = await relatedResponse.json()
              const related = allBlogPosts
                .filter((p: CriticBlogPost) => p.id !== foundPost.id)
                .slice(0, 3)
              setRelatedPosts(related)
            }
          } catch (error) {
            console.error("Error fetching related posts:", error)
          }
        }
      } catch (error) {
        console.error("Error fetching blog post:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [username, slug])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = post?.title || ""

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank")
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        alert("Link copied to clipboard!")
        break
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[#282828] rounded w-3/4" />
            <div className="h-64 bg-[#282828] rounded" />
            <div className="h-4 bg-[#282828] rounded w-full" />
            <div className="h-4 bg-[#282828] rounded w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-[#E0E0E0] mb-4">Post Not Found</h1>
          <p className="text-[#A0A0A0] mb-6">The blog post you're looking for doesn't exist.</p>
          <Link href={`/critic/${username}`}>
            <Button className="bg-[#00BFFF] hover:bg-[#0099CC] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Critic Profile
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(post.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link href={`/critic/${username}`}>
          <Button variant="ghost" className="mb-6 text-[#A0A0A0] hover:text-[#00BFFF]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </Link>

        {/* Article Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#282828] border border-[#3A3A3A] rounded-xl overflow-hidden"
        >
          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="relative w-full h-[400px]">
              <Image src={post.featured_image_url} alt={post.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#282828] to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-[#1A1A1A] border-[#3A3A3A] text-[#00BFFF]">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#E0E0E0] font-inter mb-4">{post.title}</h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-[#A0A0A0]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.read_time_minutes} min read</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views_count.toLocaleString()} views</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 mb-8 pb-8 border-b border-[#3A3A3A]">
              <Share2 className="w-4 h-4 text-[#A0A0A0]" />
              <span className="text-sm text-[#A0A0A0] mr-2">Share:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("twitter")}
                className="bg-[#1A1A1A] border-[#3A3A3A] hover:border-[#00BFFF]"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("facebook")}
                className="bg-[#1A1A1A] border-[#3A3A3A] hover:border-[#00BFFF]"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("copy")}
                className="bg-[#1A1A1A] border-[#3A3A3A] hover:border-[#00BFFF]"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Article Content */}
            <div className="prose prose-invert max-w-none">
              <div
                className="text-[#E0E0E0] leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .split("\n\n")
                    .map((paragraph) => {
                      if (paragraph.startsWith("## ")) {
                        return `<h2 class="text-2xl font-bold text-[#E0E0E0] font-inter mt-8 mb-4">${paragraph.replace("## ", "")}</h2>`
                      }
                      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                        return `<p class="text-lg font-bold text-[#00BFFF] mt-6 mb-2">${paragraph.replace(/\*\*/g, "")}</p>`
                      }
                      return `<p class="text-[#E0E0E0] mb-4">${paragraph}</p>`
                    })
                    .join(""),
                }}
              />
            </div>
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#E0E0E0] font-inter mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/critic/${username}/blog/${relatedPost.slug}`}>
                  <Card className="bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] transition-all cursor-pointer h-full">
                    {relatedPost.featured_image_url && (
                      <div className="relative w-full h-40">
                        <Image
                          src={relatedPost.featured_image_url}
                          alt={relatedPost.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-[#E0E0E0] font-inter mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-[#A0A0A0] line-clamp-2">{relatedPost.excerpt}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

