"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

/**
 * Redirect page for /profile route
 * Redirects authenticated users to their profile page: /profile/[username]
 * Redirects unauthenticated users to login page
 */
export default function ProfileRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    const redirectToUserProfile = async () => {
      try {
        // Check if user is authenticated
        const { isAuthenticated, me } = await import("@/lib/auth")

        if (!isAuthenticated()) {
          // Not authenticated - redirect to login
          router.push("/login")
          return
        }

        // Fetch user data to get username
        try {
          const user = await me()
          // Extract username from email (before @) or use user.username if available
          const username = user.username || user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9-]/g, '-')
          router.push(`/profile/${username}`)
        } catch (error) {
          console.error("Failed to fetch user data:", error)
          // Fallback to login if user data fetch fails
          router.push("/login")
        }
      } catch (error) {
        console.error("Redirect error:", error)
        router.push("/login")
      }
    }

    redirectToUserProfile()
  }, [router])

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-[#00BFFF] animate-spin" />
        <p className="text-[#E0E0E0] font-dm-sans text-lg">Redirecting to your profile...</p>
      </div>
    </div>
  )
}
