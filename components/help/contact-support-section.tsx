"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, MessageSquare, Mail, Phone } from "lucide-react"

export function ContactSupportSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <div className="flex items-center mb-6">
        <MessageSquare className="text-[#00BFFF] mr-2" size={24} />
        <h2 className="text-2xl font-bold text-white">Contact Support</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-300 mb-6">
            Can't find what you're looking for? Our support team is here to help. Fill out the form and we'll get back
            to you as soon as possible.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <div className="bg-[#252525] p-2 rounded-full mr-3">
                <Mail size={18} className="text-[#00BFFF]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email us at</p>
                <p className="text-white">support@siddu.com</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-[#252525] p-2 rounded-full mr-3">
                <Phone size={18} className="text-[#00BFFF]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Call us at</p>
                <p className="text-white">+1 (800) 123-4567</p>
              </div>
            </div>
          </div>

          <div className="bg-[#252525] p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Support Hours</h3>
            <p className="text-gray-300 text-sm">Monday - Friday: 9am - 6pm EST</p>
            <p className="text-gray-300 text-sm">Saturday: 10am - 4pm EST</p>
            <p className="text-gray-300 text-sm">Sunday: Closed</p>
          </div>
        </div>

        <div>
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#252525] p-6 rounded-lg text-center h-full flex flex-col items-center justify-center"
            >
              <div className="bg-[#00BFFF] p-3 rounded-full mb-4">
                <Send size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-gray-300">
                Thank you for reaching out. Our support team will get back to you shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-6 bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-md transition-colors"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-300 text-sm mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#252525] border border-[#333] text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#00BFFF]"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 text-sm mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#252525] border border-[#333] text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#00BFFF]"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-300 text-sm mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#252525] border border-[#333] text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#00BFFF]"
                >
                  <option value="">Select a subject</option>
                  <option value="account">Account Issues</option>
                  <option value="billing">Billing Questions</option>
                  <option value="technical">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 text-sm mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-[#252525] border border-[#333] text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#00BFFF]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00BFFF] hover:bg-[#00A0E0] text-white font-medium py-2 rounded-md transition-colors flex items-center justify-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  )
}
