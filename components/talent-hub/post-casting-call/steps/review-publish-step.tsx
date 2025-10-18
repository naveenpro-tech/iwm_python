"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MapPin, Calendar, ChevronDown, ChevronUp, Edit, Users, Briefcase } from "lucide-react"
import { format } from "date-fns"
import type { FormData } from "../../types"
import { motion, AnimatePresence } from "framer-motion"

interface ReviewPublishStepProps {
  data: Partial<FormData>
  onUpdate: (data: Partial<FormData>) => void
}

export default function ReviewPublishStep({ data, onUpdate }: ReviewPublishStepProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["project", "roles"])
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [publishOption, setPublishOption] = useState<"now" | "schedule" | "draft">("now")

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-4 hover:bg-[#3A3A3A] transition-colors"
    >
      <h3 className="font-semibold">{title}</h3>
      {expandedSections.includes(section) ? (
        <ChevronUp className="w-5 h-5 text-[#A0A0A0]" />
      ) : (
        <ChevronDown className="w-5 h-5 text-[#A0A0A0]" />
      )}
    </button>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-6">Review & Publish</h2>
        <p className="text-[#A0A0A0] mb-6">
          Review all the details of your casting call before publishing. Click on any section to expand or edit.
        </p>

        {/* Project Details Section */}
        <Card className="bg-[#282828] border-[#3A3A3A] mb-4 overflow-hidden">
          <SectionHeader title="Project Details" section="project" />
          <AnimatePresence>
            {expandedSections.includes("project") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4"
              >
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-[#A0A0A0]">Title:</span>
                    <p className="font-medium">{data.projectTitle || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-[#A0A0A0]">Type:</span>
                    <p className="font-medium capitalize">{data.projectType?.replace("-", " ") || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-[#A0A0A0]">Production Company:</span>
                    <p className="font-medium">{data.productionCompany || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-[#A0A0A0]">Description:</span>
                    <p className="text-sm mt-1">{data.description || "Not specified"}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#00BFFF]" />
                      <span>
                        {data.location?.city}, {data.location?.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#00BFFF]" />
                      <span>
                        {data.productionTimeline?.start && format(data.productionTimeline.start, "MMM d")} -{" "}
                        {data.productionTimeline?.end && format(data.productionTimeline.end, "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-[#00BFFF] text-[#00BFFF]">
                      {data.visibility === "public" ? "Public" : "Private"}
                    </Badge>
                    {data.budgetRange && (
                      <Badge variant="outline" className="border-[#A0A0A0]">
                        {data.budgetRange} budget
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-[#3A3A3A]"
                  onClick={() => console.log("Edit project details")}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Section
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Roles Section */}
        <Card className="bg-[#282828] border-[#3A3A3A] mb-4 overflow-hidden">
          <SectionHeader title={`Roles (${data.roles?.length || 0})`} section="roles" />
          <AnimatePresence>
            {expandedSections.includes("roles") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4"
              >
                <div className="space-y-4">
                  {data.roles?.map((role) => (
                    <Card key={role.id} className="p-4 bg-[#1A1A1A] border-[#3A3A3A]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {role.type === "acting" ? (
                              <Users className="w-4 h-4 text-[#00BFFF]" />
                            ) : (
                              <Briefcase className="w-4 h-4 text-[#00BFFF]" />
                            )}
                            <h4 className="font-semibold">{role.title}</h4>
                            <Badge variant="outline" className="ml-2">
                              {role.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#A0A0A0] mb-2">{role.description}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="secondary" className="bg-[#3A3A3A]">
                              {role.compensation}
                            </Badge>
                            {role.department && (
                              <Badge variant="secondary" className="bg-[#3A3A3A]">
                                {role.department}
                              </Badge>
                            )}
                            <Badge variant="secondary" className="bg-[#3A3A3A]">
                              {role.auditionType.replace("-", " ")}
                            </Badge>
                          </div>
                          <div className="text-xs text-[#A0A0A0]">
                            <p>
                              <span className="font-medium">Age:</span>{" "}
                              {role.requirements.ageRange
                                ? `${role.requirements.ageRange.min} - ${role.requirements.ageRange.max}`
                                : "Any"}
                            </p>
                            {role.requirements.gender && role.requirements.gender.length > 0 && (
                              <p>
                                <span className="font-medium">Gender:</span> {role.requirements.gender.join(", ")}
                              </p>
                            )}
                            {role.requirements.skills && role.requirements.skills.length > 0 && (
                              <p>
                                <span className="font-medium">Skills:</span> {role.requirements.skills.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-[#3A3A3A]"
                  onClick={() => console.log("Edit roles")}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Roles
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Requirements Section */}
        <Card className="bg-[#282828] border-[#3A3A3A] mb-4 overflow-hidden">
          <SectionHeader title="Requirements" section="requirements" />
          <AnimatePresence>
            {expandedSections.includes("requirements") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4"
              >
                <p className="text-[#A0A0A0] mb-4">Requirements are configured per role. See role details above.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Submission Guidelines Section */}
        <Card className="bg-[#282828] border-[#3A3A3A] mb-4 overflow-hidden">
          <SectionHeader title="Submission Guidelines" section="submission" />
          <AnimatePresence>
            {expandedSections.includes("submission") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4"
              >
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-[#A0A0A0]">Deadline:</span>
                    <p className="font-medium">
                      {data.submissionDeadline ? format(data.submissionDeadline, "MMMM d, yyyy") : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-[#A0A0A0]">Required Materials:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.submissionGuidelines?.requiredMaterials?.map((material) => (
                        <Badge key={material} variant="secondary" className="bg-[#3A3A3A]">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-[#A0A0A0]">Submission Method:</span>
                    <p className="font-medium capitalize">
                      {data.submissionGuidelines?.submissionMethod || "Not specified"}
                    </p>
                    {data.submissionGuidelines?.submissionMethod === "email" && (
                      <p className="text-sm">{data.submissionGuidelines.contactInfo?.email}</p>
                    )}
                    {data.submissionGuidelines?.submissionMethod === "website" && (
                      <p className="text-sm">{data.submissionGuidelines.contactInfo?.website}</p>
                    )}
                  </div>
                  {data.submissionGuidelines?.specialInstructions && (
                    <div>
                      <span className="text-sm text-[#A0A0A0]">Special Instructions:</span>
                      <p className="text-sm mt-1">{data.submissionGuidelines.specialInstructions}</p>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-[#3A3A3A]"
                  onClick={() => console.log("Edit submission guidelines")}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Section
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Terms & Conditions */}
        <Card className="bg-[#282828] border-[#3A3A3A] p-4 mb-6">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="mt-1"
            />
            <div>
              <Label htmlFor="terms" className="font-normal cursor-pointer">
                I agree to the Siddu Talent Hub Terms & Conditions
              </Label>
              <p className="text-sm text-[#A0A0A0] mt-1">
                By publishing this casting call, I confirm that all information provided is accurate and that I have the
                authority to post this opportunity. I understand that fraudulent listings may result in account
                suspension.
              </p>
            </div>
          </div>
        </Card>

        {/* Publish Options */}
        <Card className="bg-[#282828] border-[#3A3A3A] p-4 mb-6">
          <h3 className="font-semibold mb-3">Publish Options</h3>
          <RadioGroup value={publishOption} onValueChange={(value) => setPublishOption(value as any)}>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="now" id="now" className="mt-1" />
                <div>
                  <Label htmlFor="now" className="font-normal cursor-pointer">
                    Publish Now
                  </Label>
                  <p className="text-sm text-[#A0A0A0]">Make this casting call visible immediately</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="schedule" id="schedule" className="mt-1" />
                <div>
                  <Label htmlFor="schedule" className="font-normal cursor-pointer">
                    Schedule Publication
                  </Label>
                  <p className="text-sm text-[#A0A0A0]">Choose a future date to publish this casting call</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="draft" id="draft" className="mt-1" />
                <div>
                  <Label htmlFor="draft" className="font-normal cursor-pointer">
                    Save as Draft
                  </Label>
                  <p className="text-sm text-[#A0A0A0]">Save your progress without publishing</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </Card>
      </div>
    </div>
  )
}
