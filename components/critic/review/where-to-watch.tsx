"use client"

import { motion } from "framer-motion"
import { ExternalLink, Play } from "lucide-react"
import Image from "next/image"

interface WhereToWatchProps {
  platforms: { platform: string; logo: string; link: string; price?: string }[]
}

export function WhereToWatch({ platforms }: WhereToWatchProps) {
  if (platforms.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Play className="w-6 h-6 text-[#00BFFF]" />
          <h3 className="text-xl font-bold font-inter text-[#E0E0E0]">Where to Watch</h3>
        </div>
        <p className="text-[#A0A0A0]">
          Streaming availability information is currently unavailable for this title.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#3A3A3A] rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Play className="w-6 h-6 text-[#00BFFF]" />
        <h3 className="text-xl font-bold font-inter text-[#E0E0E0]">Where to Watch</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform, index) => (
          <motion.a
            key={platform.platform}
            href={platform.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.4 + index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-[#282828] border border-[#3A3A3A] rounded-lg p-4 hover:border-[#00BFFF] transition-all overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00BFFF]/0 to-[#00BFFF]/0 group-hover:from-[#00BFFF]/10 group-hover:to-[#00BFFF]/5 transition-all duration-300" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Platform Logo */}
                <div className="w-12 h-12 bg-white rounded-lg p-2 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={platform.logo}
                      alt={platform.platform}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Platform Info */}
                <div>
                  <p className="text-sm font-medium text-[#E0E0E0] group-hover:text-[#00BFFF] transition-colors">
                    {platform.platform}
                  </p>
                  {platform.price ? (
                    <p className="text-xs text-[#A0A0A0]">{platform.price}</p>
                  ) : (
                    <p className="text-xs text-[#00BFFF]">Included</p>
                  )}
                </div>
              </div>

              {/* External Link Icon */}
              <ExternalLink className="w-4 h-4 text-[#A0A0A0] group-hover:text-[#00BFFF] transition-colors" />
            </div>

            {/* Hover Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              style={{ transform: "skewX(-20deg)" }}
            />
          </motion.a>
        ))}
      </div>

      <p className="text-xs text-[#A0A0A0] mt-4 text-center">
        Availability may vary by region. Prices are subject to change.
      </p>
    </motion.div>
  )
}

