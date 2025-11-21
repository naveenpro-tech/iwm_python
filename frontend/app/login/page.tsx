"use client"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-md p-6">
        <LoginForm onSwitchToSignup={() => (window.location.href = "/signup")} />
      </div>
    </div>
  )
}

