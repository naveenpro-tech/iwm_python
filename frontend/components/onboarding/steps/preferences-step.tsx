"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"

interface UserData {
  username: string
  avatar: string
  genres: string[]
  languages: string[]
  contentTypes: string[]
}

interface PreferencesStepProps {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function PreferencesStep({ userData, updateUserData, onNext, onPrevious }: PreferencesStepProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(userData.genres || [])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(userData.languages || [])
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(userData.contentTypes || [])

  const genres = [
    "Action",
    "Drama",
    "Comedy",
    "Thriller",
    "Sci-Fi",
    "Horror",
    "Romance",
    "Animation",
    "Documentary",
    "Fantasy",
    "Crime",
    "Mystery",
    "Biography",
    "Musical",
    "War",
  ]

  const languages = [
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Malayalam",
    "Kannada",
    "Bengali",
    "Marathi",
    "Punjabi",
    "Japanese",
    "Korean",
    "Spanish",
    "French",
    "German",
    "Italian",
  ]

  const contentTypes = [
    "Movies",
    "TV Shows",
    "Cricket",
    "Documentaries",
    "Short Films",
    "Indie Films",
    "Classic Cinema",
    "Blockbusters",
    "Film Festivals",
    "Awards",
  ]

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) => (prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]))
  }

  const toggleContentType = (type: string) => {
    setSelectedContentTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleContinue = () => {
    updateUserData({
      genres: selectedGenres,
      languages: selectedLanguages,
      contentTypes: selectedContentTypes,
    })
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Your Preferences</h2>

      <p className="text-[#E0E0E0] mb-6">
        Select your preferences to help us personalize your experience. You can always change these later.
      </p>

      <Tabs defaultValue="genres" className="mb-6">
        <TabsList className="bg-[#282828] border-b border-[#444]">
          <TabsTrigger value="genres">Genres</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="content">Content Types</TabsTrigger>
        </TabsList>

        <TabsContent value="genres" className="pt-4">
          <div className="grid grid-cols-3 gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`p-2 rounded-md flex items-center justify-between transition-colors ${
                  selectedGenres.includes(genre)
                    ? "bg-[#00BFFF] text-white"
                    : "bg-[#282828] text-[#E0E0E0] hover:bg-[#333]"
                }`}
              >
                <span>{genre}</span>
                {selectedGenres.includes(genre) && <Check size={16} />}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="languages" className="pt-4">
          <div className="grid grid-cols-3 gap-2">
            {languages.map((language) => (
              <button
                key={language}
                onClick={() => toggleLanguage(language)}
                className={`p-2 rounded-md flex items-center justify-between transition-colors ${
                  selectedLanguages.includes(language)
                    ? "bg-[#00BFFF] text-white"
                    : "bg-[#282828] text-[#E0E0E0] hover:bg-[#333]"
                }`}
              >
                <span>{language}</span>
                {selectedLanguages.includes(language) && <Check size={16} />}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="pt-4">
          <div className="grid grid-cols-2 gap-2">
            {contentTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleContentType(type)}
                className={`p-2 rounded-md flex items-center justify-between transition-colors ${
                  selectedContentTypes.includes(type)
                    ? "bg-[#00BFFF] text-white"
                    : "bg-[#282828] text-[#E0E0E0] hover:bg-[#333]"
                }`}
              >
                <span>{type}</span>
                {selectedContentTypes.includes(type) && <Check size={16} />}
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline" className="border-[#444] text-[#E0E0E0] hover:bg-[#333]">
          Back
        </Button>

        <Button onClick={handleContinue} className="bg-[#00BFFF] hover:bg-[#00A0E0] text-white">
          Continue
        </Button>
      </div>
    </motion.div>
  )
}
