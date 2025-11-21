"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Eye, Save } from "lucide-react"
import { BasicInfoStep } from "./steps/basic-info-step"
import { VerificationStep } from "./steps/verification-step"
import { FilmographyStep } from "./steps/filmography-step"
import { AwardsStep } from "./steps/awards-step"
import { PressKitStep } from "./steps/press-kit-step"
import { SocialMediaStep } from "./steps/social-media-step"
import { PulseManagementStep } from "./steps/pulse-management-step"
import { PrivacyPublishStep } from "./steps/privacy-publish-step"
import type { ProfileFormData } from "../types"

const steps = [
  { id: 1, title: "Basic Information", component: BasicInfoStep },
  { id: 2, title: "Verification", component: VerificationStep },
  { id: 3, title: "Filmography", component: FilmographyStep },
  { id: 4, title: "Awards", component: AwardsStep },
  { id: 5, title: "Press Kit", component: PressKitStep },
  { id: 6, title: "Social Media", component: SocialMediaStep },
  { id: 7, title: "Pulse Management", component: PulseManagementStep },
  { id: 8, title: "Privacy & Publish", component: PrivacyPublishStep },
]

export function ProfileCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProfileFormData>({
    currentStep: 1,
    privacySettings: {
      profileVisibility: "public",
      contactVisibility: "industry-only",
      filmographyVisibility: "public",
      awardsVisibility: "public",
      pressKitVisibility: "public",
      socialMediaVisibility: "public",
      allowMessages: "industry-only",
      allowQuestions: true,
    },
    filmography: [],
    awards: [],
    pressKit: [],
    socialMedia: [],
    verificationDocuments: [],
    scheduledPulses: [],
    companyAffiliation: [],
  })
  const [showPreview, setShowPreview] = useState(false)

  const progress = (currentStep / steps.length) * 100
  const CurrentStepComponent = steps[currentStep - 1].component

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      setFormData({ ...formData, currentStep: currentStep + 1 })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setFormData({ ...formData, currentStep: currentStep - 1 })
    }
  }

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId)
    setFormData({ ...formData, currentStep: stepId })
  }

  const handleSave = () => {
    // Auto-save functionality
    console.log("Saving profile data:", formData)
  }

  const handlePublish = () => {
    // Publish profile
    console.log("Publishing profile:", formData)
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-[#3A3A3A]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Create Your Industry Professional Profile</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="border-[#3A3A3A] hover:bg-[#282828]"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave} className="border-[#3A3A3A] hover:bg-[#282828]">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2 bg-[#282828]" />
            <div className="flex justify-between mt-2 overflow-x-auto pb-2 scrollbar-hide">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className={`text-xs whitespace-nowrap px-2 transition-colors ${
                    step.id === currentStep ? "text-[#00BFFF]" : step.id < currentStep ? "text-white" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              data={formData}
              updateData={(updates: Partial<ProfileFormData>) => setFormData({ ...formData, ...updates })}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-[#3A3A3A] hover:bg-[#282828]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button onClick={handlePublish} className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
              Publish Profile
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#282828] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Profile Preview</h2>
              {/* Preview content would go here */}
              <p className="text-gray-400">Preview functionality coming soon...</p>
              <Button onClick={() => setShowPreview(false)} className="mt-4">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
