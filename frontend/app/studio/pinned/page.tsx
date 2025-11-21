"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { apiGet, apiPost, apiDelete, apiPut } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PinnedContent {
  id: number
  external_id: string
  content_type: string
  content_id: number
  content_title: string
  display_order: number
  pinned_at: string
}

export default function PinnedContentPage() {
  const [pinnedItems, setPinnedItems] = useState<PinnedContent[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [contentType, setContentType] = useState("")
  const [availableContent, setAvailableContent] = useState<any[]>([])
  const [selectedContentId, setSelectedContentId] = useState<number>(0)
  const { toast } = useToast()

  useEffect(() => {
    fetchPinnedContent()
  }, [])

  async function fetchPinnedContent() {
    try {
      const data = await apiGet<{ items: PinnedContent[] }>("/api/v1/critic-pinned/critic/me")
      setPinnedItems(data.items || [])
    } catch (error) {
      console.error("Failed to fetch pinned content:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchAvailableContent(type: string) {
    try {
      let endpoint = ""
      if (type === "review") endpoint = "/api/v1/critic-reviews/me"
      else if (type === "blog_post") endpoint = "/api/v1/critic-blog/critic/me"
      else if (type === "recommendation") endpoint = "/api/v1/critic-recommendations/critic/me"

      const data = await apiGet<{ items: any[] }>(endpoint)
      setAvailableContent(data.items || [])
    } catch (error) {
      console.error("Failed to fetch available content:", error)
    }
  }

  async function handlePin() {
    if (!contentType || !selectedContentId) {
      toast({
        title: "Validation Error",
        description: "Please select content type and item",
        variant: "destructive",
      })
      return
    }

    if (pinnedItems.length >= 5) {
      toast({
        title: "Limit Reached",
        description: "You can only pin up to 5 items",
        variant: "destructive",
      })
      return
    }

    try {
      await apiPost("/api/v1/critic-pinned", {
        content_type: contentType,
        content_id: selectedContentId,
      })

      toast({
        title: "Success",
        description: "Content pinned successfully",
      })

      setShowDialog(false)
      setContentType("")
      setSelectedContentId(0)
      setAvailableContent([])
      fetchPinnedContent()
    } catch (error: any) {
      console.error("Failed to pin content:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to pin content",
        variant: "destructive",
      })
    }
  }

  async function handleUnpin(id: number) {
    try {
      await apiDelete(`/api/v1/critic-pinned/${id}`)
      setPinnedItems(pinnedItems.filter((item) => item.id !== id))
      toast({
        title: "Success",
        description: "Content unpinned successfully",
      })
    } catch (error) {
      console.error("Failed to unpin content:", error)
      toast({
        title: "Error",
        description: "Failed to unpin content",
        variant: "destructive",
      })
    }
  }

  async function handleReorder(items: PinnedContent[]) {
    try {
      const reorderData = items.map((item, index) => ({
        pin_id: item.id,
        display_order: index + 1,
      }))

      await apiPut("/api/v1/critic-pinned/reorder", { items: reorderData })

      toast({
        title: "Success",
        description: "Order updated successfully",
      })
    } catch (error) {
      console.error("Failed to reorder:", error)
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      })
    }
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...pinnedItems]
    ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
    setPinnedItems(newItems)
    handleReorder(newItems)
  }

  const moveDown = (index: number) => {
    if (index === pinnedItems.length - 1) return
    const newItems = [...pinnedItems]
    ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
    setPinnedItems(newItems)
    handleReorder(newItems)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pinned Content</h1>
          <p className="text-muted-foreground mt-1">
            Pin up to 5 items to showcase on your profile ({pinnedItems.length}/5)
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)} disabled={pinnedItems.length >= 5}>
          <Plus className="mr-2 h-4 w-4" />
          Pin Content
        </Button>
      </div>

      {/* Pinned Items */}
      {pinnedItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No pinned content yet</p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Pin Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pinnedItems.map((item, index) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDown(index)}
                      disabled={index === pinnedItems.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{item.content_title}</CardTitle>
                      <Badge variant="outline">
                        {item.content_type.replace("_", " ")}
                      </Badge>
                      <Badge variant="secondary">#{item.display_order}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnpin(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Pin Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pin Content</DialogTitle>
            <DialogDescription>Select content to pin to your profile</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select
                value={contentType}
                onValueChange={(value) => {
                  setContentType(value)
                  setSelectedContentId(0)
                  fetchAvailableContent(value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="blog_post">Blog Post</SelectItem>
                  <SelectItem value="recommendation">Recommendation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {contentType && (
              <div className="space-y-2">
                <Label>Select Item</Label>
                <Select
                  value={selectedContentId.toString()}
                  onValueChange={(value) => setSelectedContentId(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableContent.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.title || item.movie_title || "Untitled"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePin}>Pin Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

