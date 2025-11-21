"use client"

import { motion } from "framer-motion"

interface OnboardingProgressProps {
  steps: { id: string; title: string }[]
  currentStep: number
}

export default function OnboardingProgress({ steps, currentStep }: OnboardingProgressProps) {
  return (
    <div className="bg-[#282828] px-6 py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep
                    ? "bg-[#00BFFF] text-white"
                    : index === currentStep
                      ? "bg-[#00BFFF] text-white"
                      : "bg-[#444] text-[#A0A0A0]"
                }`}
              >
                {index < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {index < steps.length - 1 && (
                <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-full h-0.5 bg-[#444]">
                  {index < currentStep && (
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-full bg-[#00BFFF]" />
                  )}
                </div>
              )}
            </div>

            <span className={`text-xs mt-2 ${index <= currentStep ? "text-white" : "text-[#A0A0A0]"}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
