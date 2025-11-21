"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, X, ExternalLink, AlertCircle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import {
  type StreamingPlatformLink,
  STREAMING_PROVIDERS,
  STREAMING_REGIONS,
  STREAMING_TYPES,
  STREAMING_QUALITIES,
} from "../types"

interface MovieStreamingFormProps {
  initialLinks: StreamingPlatformLink[]
  onStreamingLinksChange: (newLinks: StreamingPlatformLink[]) => void
  onChanges: () => void
}

export function MovieStreamingForm({ initialLinks, onStreamingLinksChange, onChanges }: MovieStreamingFormProps) {
  const [streamingLinks, setStreamingLinks] = useState<StreamingPlatformLink[]>(initialLinks)

  useEffect(() => {
    setStreamingLinks(initialLinks)
  }, [initialLinks])

  const [showAddLink, setShowAddLink] = useState(false)
  const [newLink, setNewLink] = useState<Partial<StreamingPlatformLink>>({
    provider: "",
    region: "US",
    url: "",
    type: "subscription",
    quality: "HD",
  })

  const providers = STREAMING_PROVIDERS

  const regions = STREAMING_REGIONS

  const addStreamingLink = () => {
    if (newLink.provider && newLink.url) {
      const newStreamingLink = {
        ...(newLink as StreamingPlatformLink),
        id: Date.now().toString(),
        verified: false,
      }
      const updatedLinks = [...streamingLinks, newStreamingLink]
      setStreamingLinks(updatedLinks)
      onStreamingLinksChange(updatedLinks)
      setNewLink({
        provider: "",
        region: "US",
        url: "",
        type: "subscription",
        quality: "HD",
      })
      setShowAddLink(false)
      onChanges()
    }
  }

  const removeStreamingLink = (id: string) => {
    const updatedLinks = streamingLinks.filter((link) => link.id !== id)
    setStreamingLinks(updatedLinks)
    onStreamingLinksChange(updatedLinks)
    onChanges()
  }

  const verifyLink = (id: string) => {
    const updatedLinks = streamingLinks.map((link) => (link.id === id ? { ...link, verified: true } : link))
    setStreamingLinks(updatedLinks)
    onStreamingLinksChange(updatedLinks)
    onChanges()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Streaming Availability</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Manage where this movie is available to watch online</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAddLink(!showAddLink)}>
            <Plus size={16} className="mr-1" />
            Add Streaming Link
          </Button>
        </CardHeader>
        <CardContent>
          {showAddLink && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 border rounded-lg space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Streaming Provider</Label>
                  <Select
                    value={newLink.provider}
                    onValueChange={(value) => setNewLink({ ...newLink, provider: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select value={newLink.region} onValueChange={(value) => setNewLink({ ...newLink, region: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.code} value={region.code}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Streaming URL</Label>
                <Input
                  placeholder="https://..."
                  value={newLink.url || ""}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={newLink.type}
                    onValueChange={(value: "rent" | "buy" | "subscription") => setNewLink({ ...newLink, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STREAMING_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quality</Label>
                  <Select
                    value={newLink.quality}
                    onValueChange={(value: "SD" | "HD" | "4K") => setNewLink({ ...newLink, quality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STREAMING_QUALITIES.map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {quality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(newLink.type === "rent" || newLink.type === "buy") && (
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      placeholder="$3.99"
                      value={newLink.price || ""}
                      onChange={(e) => setNewLink({ ...newLink, price: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddLink(false)
                    setNewLink({
                      provider: "",
                      region: "US",
                      url: "",
                      type: "subscription",
                      quality: "HD",
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={addStreamingLink}>
                  Add Link
                </Button>
              </div>
            </motion.div>
          )}

          <div className="space-y-3">
            {streamingLinks.map((link) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{link.provider}</span>
                    <Badge variant="outline" className="text-xs">
                      {link.region}
                    </Badge>
                    <Badge variant={link.type === "subscription" ? "default" : "secondary"} className="text-xs">
                      {link.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {link.quality}
                    </Badge>
                    {link.price && (
                      <Badge variant="outline" className="text-xs">
                        {link.price}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      {link.url}
                      <ExternalLink size={12} />
                    </a>
                    {link.verified ? (
                      <Badge variant="outline" className="text-xs text-green-500 border-green-500/50">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500/50">
                        <AlertCircle size={12} className="mr-1" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!link.verified && (
                    <Button variant="outline" size="sm" onClick={() => verifyLink(link.id)}>
                      Verify
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => removeStreamingLink(link.id)}>
                    <X size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regional Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="geo-blocking">Geo-blocking</Label>
              <p className="text-sm text-muted-foreground">Enable region-specific availability</p>
            </div>
            <Switch id="geo-blocking" onCheckedChange={onChanges} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-verify">Auto-verify Links</Label>
              <p className="text-sm text-muted-foreground">Automatically check link validity daily</p>
            </div>
            <Switch id="auto-verify" defaultChecked onCheckedChange={onChanges} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
