import type { PinnedContent } from "@/types/critic"
import { generateMockCriticReviews } from "./mock-critic-profiles"
import { generateMockBlogPosts } from "./mock-blog-posts"
import { generateMockRecommendations } from "./mock-recommendations"

export function generateMockPinnedContent(criticUsername: string): PinnedContent[] {
  const reviews = generateMockCriticReviews(criticUsername)
  const blogPosts = generateMockBlogPosts(criticUsername)
  const recommendations = generateMockRecommendations(criticUsername)

  const pinnedContent: PinnedContent[] = [
    {
      id: 1,
      critic_id: 1,
      content_type: "review",
      content_id: reviews[0].id,
      position: 1,
      created_at: "2025-10-20T10:00:00Z",
      review: reviews[0],
    },
    {
      id: 2,
      critic_id: 1,
      content_type: "blog_post",
      content_id: blogPosts[0].id,
      position: 2,
      created_at: "2025-10-18T14:00:00Z",
      blog_post: blogPosts[0],
    },
    {
      id: 3,
      critic_id: 1,
      content_type: "recommendation",
      content_id: recommendations[0].id,
      position: 3,
      created_at: "2025-10-15T16:00:00Z",
      recommendation: recommendations[0],
    },
  ]

  return pinnedContent
}

