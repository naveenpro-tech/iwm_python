"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"

interface DeleteCollectionDialogProps {
  collectionId: string
  collectionTitle: string
  onClose: () => void
  onConfirm: () => void
}

export function DeleteCollectionDialog({
  collectionId,
  collectionTitle,
  onClose,
  onConfirm,
}: DeleteCollectionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      onConfirm()
    } catch (error) {
      console.error("Failed to delete collection:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-[#282828] border border-[#3A3A3A] rounded-lg w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#3A3A3A]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#EF4444]/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
              </div>
              <h2 className="text-xl font-inter font-bold text-[#E0E0E0]">
                Delete Collection
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-[#3A3A3A] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFFF]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-[#E0E0E0] font-dm-sans">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#00BFFF]">"{collectionTitle}"</span>?
            </p>
            <p className="text-[#A0A0A0] font-dm-sans text-sm">
              This action cannot be undone. The collection and all its contents will be permanently
              removed.
            </p>

            {/* Warning Box */}
            <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
              <p className="text-[#EF4444] font-dm-sans text-sm font-medium">
                ⚠️ This is a permanent action
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#3A3A3A]">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-2.5 border border-[#3A3A3A] text-[#E0E0E0] font-dm-sans font-medium rounded-lg hover:bg-[#3A3A3A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFFF] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6 py-2.5 bg-[#EF4444] text-white font-dm-sans font-medium rounded-lg hover:bg-[#EF4444]/90 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:ring-offset-2 focus:ring-offset-[#282828] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isDeleting ? "Deleting..." : "Delete Collection"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

