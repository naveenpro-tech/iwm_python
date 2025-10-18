"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface UserData {
  username: string
  avatar: string
  genres: string[]
  languages: string[]
  contentTypes: string[]
}

interface CompletionStepProps {
  userData: UserData
  onComplete: () => void
  onPrevious: () => void
}

export default function CompletionStep({ userData, onComplete, onPrevious }: CompletionStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-20 h-20 bg-[#00BFFF] rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Check className="text-white" size={32} />
      </motion.div>

      <h2 className="text-3xl font-bold text-white mb-4">You're All Set!</h2>

      <p className="text-[#E0E0E0] mb-8 max-w-md mx-auto">
        Welcome to Siddu, {userData.username}! Your profile has been set up with your preferences. Get ready to explore
        the world of cinema and cricket like never before.
      </p>

      <div className="bg-[#282828] p-6 rounded-lg mb-8 max-w-md mx-auto">
        <h3 className="text-white font-bold mb-4">Your Preferences</h3>

        {userData.genres.length > 0 && (
          <div className="mb-4">
            <p className="text-[#E0E0E0] mb-2">Favorite Genres:</p>
            <div className="flex flex-wrap gap-2">
              {userData.genres.map((genre) => (
                <span key={genre} className="bg-[#333] text-white px-3 py-1 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {userData.languages.length > 0 && (
          <div className="mb-4">
            <p className="text-[#E0E0E0] mb-2">Languages:</p>
            <div className="flex flex-wrap gap-2">
              {userData.languages.map((language) => (
                <span key={language} className="bg-[#333] text-white px-3 py-1 rounded-full text-sm">
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}

        {userData.contentTypes.length > 0 && (
          <div>
            <p className="text-[#E0E0E0] mb-2">Content Types:</p>
            <div className="flex flex-wrap gap-2">
              {userData.contentTypes.map((type) => (
                <span key={type} className="bg-[#333] text-white px-3 py-1 rounded-full text-sm">
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline" className="border-[#444] text-[#E0E0E0] hover:bg-[#333]">
          Back
        </Button>

        <Button onClick={onComplete} className="bg-[#00BFFF] hover:bg-[#00A0E0] text-white">
          Start Exploring
        </Button>
      </div>
    </motion.div>
  )
}
