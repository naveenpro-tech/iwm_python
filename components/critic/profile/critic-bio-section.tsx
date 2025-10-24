"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Youtube, Twitter, Instagram, Globe, Linkedin, Facebook } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CriticProfile } from "@/types/critic"

interface CriticBioSectionProps {
  profile: CriticProfile
}

const socialIcons: Record<string, any> = {
  youtube: Youtube,
  twitter: Twitter,
  instagram: Instagram,
  website: Globe,
  linkedin: Linkedin,
  facebook: Facebook,
}

export default function CriticBioSection({ profile }: CriticBioSectionProps) {
  const [showFullBio, setShowFullBio] = useState(false)
  const bioText = profile.bio || "No bio available."
  const shouldTruncate = bioText.length > 300

  return (
    <Card className="bg-[#282828] border-[#3A3A3A]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#E0E0E0] font-inter">About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bio Text */}
        <div>
          <motion.p
            className="text-[#E0E0E0] font-dmsans leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {shouldTruncate && !showFullBio ? `${bioText.substring(0, 300)}...` : bioText}
          </motion.p>

          {shouldTruncate && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="text-[#00BFFF] hover:text-[#00A8E8] font-dmsans text-sm mt-2 transition-colors"
            >
              {showFullBio ? "Show Less" : "Read More"}
            </button>
          )}
        </div>

        {/* Social Links */}
        {profile.social_links && profile.social_links.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-[#E0E0E0] font-inter mb-3">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {profile.social_links.map((link, index) => {
                const Icon = socialIcons[link.platform.toLowerCase()] || Globe

                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#3A3A3A] rounded-full hover:border-[#00BFFF] hover:shadow-glow transition-all"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5 text-[#00BFFF]" />
                    <span className="text-[#E0E0E0] font-dmsans text-sm">
                      {link.display_text || link.platform}
                    </span>
                  </motion.a>
                )
              })}
            </div>
          </div>
        )}

        {/* Joined Date */}
        <div className="pt-4 border-t border-[#3A3A3A]">
          <p className="text-sm text-[#A0A0A0] font-dmsans">
            Joined {new Date(profile.joined_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

