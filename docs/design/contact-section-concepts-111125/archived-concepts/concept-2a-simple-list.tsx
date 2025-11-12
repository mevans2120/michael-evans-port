'use client'

import React, { useState } from 'react'

/**
 * Contact Section - Concept 2A: Simple Text List
 *
 * Simplified version with smaller text, minimal ornament
 */

export default function ContactConceptSimpleList() {
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
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4 leading-tight">
          Get in touch
        </h2>
        <p className="text-lg text-muted-foreground">
          I'm currently available for new projects and collaborations.
        </p>
      </div>

      {/* Email Provider Links - Simple List */}
      <div className="space-y-4">
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
      </div>

      {/* Response Time Note */}
      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          I typically respond within 24-48 hours
        </p>
      </div>
    </section>
  )
}
