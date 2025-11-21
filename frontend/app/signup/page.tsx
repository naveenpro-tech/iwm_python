"use client"

import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-md p-6">
        <SignupForm onSwitchToLogin={() => (window.location.href = "/login")} />
      </div>
    </div>
  )
}

