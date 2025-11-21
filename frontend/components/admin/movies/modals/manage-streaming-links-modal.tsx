"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { StreamingPlatformLink } from "@/components/admin/movies/types"
import {
  STREAMING_PROVIDERS,
  STREAMING_REGIONS,
  STREAMING_TYPES,
  STREAMING_QUALITIES,
} from "@/components/admin/movies/types"
import { useToast } from "@/hooks/use-toast"

interface ManageStreamingLinksModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: string
  initialLinks: StreamingPlatformLink[]
  onSave: (movieId: string, updatedLinks: StreamingPlatformLink[]) => Promise<void>
}

const emptyLink: Omit<StreamingPlatformLink, "id"> = {
  provider: STREAMING_PROVIDERS[0] || "",
  region: STREAMING_REGIONS[0]?.code || "US",
  url: "",
  type: "subscription",
  quality: "HD",
  verified: false,
  price: "",
}

export function ManageStreamingLinksModal({
  isOpen,
  onClose,
  movieId,
  initialLinks,
  onSave,
}: ManageStreamingLinksModalProps) {
  const [links, setLinks] = useState<StreamingPlatformLink[]>([])
  const [editingLink, setEditingLink] = useState<(Partial<StreamingPlatformLink> & { tempId?: string }) | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      // Deep copy initialLinks to prevent direct mutation
      setLinks(JSON.parse(JSON.stringify(initialLinks)))
      setEditingLink(null)
      setIsAdding(false)
    }
  }, [isOpen, initialLinks])

  const handleInputChange = (field: keyof StreamingPlatformLink, value: any) => {
    if (editingLink) {
      setEditingLink({ ...editingLink, [field]: value })
    }
  }

  const handleSaveLink = () => {
    if (!editingLink || !editingLink.provider || !editingLink.url) {
      toast({ title: "Error", description: "Provider and URL are required.", variant: "destructive" })
      return
    }

    const finalLink: StreamingPlatformLink = {
      id: editingLink.id || editingLink.tempId || Date.now().toString(),
      provider: editingLink.provider!,
      region: editingLink.region!,
      url: editingLink.url!,
      type: editingLink.type!,
      quality: editingLink.quality!,
      verified: editingLink.verified || false,
      price: editingLink.type === "subscription" ? undefined : editingLink.price,
    }

    let newLinksList
    if (editingLink.id && !isAdding) {
      // Editing existing
      newLinksList = links.map((l) => (l.id === editingLink!.id ? finalLink : l))
    } else {
      // Adding new
      newLinksList = [...links, finalLink]
    }
    setLinks(newLinksList)
    setEditingLink(null)
    setIsAdding(false)
  }

  const handleDeleteLink = (idToDelete: string) => {
    setLinks(links.filter((l) => l.id !== idToDelete))
  }

  const startEdit = (link: StreamingPlatformLink) => {
    setEditingLink({ ...link })
    setIsAdding(false)
  }

  const startAdd = () => {
    setEditingLink({ ...emptyLink, tempId: Date.now().toString() }) // Use tempId for new unsaved items
    setIsAdding(true)
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      await onSave(movieId, links)
      toast({ title: "Success", description: "Streaming links updated." })
      onClose()
    } catch (error) {
      toast({ title: "Error", description: "Failed to save links.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const renderLinkForm = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 border rounded-lg space-y-4 mb-4 bg-muted/30"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="link-provider">Provider</Label>
          <Select value={editingLink?.provider} onValueChange={(val) => handleInputChange("provider", val)}>
            <SelectTrigger id="link-provider">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STREAMING_PROVIDERS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="link-region">Region</Label>
          <Select value={editingLink?.region} onValueChange={(val) => handleInputChange("region", val)}>
            <SelectTrigger id="link-region">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STREAMING_REGIONS.map((r) => (
                <SelectItem key={r.code} value={r.code}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="link-url">URL</Label>
        <Input
          id="link-url"
          value={editingLink?.url || ""}
          onChange={(e) => handleInputChange("url", e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="link-type">Type</Label>
          <Select
            value={editingLink?.type}
            onValueChange={(val: StreamingPlatformLink["type"]) => handleInputChange("type", val)}
          >
            <SelectTrigger id="link-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STREAMING_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="link-quality">Quality</Label>
          <Select
            value={editingLink?.quality}
            onValueChange={(val: StreamingPlatformLink["quality"]) => handleInputChange("quality", val)}
          >
            <SelectTrigger id="link-quality">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STREAMING_QUALITIES.map((q) => (
                <SelectItem key={q} value={q}>
                  {q}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {editingLink?.type !== "subscription" && (
          <div className="space-y-1">
            <Label htmlFor="link-price">Price (optional)</Label>
            <Input
              id="link-price"
              value={editingLink?.price || ""}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="$3.99"
            />
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="link-verified"
          checked={editingLink?.verified}
          onCheckedChange={(val) => handleInputChange("verified", val)}
        />
        <Label htmlFor="link-verified">Verified Link</Label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="ghost"
          onClick={() => {
            setEditingLink(null)
            setIsAdding(false)
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSaveLink}>Save Link Entry</Button>
      </div>
    </motion.div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Streaming Links</DialogTitle>
          <DialogDescription>Add, edit, or remove streaming availability for this movie.</DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh]">
          <ScrollArea className="h-full pr-3">
            <div className="space-y-3">
              <AnimatePresence>
                {(isAdding || editingLink) && !isAdding && editingLink && renderLinkForm()}
              </AnimatePresence>

              {links.map((link) => (
                <motion.div
                  key={link.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 border rounded-md bg-card flex items-start justify-between gap-2"
                >
                  {editingLink?.id === link.id && !isAdding ? (
                    renderLinkForm()
                  ) : (
                    <>
                      <div className="flex-grow space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{link.provider}</span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-sm">
                            {link.region}
                          </span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-sm">
                            {link.type}
                          </span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-sm">
                            {link.quality}
                          </span>
                          {link.price && (
                            <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-sm">
                              {link.price}
                            </span>
                          )}
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 truncate max-w-md"
                        >
                          {link.url} <ExternalLink size={12} />
                        </a>
                        <div
                          className={`text-xs flex items-center gap-1 mt-1 ${link.verified ? "text-green-600" : "text-yellow-600"}`}
                        >
                          {link.verified ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                          {link.verified ? "Verified" : "Unverified"}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex flex-col gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(link)}>
                          <Plus size={14} className="transform rotate-45" /> {/* Edit icon replacement */}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDeleteLink(link.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
              <AnimatePresence>{isAdding && editingLink && renderLinkForm()}</AnimatePresence>
            </div>

            {!editingLink && !isAdding && (
              <Button variant="outline" onClick={startAdd} className="mt-4 w-full gap-2">
                <Plus size={16} /> Add New Streaming Link
              </Button>
            )}
          </ScrollArea>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSaveChanges} disabled={isSaving || !!editingLink}>
            {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
