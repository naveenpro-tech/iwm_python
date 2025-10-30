/**
 * useAdminRole Hook
 * Check if current user has admin role
 */

import { useState, useEffect } from "react"
import { hasAdminRole as checkAdminRole } from "@/lib/auth"

export function useAdminRole() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check admin role on mount and when token changes
    const checkRole = () => {
      try {
        const adminRole = checkAdminRole()
        setIsAdmin(adminRole)
      } catch (error) {
        console.error("Error checking admin role:", error)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkRole()

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token") {
        checkRole()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return { isAdmin, isLoading }
}

