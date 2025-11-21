"use client"

import { AuthModal } from "@/components/auth-modal"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-md p-6">
        <AuthModal defaultTab="login" />
      </div>
    </div>
  )
}

