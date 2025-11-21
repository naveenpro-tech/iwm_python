"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { updateCollection } from "@/lib/api/collections"
import { useToast } from "@/hooks/use-toast"

interface EditCollectionModalProps {
    isOpen: boolean
    onClose: () => void
    collection: any
    onUpdate: (updatedCollection: any) => void
}

export function EditCollectionModal({ isOpen, onClose, collection, onUpdate }: EditCollectionModalProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isPublic, setIsPublic] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    // Pre-populate form when collection changes
    useEffect(() => {
        if (collection) {
            setTitle(collection.title || "")
            setDescription(collection.description || "")
            setIsPublic(collection.isPublic ?? true)
        }
    }, [collection])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!collection?.id) {
            toast({
                title: "Error",
                description: "No collection selected",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            const updated = await updateCollection(collection.id, {
                title,
                description,
                isPublic,
            })

            toast({
                title: "Success",
                description: "Collection updated successfully!",
            })
            onUpdate(updated)
            onClose()
        } catch (error: any) {
            console.error("Failed to update collection:", error)
            toast({
                title: "Error",
                description: error.message || "Failed to update collection",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative bg-[#1E1E1E] rounded-lg border border-[#333333] w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-[#333333]">
                            <h2 className="text-xl font-bold text-white">Edit Collection</h2>
                            <Button variant="ghost" size="icon" onClick={onClose} className="text-[#A0A0A0] hover:text-white">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title" className="text-white">
                                    Collection Title
                                </Label>
                                <Input
                                    id="edit-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter collection title..."
                                    className="bg-[#2A2A2A] border-[#444444] text-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-description" className="text-white">
                                    Description
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your collection..."
                                    className="bg-[#2A2A2A] border-[#444444] text-white min-h-[100px]"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-white">Public Collection</Label>
                                    <p className="text-sm text-[#A0A0A0]">Allow others to discover and follow this collection</p>
                                </div>
                                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-[#333333]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="border-[#444444] text-[#A0A0A0]"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#6e4bbd] hover:bg-[#5d3ba9] text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
