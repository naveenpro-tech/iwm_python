"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Globe, Filter, Eye } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export function PreferencesSettings() {
  const [language, setLanguage] = useState("en")
  const [region, setRegion] = useState("us")
  const [hideSpoilers, setHideSpoilers] = useState(true)
  const [excludedGenres, setExcludedGenres] = useState<string[]>([])
  const [contentRating, setContentRating] = useState("all")

  const genres = ["Horror", "Adult", "Documentary", "Reality TV", "Animation", "Musical", "Western", "War"]

  const handleGenreToggle = (genre: string) => {
    setExcludedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>

        {/* Language & Region */}
        <div className="space-y-6">
          <div className="pb-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Globe className="mr-2" size={20} />
              Language & Region
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language" className="text-gray-300">
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="bg-[#1A1A1A] border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#282828] border-gray-700">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="ko">한국어</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="region" className="text-gray-300">
                  Region
                </Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger id="region" className="bg-[#1A1A1A] border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#282828] border-gray-700">
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                    <SelectItem value="jp">Japan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Content Filtering */}
          <div className="pb-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Filter className="mr-2" size={20} />
              Content Filtering
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="content-rating" className="text-gray-300">
                  Content Rating Limit
                </Label>
                <Select value={contentRating} onValueChange={setContentRating}>
                  <SelectTrigger id="content-rating" className="bg-[#1A1A1A] border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#282828] border-gray-700">
                    <SelectItem value="all">Show All Content</SelectItem>
                    <SelectItem value="r">R and Below</SelectItem>
                    <SelectItem value="pg13">PG-13 and Below</SelectItem>
                    <SelectItem value="pg">PG and Below</SelectItem>
                    <SelectItem value="g">G Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300 mb-3 block">Exclude Genres</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {genres.map((genre) => (
                    <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={excludedGenres.includes(genre)}
                        onCheckedChange={() => handleGenreToggle(genre)}
                        className="border-gray-600"
                      />
                      <span className="text-sm text-gray-300">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Spoiler Settings */}
          <div className="pb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Eye className="mr-2" size={20} />
              Spoiler Protection
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Hide Spoilers by Default</p>
                <p className="text-sm text-gray-400">Blur potential spoilers in reviews and discussions</p>
              </div>
              <Switch
                checked={hideSpoilers}
                onCheckedChange={setHideSpoilers}
                className="data-[state=checked]:bg-[#00BFFF]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button className="bg-[#00BFFF] hover:bg-[#0099CC] text-white">Save Preferences</Button>
        </div>
      </div>
    </motion.div>
  )
}
