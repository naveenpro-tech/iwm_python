'use client'

/**
 * Like Button Component
 * Heart animation with particle burst
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

interface LikeButtonProps {
  isLiked: boolean
  likeCount: number
  onClick: () => void
}

export default function LikeButton({ isLiked, likeCount, onClick }: LikeButtonProps) {
  const [showParticles, setShowParticles] = useState(false)

  const handleClick = () => {
    onClick()
    if (!isLiked) {
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 600)
    }
  }

  // Particle burst effect
  const particles = Array.from({ length: 8 }).map((_, i) => ({
    angle: (i * 45) * (Math.PI / 180),
    distance: 30,
  }))

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 1.3 }}
        className="flex items-center gap-2 group"
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={20}
            className={`transition-colors ${
              isLiked ? 'text-[#EF4444] fill-[#EF4444]' : 'text-[#A0A0A0] group-hover:text-[#EF4444]'
            }`}
          />
        </motion.div>
        <span className={`text-sm font-medium ${isLiked ? 'text-[#EF4444]' : 'text-[#A0A0A0]'}`}>
          {likeCount}
        </span>
      </motion.button>

      {/* Particle Burst */}
      <AnimatePresence>
        {showParticles && (
          <>
            {particles.map((particle, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: Math.cos(particle.angle) * particle.distance,
                  y: Math.sin(particle.angle) * particle.distance,
                  opacity: 0,
                  scale: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#EF4444] rounded-full pointer-events-none"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

