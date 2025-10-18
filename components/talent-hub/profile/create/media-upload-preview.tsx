"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, AlertCircle, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MediaFile {
  id: string
  file: File
  preview: string
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
}

interface MediaUploadPreviewProps {
  files: MediaFile[]
  onRemove: (id: string) => void
  onRetry: (id: string) => void
  maxFiles?: number
  acceptedTypes?: string[]
}

export function MediaUploadPreview({
  files,
  onRemove,
  onRetry,
  maxFiles = 10,
  acceptedTypes = ["image/*"],
}: MediaUploadPreviewProps) {
  return (
    <div className="space-y-4">
      {files.length > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#A0A0A0]">
            {files.length} of {maxFiles} files uploaded
          </span>
          {files.some((f) => f.status === "error") && (
            <span className="text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Some uploads failed
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {files.map((file) => (
            <motion.div
              key={file.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              <div
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden bg-[#282828] border-2",
                  file.status === "error"
                    ? "border-red-500"
                    : file.status === "success"
                      ? "border-green-500"
                      : "border-[#3A3A3A]",
                )}
              >
                {/* Preview Image */}
                <img
                  src={file.preview || "/placeholder.svg"}
                  alt={file.file.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay for uploading/error states */}
                {file.status !== "success" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    {file.status === "uploading" ? (
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-white mb-2 mx-auto" />
                        <span className="text-xs text-white">{file.progress}%</span>
                      </div>
                    ) : (
                      <div className="text-center p-2">
                        <AlertCircle className="w-8 h-8 text-red-500 mb-2 mx-auto" />
                        <p className="text-xs text-white">{file.error || "Upload failed"}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRetry(file.id)}
                          className="mt-2 h-6 text-xs"
                        >
                          Retry
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Success indicator */}
                {file.status === "success" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-green-500 rounded-full p-1"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => onRemove(file.id)}
                  className={cn(
                    "absolute top-2 left-2 p-1 bg-red-500 rounded-full",
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    "hover:bg-red-600",
                  )}
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Progress bar */}
                {file.status === "uploading" && (
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <Progress value={file.progress} className="h-1" />
                  </div>
                )}
              </div>

              {/* File name */}
              <p className="mt-1 text-xs text-[#A0A0A0] truncate">{file.file.name}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
