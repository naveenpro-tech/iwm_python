"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Award, GraduationCap, Heart, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TalentProfile } from "../../types"

interface ProfileAboutProps {
  profile: TalentProfile
}

export function ProfileAbout({ profile }: ProfileAboutProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Biography */}
      <motion.div variants={itemVariants}>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Biography</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.biography ? (
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-line">{profile.biography}</p>
              </div>
            ) : (
              <p className="text-gray-400">No biography added yet</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Resume */}
      <motion.div variants={itemVariants}>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Resume / CV</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.resume ? (
              <div className="bg-[#1A1A1A] p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-12 bg-[#3A3A3A] rounded flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-[#00BFFF]" />
                  </div>
                  <div>
                    <p className="font-medium">Professional Resume</p>
                    <p className="text-xs text-gray-400">
                      Updated {new Date(profile.resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ) : (
              <p className="text-gray-400">No resume uploaded yet</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Documents */}
      {profile.additionalDocuments && profile.additionalDocuments.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle>Additional Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.additionalDocuments.map((doc, index) => (
                  <div key={index} className="bg-[#1A1A1A] p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded bg-[#3A3A3A] flex items-center justify-center mr-3">
                        {doc.type === "certificate" && <GraduationCap className="w-4 h-4 text-blue-400" />}
                        {doc.type === "reference" && <FileText className="w-4 h-4 text-green-400" />}
                        {doc.type === "award" && <Award className="w-4 h-4 text-yellow-400" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{doc.type}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#00BFFF] hover:bg-[#00BFFF]/10">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Personal Interests */}
      <motion.div variants={itemVariants}>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-[#00BFFF]" />
              Personal Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["Photography", "Travel", "Reading", "Hiking", "Cooking"].map((interest, index) => (
                <Badge key={index} variant="outline" className="border-[#3A3A3A] text-gray-300">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
