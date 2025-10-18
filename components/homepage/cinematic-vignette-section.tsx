"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clapperboard, ArrowRight } from "lucide-react"
import type { CinematicVignette } from "./types"

interface CinematicVignetteSectionProps {
  vignettes: CinematicVignette[] // Expecting an array now
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.2 } },
}

const vignetteVariants = {
  hidden: { opacity: 0, scale: 0.9, filter: "grayscale(80%) blur(5px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "grayscale(0%) blur(0px)",
    transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1] },
  },
}

export const CinematicVignetteSection: React.FC<CinematicVignetteSectionProps> = ({ vignettes }) => {
  if (!vignettes || vignettes.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Cinematic Vignettes</h2>
          <p className="text-slate-400">No vignettes to display at the moment.</p>
        </div>
      </section>
    )
  }

  // For this section, we'll display the first vignette if multiple are passed,
  // or you can adapt it to be a carousel or grid if multiple vignettes are a design goal.
  const vignetteToDisplay = vignettes[0]

  return (
    <section className="py-10 md:py-16 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 mb-3 flex items-center justify-center"
          >
            <Clapperboard className="w-8 h-8 mr-3 text-slate-300" />
            Explore Cinematic Arts
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-md md:text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Dive into visual storytelling, iconic moments, and the magic behind the movies.
          </motion.p>
        </div>

        <motion.div
          className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.5/1] max-h-[500px] md:max-h-[600px] rounded-xl overflow-hidden group shadow-2xl border-2 border-slate-800 hover:border-slate-600 transition-all duration-300"
          variants={vignetteVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          whileHover={{ scale: 1.01 }}
        >
          <Image
            src={
              vignetteToDisplay.fallbackImageUrl ||
              `/placeholder.svg?width=1200&height=480&query=${vignetteToDisplay.title}`
            }
            alt={vignetteToDisplay.title}
            layout="fill"
            objectFit="cover"
            priority
            className="transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/30 md:to-transparent p-6 md:p-10 flex flex-col justify-end md:justify-center md:w-1/2 lg:w-2/5">
            {vignetteToDisplay.quote && (
              <motion.blockquote
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mb-4 md:mb-6"
              >
                <p className="text-xl md:text-2xl lg:text-3xl italic text-slate-100 leading-tight shadow-text">
                  "{vignetteToDisplay.quote}"
                </p>
                {vignetteToDisplay.quoteAuthor && (
                  <cite className="block text-sm text-slate-400 mt-2 not-italic">
                    - {vignetteToDisplay.quoteAuthor}
                  </cite>
                )}
              </motion.blockquote>
            )}
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: vignetteToDisplay.quote ? 0.4 : 0.3 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 shadow-text line-clamp-2"
            >
              {vignetteToDisplay.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: vignetteToDisplay.quote ? 0.5 : 0.4 }}
              className="text-sm md:text-base text-slate-300 mb-4 md:mb-6 line-clamp-3 md:line-clamp-4 leading-relaxed shadow-text"
            >
              {vignetteToDisplay.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: vignetteToDisplay.quote ? 0.6 : 0.5 }}
            >
              <Link href={vignetteToDisplay.ctaLink} passHref legacyBehavior>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-slate-100 border-slate-500/50 hover:border-slate-300 w-full sm:w-auto group/button"
                >
                  <a>
                    {vignetteToDisplay.ctaText}
                    <ArrowRight className="w-5 h-5 ml-2.5 transition-transform group-hover/button:translate-x-1" />
                  </a>
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
