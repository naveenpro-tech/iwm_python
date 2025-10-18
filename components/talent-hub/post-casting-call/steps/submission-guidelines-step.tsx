"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { FormData } from "../../types"
import { cn } from "@/lib/utils"

interface SubmissionGuidelinesStepProps {
  data: Partial<FormData>
  onUpdate: (data: Partial<FormData>) => void
}

const materialOptions = [
  "Headshot",
  "Resume/CV",
  "Demo Reel",
  "Portfolio",
  "Cover Letter",
  "References",
  "Work Samples",
  "Showreel",
]

export default function SubmissionGuidelinesStep({ data, onUpdate }: SubmissionGuidelinesStepProps) {
  const updateGuidelines = (updates: any) => {
    onUpdate({
      submissionGuidelines: {
        ...data.submissionGuidelines,
        ...updates,
      },
    })
  }

  const toggleMaterial = (material: string) => {
    const currentMaterials = data.submissionGuidelines?.requiredMaterials || []
    if (currentMaterials.includes(material)) {
      updateGuidelines({
        requiredMaterials: currentMaterials.filter((m) => m !== material),
      })
    } else {
      updateGuidelines({
        requiredMaterials: [...currentMaterials, material],
      })
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-6">Submission Guidelines</h2>

        {/* Application Deadline */}
        <div className="space-y-2 mb-6">
          <Label>Application Deadline *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-[#282828] border-[#3A3A3A]",
                  !data.submissionDeadline && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.submissionDeadline ? format(data.submissionDeadline, "PPP") : <span>Pick a deadline date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={data.submissionDeadline}
                onSelect={(date) => onUpdate({ submissionDeadline: date || new Date() })}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          <p className="text-sm text-[#A0A0A0]">Applications will close at 11:59 PM on this date</p>
        </div>

        {/* Required Materials */}
        <div className="space-y-2 mb-6">
          <Label>Required Materials *</Label>
          <p className="text-sm text-[#A0A0A0] mb-3">Select all materials applicants must submit</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {materialOptions.map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox
                  id={material}
                  checked={data.submissionGuidelines?.requiredMaterials?.includes(material) || false}
                  onCheckedChange={() => toggleMaterial(material)}
                />
                <Label htmlFor={material} className="font-normal cursor-pointer">
                  {material}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Method */}
        <div className="space-y-2 mb-6">
          <Label>Submission Method *</Label>
          <RadioGroup
            value={data.submissionGuidelines?.submissionMethod || "siddu"}
            onValueChange={(value) => updateGuidelines({ submissionMethod: value })}
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="siddu" id="siddu" className="mt-1" />
                <div>
                  <Label htmlFor="siddu" className="font-normal cursor-pointer">
                    Direct on Siddu (Recommended)
                  </Label>
                  <p className="text-sm text-[#A0A0A0]">
                    Applicants submit directly through the platform. Easy to manage and track.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="email" id="email" className="mt-1" />
                <div>
                  <Label htmlFor="email" className="font-normal cursor-pointer">
                    External Email
                  </Label>
                  <p className="text-sm text-[#A0A0A0]">Applicants send submissions to your email address.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="website" id="website" className="mt-1" />
                <div>
                  <Label htmlFor="website" className="font-normal cursor-pointer">
                    External Website
                  </Label>
                  <p className="text-sm text-[#A0A0A0]">Redirect applicants to your own submission portal.</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Contact Information (conditional) */}
        {data.submissionGuidelines?.submissionMethod === "email" && (
          <div className="space-y-2 mb-6">
            <Label htmlFor="email">Submission Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.submissionGuidelines?.contactInfo?.email || ""}
              onChange={(e) =>
                updateGuidelines({
                  contactInfo: { ...data.submissionGuidelines?.contactInfo, email: e.target.value },
                })
              }
              placeholder="casting@productioncompany.com"
              className="bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
            />
          </div>
        )}

        {data.submissionGuidelines?.submissionMethod === "website" && (
          <div className="space-y-2 mb-6">
            <Label htmlFor="website">Submission Website URL *</Label>
            <Input
              id="website"
              type="url"
              value={data.submissionGuidelines?.contactInfo?.website || ""}
              onChange={(e) =>
                updateGuidelines({
                  contactInfo: { ...data.submissionGuidelines?.contactInfo, website: e.target.value },
                })
              }
              placeholder="https://example.com/casting"
              className="bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
            />
          </div>
        )}

        {/* Special Instructions */}
        <div className="space-y-2">
          <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
          <Textarea
            id="specialInstructions"
            value={data.submissionGuidelines?.specialInstructions || ""}
            onChange={(e) => updateGuidelines({ specialInstructions: e.target.value })}
            placeholder="Any additional instructions for applicants..."
            rows={4}
            className="bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
          />
          <p className="text-sm text-[#A0A0A0]">
            Include any specific requirements, audition preparation notes, or important information
          </p>
        </div>
      </div>
    </div>
  )
}
