"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LogoIcon } from "./logo-icon"

interface IntroSequenceProps {
  onComplete: () => void
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 2000),
      setTimeout(() => setStep(2), 4000),
      setTimeout(() => setStep(3), 6000),
      setTimeout(() => onComplete(), 8000),
    ]

    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [onComplete])

  const phrases = ["Where Cinema Comes Alive", "Where Cricket Pulses with Passion", "Where Entertainment Unites"]

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#1A1A1A]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-12"
      >
        <LogoIcon size={120} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-4xl md:text-6xl font-bold text-center mb-8 font-inter"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00BFFF] to-[#FFD700]">SIDDU</span>
      </motion.div>

      <div className="h-16 relative">
        <AnimatePresence mode="wait">
          {step > 0 && step <= phrases.length && (
            <motion.p
              key={`phrase-${step}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-xl md:text-2xl text-[#E0E0E0] text-center font-dmsans"
            >
              {phrases[step - 1]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
