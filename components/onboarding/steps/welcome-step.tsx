"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface WelcomeStepProps {
  onNext: () => void
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <div className="mb-6 relative h-40 w-40 mx-auto">
        <Image
          src="/placeholder.svg?height=160&width=160&query=Siddu logo animation"
          alt="Siddu Logo"
          fill
          className="object-contain"
        />
      </div>

      <h2 className="text-3xl font-bold text-white mb-4">Welcome to Siddu!</h2>

      <p className="text-[#E0E0E0] mb-8 max-w-md mx-auto">
        Your ultimate destination for celebrating cinematic masterpieces and getting real-time cricket updates. Let's
        set up your experience in just a few steps.
      </p>

      <div className="flex justify-center">
        <Button onClick={onNext} className="bg-[#00BFFF] hover:bg-[#00A0E0] text-white px-8 py-2 rounded-md">
          Let's Get Started
        </Button>
      </div>
    </motion.div>
  )
}
