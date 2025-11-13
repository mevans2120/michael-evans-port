'use client'

import React, { useState } from 'react'
import type { ContactPageData } from '@/types/sanity'

interface ContactSectionProps {
  data: ContactPageData
}

export default function ContactSection({ data }: ContactSectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGmailClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${data.email}&su=${encodeURIComponent(data.emailSubject)}`
    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
  }

  const handleOutlookClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${data.email}&subject=${encodeURIComponent(data.emailSubject)}`
    window.open(outlookUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="w-full min-h-[calc(100vh-80px)] flex items-center">
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
        {/* Left: Header */}
        <div className="md:w-1/2">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-foreground mb-4 leading-tight">
            Get in <span className="text-gradient">touch</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {data.subheading}
          </p>
        </div>

        {/* Right: Email Links */}
        <div className="md:w-1/2 space-y-4">
          {/* Gmail Link */}
          <a
            href="#"
            onClick={handleGmailClick}
            className="block text-lg font-sans text-foreground hover:text-accent transition-colors duration-normal underline decoration-transparent hover:decoration-accent underline-offset-4"
            aria-label={data.gmailLinkText}
          >
            {data.gmailLinkText}
          </a>

          {/* Outlook Link */}
          <a
            href="#"
            onClick={handleOutlookClick}
            className="block text-lg font-sans text-foreground hover:text-accent transition-colors duration-normal underline decoration-transparent hover:decoration-accent underline-offset-4"
            aria-label={data.outlookLinkText}
          >
            {data.outlookLinkText}
          </a>

          {/* Copy Email Link */}
          <button
            onClick={handleCopyEmail}
            className="block text-lg font-sans text-foreground hover:text-accent transition-colors duration-normal underline decoration-transparent hover:decoration-accent underline-offset-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            aria-label={copied ? data.copiedConfirmationText : data.copyEmailLinkText}
          >
            {copied ? data.copiedConfirmationText : data.copyEmailLinkText}
          </button>

          {/* Response Time Note */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {data.responseTimeNote}
            </p>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
