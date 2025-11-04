"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Twitter, Mail, Heart } from "lucide-react"
import { BetaBadge } from "@/components/ui/beta-badge"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const appVersion = process.env.NEXT_PUBLIC_VERSION || "0.1.0-beta"
  const isBeta = process.env.NEXT_PUBLIC_BETA_VERSION === "true"

  const footerLinks = {
    product: [
      { label: "Movies", href: "/movies" },
      { label: "TV Shows", href: "/tv-shows" },
      { label: "People", href: "/people" },
      { label: "Critics", href: "/critics" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
    social: [
      { label: "Twitter", href: "https://twitter.com/moviemadders", icon: Twitter },
      { label: "GitHub", href: "https://github.com/moviemadders", icon: Github },
      { label: "Email", href: "mailto:hello@moviemadders.com", icon: Mail },
    ],
  }

  return (
    <footer className="hidden md:block bg-[#0A0A0A] border-t border-[#1A1A1A] mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-2xl font-bold text-white">Movie Madders</h3>
              <BetaBadge variant="minimal" />
            </div>
            <p className="text-[#A0A0A0] text-sm mb-4 max-w-md">
              Your ultimate movie discovery platform. Discover, review, and share your favorite movies with fellow film
              enthusiasts.
            </p>
            {isBeta && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mb-4">
                <p className="text-xs text-orange-400">
                  <strong>BETA VERSION:</strong> Movie Madders is currently in beta. Features and functionality may
                  change. Thank you for being an early adopter!
                </p>
              </div>
            )}
            <div className="flex items-center gap-4">
              {footerLinks.social.map((link) => {
                const Icon = link.icon
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[#A0A0A0] hover:text-white transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#A0A0A0] hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#A0A0A0] hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#A0A0A0] hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1A1A1A]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
              <span>© {currentYear} Movie Madders. All rights reserved.</span>
              {isBeta && <span className="text-orange-400">• {appVersion}</span>}
            </div>
            <div className="flex items-center gap-1 text-sm text-[#A0A0A0]">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by the Movie Madders Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

