"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#282828] border-none p-0 max-w-md w-full mx-auto overflow-hidden">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="p-6">
            <div className="flex justify-center mb-6">
              <h2 className="text-2xl font-bold font-inter text-[#E0E0E0]">Welcome to Siddu</h2>
            </div>

            <div className="flex mb-6 border-b border-[#3A3A3A]">
              <button
                className={`flex-1 pb-3 font-inter text-base font-medium relative ${
                  activeTab === "login" ? "text-[#E0E0E0]" : "text-[#A0A0A0]"
                }`}
                onClick={() => setActiveTab("login")}
              >
                Login
                {activeTab === "login" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00BFFF]"
                    layoutId="activeTab"
                    initial={false}
                  />
                )}
              </button>
              <button
                className={`flex-1 pb-3 font-inter text-base font-medium relative ${
                  activeTab === "signup" ? "text-[#E0E0E0]" : "text-[#A0A0A0]"
                }`}
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
                {activeTab === "signup" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00BFFF]"
                    layoutId="activeTab"
                    initial={false}
                  />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "login" ? (
                  <LoginForm onSwitchToSignup={() => setActiveTab("signup")} />
                ) : (
                  <SignupForm onSwitchToLogin={() => setActiveTab("login")} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
