"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Globe, MapPin, MessageCircle, Send, ExternalLink, Copy, Check } from "lucide-react"
import type { IndustryProfessionalProfile } from "../../types"

interface ProfileContactProps {
  profile: IndustryProfessionalProfile
}

export function ProfileContact({ profile }: ProfileContactProps) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  // Mock contact data
  const contactInfo = {
    email: "contact@example.com",
    phone: "+1 (323) 555-1234",
    website: "https://www.example.com",
    location: "Los Angeles, CA",
    assistant: {
      name: "Jane Smith",
      email: "assistant@example.com",
      phone: "+1 (323) 555-5678",
    },
    representation: {
      agency: "Creative Artists Agency",
      agent: "John Doe",
      email: "agent@example.com",
    },
  }

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

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Contact Information */}
      <motion.div className="lg:col-span-1 space-y-6" variants={itemVariants}>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Direct contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-[#E0E0E0]">
                <Mail className="w-5 h-5 mr-3 text-[#00BFFF]" />
                <span>{contactInfo.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleCopy(contactInfo.email, "email")}
              >
                {copied === "email" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-[#E0E0E0]">
                <Phone className="w-5 h-5 mr-3 text-[#00BFFF]" />
                <span>{contactInfo.phone}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleCopy(contactInfo.phone, "phone")}
              >
                {copied === "phone" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-[#E0E0E0]">
                <Globe className="w-5 h-5 mr-3 text-[#00BFFF]" />
                <span>{contactInfo.website}</span>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => window.open(contactInfo.website, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopy(contactInfo.website, "website")}
                >
                  {copied === "website" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center text-[#E0E0E0]">
              <MapPin className="w-5 h-5 mr-3 text-[#00BFFF]" />
              <span>{contactInfo.location}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Representation</CardTitle>
            <CardDescription>Agency and management details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge className="mb-2 bg-[#3A3A3A] text-[#E0E0E0] hover:bg-[#4A4A4A]">Agency</Badge>
              <p className="font-medium text-[#E0E0E0]">{contactInfo.representation.agency}</p>
              <p className="text-[#A0A0A0]">{contactInfo.representation.agent}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[#00BFFF] text-sm">{contactInfo.representation.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopy(contactInfo.representation.email, "agent")}
                >
                  {copied === "agent" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#3A3A3A]">
              <Badge className="mb-2 bg-[#3A3A3A] text-[#E0E0E0] hover:bg-[#4A4A4A]">Assistant</Badge>
              <p className="font-medium text-[#E0E0E0]">{contactInfo.assistant.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[#A0A0A0]">{contactInfo.assistant.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopy(contactInfo.assistant.email, "assistant-email")}
                >
                  {copied === "assistant-email" ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[#A0A0A0]">{contactInfo.assistant.phone}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopy(contactInfo.assistant.phone, "assistant-phone")}
                >
                  {copied === "assistant-phone" ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Message Form */}
      <motion.div className="lg:col-span-2" variants={itemVariants}>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Send a Message
            </CardTitle>
            <CardDescription>Contact {profile.name} directly through the Siddu platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                />
              </div>

              <div>
                <Textarea
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[200px] bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                />
              </div>

              <Button className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>

              <p className="text-sm text-[#A0A0A0] text-center mt-2">
                Messages are subject to Siddu's{" "}
                <span className="text-[#00BFFF] cursor-pointer">Community Guidelines</span> and{" "}
                <span className="text-[#00BFFF] cursor-pointer">Terms of Service</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
