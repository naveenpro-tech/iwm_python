"use client"

import { motion } from "framer-motion"
import { Facebook, Globe, Instagram, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SocialLinksProps {
  personId: string | number
}

export function SocialLinks({ personId }: SocialLinksProps) {
  // Mock social links data
  const socialLinks = [
    {
      id: 1,
      platform: "Website",
      url: "https://www.christophernolan.info",
      icon: <Globe size={18} />,
      color: "bg-[#2A2A2A] hover:bg-[#3A3A3A]",
    },
    {
      id: 2,
      platform: "Instagram",
      url: "https://www.instagram.com/christophernolan",
      icon: <Instagram size={18} />,
      color: "bg-[#E1306C] hover:bg-[#C13584]",
    },
    {
      id: 3,
      platform: "Twitter",
      url: "https://www.twitter.com/christophernolan",
      icon: <Twitter size={18} />,
      color: "bg-[#1DA1F2] hover:bg-[#0c85d0]",
    },
    {
      id: 4,
      platform: "Facebook",
      url: "https://www.facebook.com/christophernolan",
      icon: <Facebook size={18} />,
      color: "bg-[#4267B2] hover:bg-[#365899]",
    },
    {
      id: 5,
      platform: "YouTube",
      url: "https://www.youtube.com/christophernolan",
      icon: <Youtube size={18} />,
      color: "bg-[#FF0000] hover:bg-[#CC0000]",
    },
  ]

  // Animation variants
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="bg-[#282828] rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-4">Social Media</h3>

      <motion.div className="grid grid-cols-2 gap-2" variants={containerVariants} initial="hidden" animate="visible">
        {socialLinks.map((link) => (
          <motion.div key={link.id} variants={itemVariants}>
            <Button variant="outline" className={`w-full justify-start ${link.color}`} asChild>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <span className="mr-2">{link.icon}</span>
                {link.platform}
              </a>
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Last verified: May 2023</p>
      </div>
    </div>
  )
}
