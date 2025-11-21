"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, User, MessageSquare, Globe, Clock } from "lucide-react"
import type { TalentProfile } from "../../types"

interface ProfileContactProps {
  profile: TalentProfile
}

export function ProfileContact({ profile }: ProfileContactProps) {
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
      <motion.div variants={itemVariants}>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1A1A1A] p-4 rounded-lg flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center mr-3">
                  <Mail className="w-5 h-5 text-[#00BFFF]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>

              {profile.phone && (
                <div className="bg-[#1A1A1A] p-4 rounded-lg flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center mr-3">
                    <Phone className="w-5 h-5 text-[#00BFFF]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {profile.professionalWebsite && (
              <div className="bg-[#1A1A1A] p-4 rounded-lg flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-[#00BFFF]" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm text-gray-400">Website</p>
                  <p className="font-medium truncate">{profile.professionalWebsite}</p>
                </div>
                <Button variant="outline" size="sm" className="ml-2 border-[#3A3A3A] hover:bg-[#3A3A3A]">
                  Visit
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Agent/Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#1A1A1A] p-4 rounded-lg flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-[#00BFFF]" />
              </div>
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-gray-400">Talent Manager at Creative Artists Agency</p>
                <div className="flex items-center mt-2 gap-4">
                  <Button variant="outline" size="sm" className="border-[#3A3A3A] hover:bg-[#3A3A3A]">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="border-[#3A3A3A] hover:bg-[#3A3A3A]">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center mr-3">
                  <MessageSquare className="w-5 h-5 text-[#00BFFF]" />
                </div>
                <div>
                  <p className="font-medium">Direct Message</p>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Usually responds within 48 hours</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black">Start Conversation</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
