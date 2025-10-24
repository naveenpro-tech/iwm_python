"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CriticLandingPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to critics directory page
    router.push("/critics")
  }, [router])

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
      <p className="text-[#A0A0A0]">Redirecting to Critics Directory...</p>
    </div>
  )
}

