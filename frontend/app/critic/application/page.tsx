"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CriticApplicationForm from "@/components/critic/application-form"

export default function CriticApplicationPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Redirect to application status page
    router.push("/critic/application-status")
  }

  const handleCancel = () => {
    // Go back to settings
    router.push("/settings")
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/settings">
            <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
          <h1 className="text-4xl font-bold font-inter text-[#E0E0E0] mb-2">Become a Verified Critic</h1>
          <p className="text-[#A0A0A0]">
            Join our community of verified critics and share your professional film reviews with the world.
          </p>
        </motion.div>

        <CriticApplicationForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  )
}

