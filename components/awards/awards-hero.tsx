"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function AwardsHero() {
  const router = useRouter()

  return (
    <div className="relative bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/award-ceremony.png')" }}
      />
      <div className="relative container mx-auto px-4 py-24 flex flex-col items-center text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Awards & Ceremonies
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl max-w-3xl mb-8"
        >
          Explore the prestigious film awards from around the world, discover winners and nominees, and follow the
          celebration of cinematic excellence.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => router.push("/awards/oscars")}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Explore Oscars
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/awards/golden-globes")}
            className="bg-transparent border-white text-white hover:bg-white/10"
          >
            Golden Globes
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
