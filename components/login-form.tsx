"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type LoginFormProps = {
  onSwitchToSignup: () => void
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    const email = (document.getElementById("email") as HTMLInputElement)?.value
    const password = (document.getElementById("password") as HTMLInputElement)?.value
    try {
      const { login, me } = await import("@/lib/auth")
      await login(email, password)

      // Fetch user data to get username for profile redirect
      try {
        const user = await me()
        // Extract username from email (before @) or use user.name as fallback
        const username = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9-]/g, '-')
        window.location.href = `/profile/${username}`
      } catch {
        // Fallback to dashboard if user data fetch fails
        window.location.href = "/dashboard"
      }
    } catch (err) {
      setErrors({ email: "Invalid email or password" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#E0E0E0] font-dmsans">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0] font-dmsans focus:border-[#00BFFF] focus:ring-[#00BFFF]"
          required
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#FF4500] text-sm font-dmsans"
          >
            {errors.email}
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password" className="text-[#E0E0E0] font-dmsans">
            Password
          </Label>
          <button type="button" className="text-[#00BFFF] text-sm font-dmsans hover:underline">
            Forgot Password?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0] font-dmsans focus:border-[#00BFFF] focus:ring-[#00BFFF]"
          required
        />
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#FF4500] text-sm font-dmsans"
          >
            {errors.password}
          </motion.p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] font-inter"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      <div className="relative my-6">
        <Separator className="bg-[#3A3A3A]" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#282828] px-2 text-[#A0A0A0] text-sm font-dmsans">
          OR
        </span>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A] font-dmsans"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A] font-dmsans"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              fill="#1877F2"
            />
            <path
              d="M15.893 14.89l.443-2.89h-2.773v-1.876c0-.79.387-1.562 1.63-1.562h1.26v-2.46s-1.144-.195-2.238-.195c-2.285 0-3.777 1.384-3.777 3.89V12h-2.54v2.89h2.54v6.988a10.06 10.06 0 003.124 0v-6.988h2.33z"
              fill="white"
            />
          </svg>
          Continue with Facebook
        </Button>
      </div>

      <div className="text-center mt-4">
        <p className="text-[#A0A0A0] font-dmsans">
          Don't have an account?{" "}
          <button type="button" onClick={onSwitchToSignup} className="text-[#00BFFF] hover:underline font-dmsans">
            Sign up
          </button>
        </p>
      </div>
    </form>
  )
}
