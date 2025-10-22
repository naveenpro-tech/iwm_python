"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type SignupFormProps = {
  onSwitchToLogin: () => void
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    const name = (document.getElementById("signup-name") as HTMLInputElement)?.value
    const email = (document.getElementById("signup-email") as HTMLInputElement)?.value
    const password = (document.getElementById("signup-password") as HTMLInputElement)?.value
    const confirm = (document.getElementById("confirm-password") as HTMLInputElement)?.value

    // Validation
    if (!name || name.trim().length < 2) {
      setErrors({ name: "Name must be at least 2 characters" })
      setIsLoading(false)
      return
    }
    if (password !== confirm) {
      setErrors({ confirmPassword: "Passwords do not match" })
      setIsLoading(false)
      return
    }
    if (password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" })
      setIsLoading(false)
      return
    }

    try {
      const { signup } = await import("@/lib/auth")
      await signup(email, password, name.trim())
      window.location.href = "/dashboard"
    } catch (err: any) {
      const errorMessage = err?.message || "Could not sign up. Try a different email."
      if (errorMessage.includes("already registered")) {
        setErrors({ email: "Email already registered. Please login instead." })
      } else {
        setErrors({ email: errorMessage })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name" className="text-[#E0E0E0] font-dmsans">
          Name
        </Label>
        <Input
          id="signup-name"
          type="text"
          placeholder="Enter your full name"
          className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0] font-dmsans focus:border-[#00BFFF] focus:ring-[#00BFFF]"
          required
        />
        {errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#FF4500] text-sm font-dmsans"
          >
            {errors.name}
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-[#E0E0E0] font-dmsans">
          Email
        </Label>
        <Input
          id="signup-email"
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
        <Label htmlFor="signup-password" className="text-[#E0E0E0] font-dmsans">
          Password
        </Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Create a password"
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

      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-[#E0E0E0] font-dmsans">
          Confirm Password
        </Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm your password"
          className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0] font-dmsans focus:border-[#00BFFF] focus:ring-[#00BFFF]"
          required
        />
        {errors.confirmPassword && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#FF4500] text-sm font-dmsans"
          >
            {errors.confirmPassword}
          </motion.p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] font-inter"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign Up"}
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
          Already have an account?{" "}
          <button type="button" onClick={onSwitchToLogin} className="text-[#00BFFF] hover:underline font-dmsans">
            Login
          </button>
        </p>
      </div>
    </form>
  )
}
