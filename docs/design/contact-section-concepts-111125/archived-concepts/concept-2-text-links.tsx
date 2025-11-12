'use client'

import React, { useState } from 'react'

/**
 * Contact Section - Concept 2: Text Links
 *
 * Approach: Editorial, magazine-style link treatment
 * - Large, readable text links (not buttons)
 * - Underline-on-hover interaction pattern
 * - Typography-focused, minimal visual noise
 * - Feels like a refined article or publication
 *
 * Strengths:
 * - Very clean, editorial aesthetic
 * - Excellent readability and scannability
 * - Low cognitive load - just text, no buttons to process
 * - Feels sophisticated and content-focused
 * - Fast to scan and comprehend
 *
 * Tradeoffs:
 * - May feel less "clickable" than buttons
 * - Relies on underlines/color to signal interactivity
 * - Less visual hierarchy between options
 */

export default function ContactConceptLinks() {
  const [copied, setCopied] = useState(false)
  const email = "michael@example.com"

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGmailClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${email}&su=Project Inquiry`
    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
  }

  const handleOutlookClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=Project Inquiry`
    window.open(outlookUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="w-full max-w-2xl mx-auto px-6 py-20 md:py-32">
      {/* Header */}
      <div className="mb-16">
        <h2 className="text-5xl md:text-6xl font-serif font-light text-foreground mb-6 leading-tight">
          Get in touch
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
          I'm currently available for new projects and collaborations.
        </p>
      </div>

      {/* Email Provider Links - Large Text Style */}
      <div className="space-y-6 mb-12">
        {/* Gmail Link */}
        <div className="border-b border-border pb-6">
          <a
            href="#"
            onClick={handleGmailClick}
            className="group flex items-baseline justify-between
                       text-2xl md:text-3xl font-serif font-light text-foreground
                       transition-colors duration-normal
                       hover:text-accent"
            aria-label="Email via Gmail"
          >
            <span className="underline decoration-transparent group-hover:decoration-accent decoration-2 underline-offset-8 transition-all duration-normal">
              Email via Gmail
            </span>
            <span className="text-base text-muted-foreground group-hover:text-accent transition-colors duration-normal ml-4">
              →
            </span>
          </a>
        </div>

        {/* Outlook Link */}
        <div className="border-b border-border pb-6">
          <a
            href="#"
            onClick={handleOutlookClick}
            className="group flex items-baseline justify-between
                       text-2xl md:text-3xl font-serif font-light text-foreground
                       transition-colors duration-normal
                       hover:text-accent"
            aria-label="Email via Outlook"
          >
            <span className="underline decoration-transparent group-hover:decoration-accent decoration-2 underline-offset-8 transition-all duration-normal">
              Email via Outlook
            </span>
            <span className="text-base text-muted-foreground group-hover:text-accent transition-colors duration-normal ml-4">
              →
            </span>
          </a>
        </div>

        {/* Copy Email Link */}
        <div className="border-b border-border pb-6">
          <button
            onClick={handleCopyEmail}
            className="group flex items-baseline justify-between w-full text-left
                       text-2xl md:text-3xl font-serif font-light text-foreground
                       transition-colors duration-normal
                       hover:text-accent
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded"
            aria-label="Copy email address"
          >
            <span className="underline decoration-transparent group-hover:decoration-accent decoration-2 underline-offset-8 transition-all duration-normal">
              {copied ? 'Email copied!' : 'Copy email address'}
            </span>
            <span className="text-base text-muted-foreground group-hover:text-accent transition-colors duration-normal ml-4">
              {copied ? '✓' : '→'}
            </span>
          </button>
        </div>
      </div>

      {/* Fallback mailto Link - Smaller, Secondary */}
      <div className="pt-8 border-t border-border">
        <p className="text-muted-foreground mb-3">
          Prefer a different email client?
        </p>
        <a
          href={`mailto:${email}?subject=Project Inquiry`}
          className="inline-block text-lg text-accent hover:text-accent-light
                     underline decoration-accent/30 hover:decoration-accent-light/50
                     underline-offset-4 transition-all duration-normal"
        >
          Open in default mail app →
        </a>
      </div>

      {/* Response Time Note */}
      <div className="mt-16 pt-8">
        <p className="text-sm text-muted-foreground italic">
          I typically respond within 24-48 hours
        </p>
      </div>
    </section>
  )
}
