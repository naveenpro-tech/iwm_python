"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import WelcomeStep from "./steps/welcome-step"
import ProfileSetupStep from "./steps/profile-setup-step"
import PreferencesStep from "./steps/preferences-step"
import FeatureTourStep from "./steps/feature-tour-step"
import CompletionStep from "./steps/completion-step"
import OnboardingProgress from "./onboarding-progress"

interface OnboardingExperienceProps {
  onComplete: () => void
  onSkip: () => void
}

export default function OnboardingExperience({ onComplete, onSkip }: OnboardingExperienceProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState({
    username: "",
    avatar: "",
    genres: [],
    languages: [],
    contentTypes: [],
  })

  const steps = [
    { id: "welcome", title: "Welcome" },
    { id: "profile", title: "Profile" },
    { id: "preferences", title: "Preferences" },
    { id: "tour", title: "Features" },
    { id: "completion", title: "Done" },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateUserData = (data: Partial<typeof userData>) => {
    setUserData({ ...userData, ...data })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-[#1A1A1A] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="relative">
          <button onClick={onSkip} className="absolute top-4 right-4 text-[#A0A0A0] hover:text-white">
            <X size={24} />
          </button>

          <OnboardingProgress steps={steps} currentStep={currentStep} />
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === 0 && <WelcomeStep key="welcome" onNext={handleNext} />}

            {currentStep === 1 && (
              <ProfileSetupStep
                key="profile"
                userData={userData}
                updateUserData={updateUserData}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}

            {currentStep === 2 && (
              <PreferencesStep
                key="preferences"
                userData={userData}
                updateUserData={updateUserData}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}

            {currentStep === 3 && <FeatureTourStep key="tour" onNext={handleNext} onPrevious={handlePrevious} />}

            {currentStep === 4 && (
              <CompletionStep
                key="completion"
                userData={userData}
                onComplete={onComplete}
                onPrevious={handlePrevious}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
