"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserData {
  username: string
  avatar: string
  genres: string[]
  languages: string[]
  contentTypes: string[]
}

interface ProfileSetupStepProps {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function ProfileSetupStep({ userData, updateUserData, onNext, onPrevious }: ProfileSetupStepProps) {
  const [username, setUsername] = useState(userData.username)
  const [selectedAvatar, setSelectedAvatar] = useState(userData.avatar || "avatar1")

  const avatarOptions = [
    { id: "avatar1", src: "/placeholder.svg?height=80&width=80&query=avatar 1" },
    { id: "avatar2", src: "/placeholder.svg?height=80&width=80&query=avatar 2" },
    { id: "avatar3", src: "/placeholder.svg?height=80&width=80&query=avatar 3" },
    { id: "avatar4", src: "/placeholder.svg?height=80&width=80&query=avatar 4" },
    { id: "avatar5", src: "/placeholder.svg?height=80&width=80&query=avatar 5" },
    { id: "avatar6", src: "/placeholder.svg?height=80&width=80&query=avatar 6" },
  ]

  const handleContinue = () => {
    updateUserData({ username, avatar: selectedAvatar })
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Set Up Your Profile</h2>

      <div className="mb-6">
        <Label htmlFor="username" className="text-white mb-2 block">
          Choose a Username
        </Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter a username"
          className="bg-[#282828] border-[#444] text-white focus:border-[#00BFFF]"
        />
      </div>

      <div className="mb-8">
        <Label className="text-white mb-2 block">Select an Avatar</Label>
        <div className="grid grid-cols-3 gap-4">
          {avatarOptions.map((avatar) => (
            <div
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                selectedAvatar === avatar.id ? "ring-2 ring-[#00BFFF] scale-105" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className="w-20 h-20 relative mx-auto">
                <Image
                  src={avatar.src || "/placeholder.svg"}
                  alt={`Avatar ${avatar.id}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline" className="border-[#444] text-[#E0E0E0] hover:bg-[#333]">
          Back
        </Button>

        <Button
          onClick={handleContinue}
          disabled={!username.trim()}
          className="bg-[#00BFFF] hover:bg-[#00A0E0] text-white"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  )
}
