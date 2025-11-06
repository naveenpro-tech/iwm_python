"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, Send, X } from "lucide-react"
import { apiGet, apiPut, apiPost } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BlogPost {
  id: number
  title: string
  content: string
  excerpt?: string
  cover_image_url?: string
  tags: string[]
  status: "draft" | "published"
}

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await apiGet<BlogPost>(`/api/v1/critic-blog/${params.id}`)
        setPost(data)
      } catch (error) {
        console.error("Failed to fetch blog post:", error)
        toast({
          title: "Error",
          description: "Failed to load blog post",
          variant: "destructive",
        })
        router.push("/studio/blog")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPost()
    }
  }, [params.id, router, toast])

  const handleUpdate = async () => {
    if (!post || !post.title.trim() || !post.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      await apiPut(`/api/v1/critic-blog/${params.id}`, {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        cover_image_url: post.cover_image_url,
        tags: post.tags,
      })

      toast({
        title: "Success",
        description: "Blog post updated successfully",
      })

      router.push("/studio/blog")
    } catch (error: any) {
      console.error("Failed to update blog post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!post) return

    setSaving(true)
    try {
      await apiPost(`/api/v1/critic-blog/${params.id}/publish`, {})

      toast({
        title: "Success",
        description: "Blog post published successfully",
      })

      router.push("/studio/blog")
    } catch (error: any) {
      console.error("Failed to publish blog post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to publish blog post",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addTag = () => {
    if (!post) return
    const tag = tagInput.trim()
    if (tag && !post.tags.includes(tag) && post.tags.length < 10) {
      setPost({ ...post, tags: [...post.tags, tag] })
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    if (!post) return
    setPost({
      ...post,
      tags: post.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground mt-1">Update your blog post</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Post Details</CardTitle>
              <CardDescription>Update the details for your blog post</CardDescription>
            </div>
            <Badge variant={post.status === "published" ? "default" : "secondary"}>
              {post.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter post title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              maxLength={200}
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt (Optional)</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief summary"
              value={post.excerpt || ""}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              maxLength={500}
              rows={3}
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="cover_image">Cover Image URL (Optional)</Label>
            <Input
              id="cover_image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={post.cover_image_url || ""}
              onChange={(e) => setPost({ ...post, cover_image_url: e.target.value })}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Max 10)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" onClick={addTag} disabled={post.tags.length >= 10}>
                Add
              </Button>
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="mt-2">
                <Textarea
                  id="content"
                  value={post.content}
                  onChange={(e) => setPost({ ...post, content: e.target.value })}
                  rows={20}
                  className="font-mono"
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-2">
                <div className="border rounded-md p-4 min-h-[500px] prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{post.content}</div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleUpdate} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            {post.status === "draft" && (
              <Button onClick={handlePublish} disabled={saving}>
                <Send className="mr-2 h-4 w-4" />
                Publish Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

