"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ExternalLink, TrendingUp } from "lucide-react"
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface AffiliateLink {
  id: number
  external_id: string
  label: string
  platform: string
  url: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  click_count: number
  conversion_count: number
  is_active: boolean
  created_at: string
}

const PLATFORMS = [
  "Amazon", "Apple", "Google Play", "Netflix", "Disney+", "HBO Max",
  "Paramount+", "Peacock", "Hulu", "Prime Video", "YouTube", "Vudu", "Other"
]

export default function AffiliateLinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingLink, setEditingLink] = useState<AffiliateLink | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    platform: "",
    url: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    is_active: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchLinks()
  }, [])

  async function fetchLinks() {
    try {
      const data = await apiGet<{ items: AffiliateLink[] }>("/api/v1/critic-affiliate/critic/me")
      setLinks(data.items || [])
    } catch (error) {
      console.error("Failed to fetch affiliate links:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    if (!formData.label.trim() || !formData.platform || !formData.url.trim()) {
      toast({
        title: "Validation Error",
        description: "Label, platform, and URL are required",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingLink) {
        await apiPut(`/api/v1/critic-affiliate/${editingLink.id}`, formData)
        toast({ title: "Success", description: "Affiliate link updated successfully" })
      } else {
        await apiPost("/api/v1/critic-affiliate", formData)
        toast({ title: "Success", description: "Affiliate link created successfully" })
      }

      setShowDialog(false)
      setEditingLink(null)
      setFormData({
        label: "",
        platform: "",
        url: "",
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        is_active: true,
      })
      fetchLinks()
    } catch (error: any) {
      console.error("Failed to save affiliate link:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save affiliate link",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(id: number) {
    try {
      await apiDelete(`/api/v1/critic-affiliate/${id}`)
      setLinks(links.filter((l) => l.id !== id))
      toast({ title: "Success", description: "Affiliate link deleted successfully" })
    } catch (error) {
      console.error("Failed to delete affiliate link:", error)
      toast({
        title: "Error",
        description: "Failed to delete affiliate link",
        variant: "destructive",
      })
    }
  }

  function openEditDialog(link: AffiliateLink) {
    setEditingLink(link)
    setFormData({
      label: link.label,
      platform: link.platform,
      url: link.url,
      utm_source: link.utm_source || "",
      utm_medium: link.utm_medium || "",
      utm_campaign: link.utm_campaign || "",
      is_active: link.is_active,
    })
    setShowDialog(true)
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
          <h1 className="text-3xl font-bold">Affiliate Links</h1>
          <p className="text-muted-foreground mt-1">Manage your affiliate links and track performance</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>

      {/* Links List */}
      {links.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No affiliate links yet</p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {links.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{link.label}</CardTitle>
                      <Badge variant="outline">{link.platform}</Badge>
                      <Badge variant={link.is_active ? "default" : "secondary"}>
                        {link.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate max-w-md">{link.url}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>{link.click_count} clicks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Conversions:</span>
                      <span className="font-medium">{link.conversion_count}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(link)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(link.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open)
        if (!open) {
          setEditingLink(null)
          setFormData({
            label: "",
            platform: "",
            url: "",
            utm_source: "",
            utm_medium: "",
            utm_campaign: "",
            is_active: true,
          })
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingLink ? "Edit" : "Add"} Affiliate Link</DialogTitle>
            <DialogDescription>
              {editingLink ? "Update" : "Create"} an affiliate link with tracking parameters
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Label *</Label>
                <Input
                  placeholder="e.g., Watch on Amazon"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Platform *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>URL *</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>UTM Source</Label>
                <Input
                  placeholder="e.g., critic-profile"
                  value={formData.utm_source}
                  onChange={(e) => setFormData({ ...formData, utm_source: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>UTM Medium</Label>
                <Input
                  placeholder="e.g., affiliate"
                  value={formData.utm_medium}
                  onChange={(e) => setFormData({ ...formData, utm_medium: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>UTM Campaign</Label>
                <Input
                  placeholder="e.g., movie-rec"
                  value={formData.utm_campaign}
                  onChange={(e) => setFormData({ ...formData, utm_campaign: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label>Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingLink ? "Update" : "Create"} Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

