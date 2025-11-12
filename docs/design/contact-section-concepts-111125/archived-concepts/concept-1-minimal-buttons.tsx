'use client'

import React, { useState } from 'react'

/**
 * Contact Section - Concept 1: Minimal Buttons
 *
 * Approach: Clean, minimal button group with subtle styling
 * - Quiet, understated design that doesn't compete with content
 * - Buttons use border only, no fills (ghost button style)
 * - Small, compact size for elegance
 * - Purple accent on hover (ties to design system)
 *
 * Strengths:
 * - Professional, refined aesthetic
 * - Feels premium and considered
 * - Low visual weight - doesn't dominate the page
 * - Clear hierarchy (primary actions first, fallback last)
 *
 * Tradeoffs:
 * - Buttons may feel less clickable due to minimal styling
 * - Requires good contrast to be noticed
 * - Less visual interest than bolder approaches
 */

export default function ContactConceptMinimal() {
  const [copied, setCopied] = useState(false)
  const email = "michael@example.com"

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGmailClick = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${email}&su=Project Inquiry`
    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
  }

  const handleOutlookClick = () => {
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=Project Inquiry`
    window.open(outlookUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-20 md:py-32">
      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4">
          Let's work together
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          I'm currently available for new projects and collaborations. Choose your preferred email provider to get in touch.
        </p>
      </div>

      {/* Email Provider Buttons - Minimal Style */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {/* Gmail Button */}
        <button
          onClick={handleGmailClick}
          className="px-6 py-2.5 border border-border rounded-lg
                     text-sm font-sans text-foreground
                     transition-all duration-normal
                     hover:border-accent hover:text-accent hover:bg-accent/5
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label="Email via Gmail"
        >
          Gmail
        </button>

        {/* Outlook Button */}
        <button
          onClick={handleOutlookClick}
          className="px-6 py-2.5 border border-border rounded-lg
                     text-sm font-sans text-foreground
                     transition-all duration-normal
                     hover:border-accent hover:text-accent hover:bg-accent/5
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label="Email via Outlook"
        >
          Outlook
        </button>

        {/* Copy Email Button */}
        <button
          onClick={handleCopyEmail}
          className="px-6 py-2.5 border border-border rounded-lg
                     text-sm font-sans text-foreground
                     transition-all duration-normal
                     hover:border-accent hover:text-accent hover:bg-accent/5
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label="Copy email address"
        >
          {copied ? 'Copied!' : 'Copy Email'}
        </button>
      </div>

      {/* Fallback mailto Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Prefer a different email client?
        </p>
        <a
          href={`mailto:${email}?subject=Project Inquiry`}
          className="text-sm text-accent hover:text-accent-light transition-colors duration-normal underline decoration-accent/30 hover:decoration-accent-light/50 underline-offset-4"
        >
          Open in default mail app
        </a>
      </div>

      {/* Visual Separator */}
      <div className="mt-16 pt-16 border-t border-border">
        <p className="text-center text-xs text-muted-foreground">
          Response time: Usually within 24-48 hours
        </p>
      </div>
    </section>
  )
}
