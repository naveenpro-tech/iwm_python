"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { StudioSidebar } from "@/components/studio/studio-sidebar"
import { StudioHeader } from "@/components/studio/studio-header"
import { ThemeProvider } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import { apiGet } from "@/lib/api-client"

/**
 * Studio Layout
 * Protected layout for critic content management
 * Verifies user has critic role before allowing access
 */
export default function StudioLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    async function verifyCriticAccess() {
      try {
        // Verify user has critic profile by attempting to fetch it
        // This endpoint returns 403 if user is not a critic
        await apiGet("/api/v1/critics/me")
        setIsAuthorized(true)
      } catch (error) {
        console.error("Critic access verification failed:", error)
        toast({
          title: "Access Denied",
          description: "You need a critic profile to access the Studio. Please apply for verification first.",
          variant: "destructive",
        })
        // Redirect to home or critic application page
        router.push("/")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyCriticAccess()
  }, [router, toast])

  if (isVerifying) {
    return (
      <ThemeProvider>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verifying access...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  if (!isAuthorized) {
    return null // Will redirect
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <StudioSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <StudioHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}

