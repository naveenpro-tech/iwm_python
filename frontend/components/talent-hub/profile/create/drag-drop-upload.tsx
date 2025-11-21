"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, ImageIcon, FileIcon, Film } from "lucide-react"
import { cn } from "@/lib/utils"

interface DragDropUploadProps {
  onFilesSelected: (files: File[]) => void
  acceptedTypes?: string[]
  maxFiles?: number
  maxSize?: number // in MB
  className?: string
  children?: React.ReactNode
}

export function DragDropUpload({
  onFilesSelected,
  acceptedTypes = ["image/*"],
  maxFiles = 10,
  maxSize = 10,
  className,
  children,
}: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragOut = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragCounter((prev) => prev - 1)
      if (dragCounter === 1) {
        setIsDragging(false)
      }
    },
    [dragCounter],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      setDragCounter(0)

      const files = Array.from(e.dataTransfer.files)
      const validFiles = files.filter((file) => {
        // Check file type
        const isValidType = acceptedTypes.some((type) => {
          if (type.endsWith("/*")) {
            return file.type.startsWith(type.replace("/*", ""))
          }
          return file.type === type
        })

        // Check file size
        const isValidSize = file.size <= maxSize * 1024 * 1024

        return isValidType && isValidSize
      })

      if (validFiles.length > 0) {
        onFilesSelected(validFiles.slice(0, maxFiles))
      }
    },
    [acceptedTypes, maxFiles, maxSize, onFilesSelected],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        onFilesSelected(files.slice(0, maxFiles))
      }
    },
    [maxFiles, onFilesSelected],
  )

  const getIcon = () => {
    if (acceptedTypes.includes("video/*")) return Film
    if (acceptedTypes.includes("image/*")) return ImageIcon
    return FileIcon
  }

  const Icon = getIcon()

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-lg border-2 border-dashed transition-all duration-200",
        isDragging ? "border-[#00BFFF] bg-[#00BFFF]/10 scale-[1.02]" : "border-[#3A3A3A] hover:border-[#00BFFF]",
        className,
      )}
    >
      <input
        type="file"
        multiple={maxFiles > 1}
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />

      {children || (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            animate={{
              scale: isDragging ? 1.1 : 1,
              rotate: isDragging ? 5 : 0,
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="w-12 h-12 text-gray-400 mb-4" />
          </motion.div>

          <p className="text-sm font-medium text-gray-300 mb-1">
            {isDragging ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-gray-500 mb-4">or click to browse</p>

          <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-500">
            <span>Max {maxFiles} files</span>
            <span>•</span>
            <span>Up to {maxSize}MB each</span>
          </div>
        </div>
      )}

      {/* Visual feedback overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#00BFFF]/20 rounded-lg pointer-events-none"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Upload className="w-16 h-16 text-[#00BFFF] animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
