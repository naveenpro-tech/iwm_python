"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Save, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ProjectDetailsStep from "./steps/project-details-step"
import RoleDetailsStep from "./steps/role-details-step"
import RequirementsStep from "./steps/requirements-step"
import SubmissionGuidelinesStep from "./steps/submission-guidelines-step"
import ReviewPublishStep from "./steps/review-publish-step"
import type { FormData } from "../types"

const steps = [
  { id: 1, title: "Project Details", component: ProjectDetailsStep },
  { id: 2, title: "Role Details", component: RoleDetailsStep },
  { id: 3, title: "Requirements", component: RequirementsStep },
  { id: 4, title: "Submission", component: SubmissionGuidelinesStep },
  { id: 5, title: "Review & Publish", component: ReviewPublishStep },
]

export default function FormWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<FormData>>({
    projectType: "feature",
    visibility: "public",
    roles: [],
    submissionGuidelines: {
      requiredMaterials: [],
      submissionMethod: "siddu",
    },
  })

  const CurrentStepComponent = steps[currentStep - 1].component

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleUpdateData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData)
    // Implement draft saving logic
  }

  const handlePublish = () => {
    console.log("Publishing:", formData)
    // Implement publish logic
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#1A1A1A] border-b border-[#282828]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold font-inter">Post a Casting Call</h1>
            <Button variant="outline" onClick={handleSaveDraft} className="border-[#282828] hover:bg-[#282828]">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                        currentStep >= step.id ? "bg-[#00BFFF] text-black" : "bg-[#282828] text-[#A0A0A0]",
                      )}
                    >
                      {step.id}
                    </div>
                    <span
                      className={cn(
                        "ml-2 text-sm font-medium hidden sm:inline",
                        currentStep >= step.id ? "text-white" : "text-[#A0A0A0]",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-4 transition-colors",
                        currentStep > step.id ? "bg-[#00BFFF]" : "bg-[#282828]",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent data={formData} onUpdate={handleUpdateData} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-[#282828] hover:bg-[#282828] disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handlePublish} className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
              <Eye className="w-4 h-4 mr-2" />
              Publish
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
