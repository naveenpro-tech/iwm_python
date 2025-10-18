"use client"

import { motion } from "framer-motion"
import { LogoIcon } from "./logo-icon"

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#1A1A1A]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <LogoIcon size={80} />
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "240px" }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="h-1 bg-gradient-to-r from-[#00BFFF] to-[#FFD700] rounded-full"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-4 text-[#A0A0A0] font-dmsans"
      >
        Preparing your cinematic journey...
      </motion.p>
    </div>
  )
}
