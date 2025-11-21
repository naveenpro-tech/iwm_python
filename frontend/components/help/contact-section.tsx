"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    email: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Support ticket submitted:", formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-12 bg-[#282828] border border-gray-700 rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <MessageSquare className="mr-3 text-[#00BFFF]" size={24} />
        Still Need Help?
      </h2>

      <p className="text-gray-400 mb-6">
        Can't find what you're looking for? Contact our support team and we'll get back to you within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-[#1A1A1A] border-gray-700 text-white"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="subject" className="text-gray-300">
            Subject
          </Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="bg-[#1A1A1A] border-gray-700 text-white"
            placeholder="Brief description of your issue"
            required
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-gray-300">
            Message
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="bg-[#1A1A1A] border-gray-700 text-white min-h-[120px]"
            placeholder="Describe your issue in detail..."
            required
          />
        </div>

        <Button type="submit" className="bg-[#00BFFF] hover:bg-[#0099CC] text-white">
          <Send size={16} className="mr-2" />
          Submit Ticket
        </Button>
      </form>
    </motion.div>
  )
}
