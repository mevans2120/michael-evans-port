'use client'

import React, { useState } from 'react'

/**
 * Contact Section - Concept 3: Icon-Driven Cards
 *
 * Approach: Visual card grid with icons and descriptions
 * - Card-based layout with hover states
 * - Icons add visual interest and brand recognition
 * - Descriptive text helps users choose
 * - Feels more tactile and interactive
 *
 * Strengths:
 * - High visual interest and engagement
 * - Icons provide immediate recognition (Gmail/Outlook logos)
 * - Descriptions reduce uncertainty ("Which should I use?")
 * - Card hover states feel satisfying and clickable
 * - Works well on mobile (stacks naturally)
 *
 * Tradeoffs:
 * - Takes more vertical space
 * - More visual weight than minimal approaches
 * - Requires more design elements (icons, cards)
 */

export default function ContactConceptCards() {
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
    <section className="w-full max-w-5xl mx-auto px-6 py-20 md:py-32">
      {/* Header */}
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-foreground mb-6">
          Ready to collaborate?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground">
          Choose how you'd like to reach out. I respond to all inquiries within 24-48 hours.
        </p>
      </div>

      {/* Email Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Gmail Card */}
        <button
          onClick={handleGmailClick}
          className="group relative p-8 bg-card border border-border rounded-2xl
                     text-left transition-all duration-normal
                     hover:border-accent hover:shadow-card hover:-translate-y-1
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label="Email via Gmail"
        >
          {/* Icon */}
          <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center
                          group-hover:from-accent/20 group-hover:to-accent/10 transition-all duration-normal">
            <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
            </svg>
          </div>

          {/* Content */}
          <h3 className="text-2xl font-serif font-light text-foreground mb-2 group-hover:text-accent transition-colors duration-normal">
            Email via Gmail
          </h3>
          <p className="text-muted-foreground mb-4">
            Opens a new email in Gmail. Best for personal or Google Workspace accounts.
          </p>

          {/* Arrow Indicator */}
          <div className="flex items-center text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-normal">
            <span className="text-sm font-sans">Open Gmail</span>
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-normal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Outlook Card */}
        <button
          onClick={handleOutlookClick}
          className="group relative p-8 bg-card border border-border rounded-2xl
                     text-left transition-all duration-normal
                     hover:border-accent hover:shadow-card hover:-translate-y-1
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label="Email via Outlook"
        >
          {/* Icon */}
          <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center
                          group-hover:from-accent/20 group-hover:to-accent/10 transition-all duration-normal">
            <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V10.85l1.24.72h.01q.1.07.18.18.07.12.07.25zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3.05-1.83zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73zM9 3.75V6h2l.13.01.12.04v-2.3zM5.98 15.98q.9 0 1.6-.3.7-.32 1.19-.86.48-.55.73-1.28.25-.74.25-1.61 0-.83-.25-1.55-.24-.71-.71-1.24t-1.15-.83q-.68-.3-1.55-.3-.92 0-1.64.3-.71.3-1.2.85-.5.54-.75 1.3-.25.74-.25 1.63 0 .85.26 1.56.26.72.74 1.23.48.52 1.17.81.69.3 1.56.3zM7.5 21h12.39L12 16.08V17q0 .41-.3.7-.29.3-.7.3H7.5zm15-.13v-7.24l-5.9 3.54Z"/>
            </svg>
          </div>

          {/* Content */}
          <h3 className="text-2xl font-serif font-light text-foreground mb-2 group-hover:text-accent transition-colors duration-normal">
            Email via Outlook
          </h3>
          <p className="text-muted-foreground mb-4">
            Opens a new email in Outlook.com. Best for Outlook or Hotmail accounts.
          </p>

          {/* Arrow Indicator */}
          <div className="flex items-center text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-normal">
            <span className="text-sm font-sans">Open Outlook</span>
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-normal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Copy Email Card - Full Width */}
      <button
        onClick={handleCopyEmail}
        className="group relative w-full p-6 bg-card border border-border rounded-2xl
                   flex items-center justify-between transition-all duration-normal
                   hover:border-accent hover:shadow-card
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        aria-label="Copy email address"
      >
        <div className="flex items-center">
          {/* Icon */}
          <div className="w-12 h-12 mr-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center
                          group-hover:from-accent/20 group-hover:to-accent/10 transition-all duration-normal">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {copied ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              )}
            </svg>
          </div>

          {/* Content */}
          <div className="text-left">
            <h3 className="text-xl font-serif font-light text-foreground mb-1 group-hover:text-accent transition-colors duration-normal">
              {copied ? 'Email address copied!' : 'Copy email address'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {email}
            </p>
          </div>
        </div>

        {/* Arrow */}
        <svg className="w-5 h-5 text-accent transform group-hover:translate-x-1 transition-transform duration-normal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Fallback mailto Link */}
      <div className="mt-10 pt-10 border-t border-border text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Using a different email client?
        </p>
        <a
          href={`mailto:${email}?subject=Project Inquiry`}
          className="inline-flex items-center text-accent hover:text-accent-light
                     underline decoration-accent/30 hover:decoration-accent-light/50
                     underline-offset-4 transition-all duration-normal"
        >
          <span>Open in default mail app</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </section>
  )
}
