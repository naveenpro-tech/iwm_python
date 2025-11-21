"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface TrailerModalProps {
    isOpen: boolean
    onClose: () => void
    videoUrl: string | null
    title: string
}

export function TrailerModal({ isOpen, onClose, videoUrl, title }: TrailerModalProps) {
    // Extract YouTube ID if possible, otherwise use the URL directly
    const getEmbedUrl = (url: string) => {
        if (!url) return ""

        // Handle standard YouTube URLs
        let videoId = ""
        if (url.includes("youtube.com/watch?v=")) {
            videoId = url.split("v=")[1].split("&")[0]
        } else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1].split("?")[0]
        } else if (url.includes("youtube.com/embed/")) {
            return url // Already an embed URL
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
        }

        return url
    }

    const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : ""

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[900px] p-0 bg-black border-[#282828] overflow-hidden aspect-video">
                <VisuallyHidden>
                    <DialogTitle>Trailer for {title}</DialogTitle>
                </VisuallyHidden>
                <div className="relative w-full h-full">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors"
                    >
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close</span>
                    </button>

                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={`Trailer for ${title}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#A0A0A0]">
                            <p>Trailer not available</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
