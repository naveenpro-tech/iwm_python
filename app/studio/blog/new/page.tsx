"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, Send, X } from "lucide-react"
import { apiPost } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NewBlogPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    cover_image_url: "",
    tags: [] as string[],
  })
  const [tagInput, setTagInput] = useState("")

  const handleSubmit = async (status: "draft" | "published") => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        status,
      }

      const response = await apiPost("/api/v1/critic-blog", payload)

      toast({
        title: "Success",
        description: `Blog post ${status === "draft" ? "saved as draft" : "published"} successfully`,
      })

      router.push("/studio/blog")
    } catch (error: any) {
      console.error("Failed to create blog post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">New Blog Post</h1>
          <p className="text-muted-foreground mt-1">Create a new blog post</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
          <CardDescription>Fill in the details for your blog post</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter post title (3-200 characters)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">{formData.title.length}/200 characters</p>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt (Optional)</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief summary of your post (max 500 characters)"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{formData.excerpt.length}/500 characters</p>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="cover_image">Cover Image URL (Optional)</Label>
            <Input
              id="cover_image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.cover_image_url}
              onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Max 10)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" onClick={addTag} disabled={formData.tags.length >= 10}>
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <Label htmlFor="content">Content * (Markdown supported)</Label>
            <Tabs defaultValue="write" className="w-full">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="mt-2">
                <Textarea
                  id="content"
                  placeholder="Write your blog post content here... (Markdown supported)"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={20}
                  className="font-mono"
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-2">
                <div className="border rounded-md p-4 min-h-[500px] prose dark:prose-invert max-w-none">
                  {formData.content ? (
                    <div className="whitespace-pre-wrap">{formData.content}</div>
                  ) : (
                    <p className="text-muted-foreground">Nothing to preview yet...</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleSubmit("draft")}
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSubmit("published")}
              disabled={loading}
            >
              <Send className="mr-2 h-4 w-4" />
              Publish Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

