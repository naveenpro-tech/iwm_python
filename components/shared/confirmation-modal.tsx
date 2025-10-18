"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash, Power, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  variant?: "destructive" | "warning" | "primary" | "success"
  icon?: React.ReactNode
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "destructive",
  icon,
}: ConfirmationModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          icon: icon || <Trash className="h-6 w-6 text-destructive" />,
          confirmButtonVariant: "destructive" as const,
        }
      case "warning":
        return {
          icon: icon || <AlertTriangle className="h-6 w-6 text-yellow-500" />,
          confirmButtonVariant: "default" as const, // Or a specific warning variant if available
        }
      case "primary":
        return {
          icon: icon || <Power className="h-6 w-6 text-primary" />,
          confirmButtonVariant: "default" as const,
        }
      case "success":
        return {
          icon: icon || <CheckCircle className="h-6 w-6 text-green-500" />,
          confirmButtonVariant: "default" as const, // Or a specific success variant
        }
      default:
        return {
          icon: icon || <AlertTriangle className="h-6 w-6 text-muted-foreground" />,
          confirmButtonVariant: "default" as const,
        }
    }
  }

  const styles = getVariantStyles()

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0">{styles.icon}</div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
            </div>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button variant={styles.confirmButtonVariant} onClick={onConfirm} disabled={isLoading}>
              {isLoading ? "Processing..." : confirmText}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
