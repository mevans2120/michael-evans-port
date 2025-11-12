'use client'

import React, { useState } from 'react'

/**
 * Contact Section - Concept 2B: Reversed Layout
 *
 * Header on the right, text links on the left
 */

export default function ContactConceptReversedLayout() {
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
    <section className="w-full max-w-5xl mx-auto px-6 py-20 md:py-32">
      <div className="flex flex-col md:flex-row gap-12 md:gap-16">
        {/* Left: Header */}
        <div className="md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4 leading-tight">
            Get in touch
          </h2>
          <p className="text-lg text-muted-foreground">
            I'm currently available for new projects and collaborations.
          </p>
        </div>

        {/* Right: Email Links */}
        <div className="md:w-1/2 space-y-4">
          {/* Gmail Link */}
          <a
            href="#"
            onClick={handleGmailClick}
            className="block text-lg font-sans text-foreground hover:text-accent transition-colors duration-normal underline decoration-transparent hover:decoration-accent underline-offset-4"
            aria-label="Email via Gmail"
          >
            Email via Gmail
          </a>

          {/* Outlook Link */}
          <a
            href="#"
            onClick={handleOutlookClick}
            className="block text-lg font-sans text-foreground hover:text-accent transition-colors duration-normal underline decoration-transparent hover:decoration-accent underline-offset-4"
            aria-label="Email via Outlook"
          >
            Email via Outlook
          </a>

          {/* Copy Email Link */}
          <button
            onClick={handleCopyEmail}
            className="block text-lg font-sans text-foreground hover:text-accent transition-colors duration-normal underline decoration-transparent hover:decoration-accent underline-offset-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            aria-label="Copy email address"
          >
            {copied ? 'Email copied!' : 'Copy email address'}
          </button>

          {/* Response Time Note */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              I typically respond within 24-48 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
