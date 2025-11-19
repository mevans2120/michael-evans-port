'use client'

import React, { useState } from 'react'
import type { ContactPageData } from '@/types/sanity'
import ContactForm from '@/components/ContactForm'

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

  return (
    <section className="w-full min-h-[calc(100vh-80px)] flex items-center py-12">
      <div className="w-full max-w-2xl mx-auto px-6">
        <div className="flex flex-col gap-12">
          {/* Header & Info */}
          <div className="space-y-6 text-left">
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-light text-foreground mb-6 leading-tight">
                <span className="text-gradient">Contact</span>
              </h1>
              <p className="text-lg font-serif text-muted-foreground max-w-md">
                {data.subheading}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 md:p-8 shadow-sm">
            <ContactForm formStrings={data.form} />
          </div>

          {/* Copy Email Link & Response Time Note */}
          <div className="space-y-8">
            <div className="pt-8 border-t border-border flex justify-start">
              <button
                onClick={handleCopyEmail}
                className="text-lg font-serif text-foreground hover:text-accent transition-colors duration-normal underline decoration-transparent hover:decoration-accent underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
                aria-label={copied ? data.copiedConfirmationText : data.copyEmailLinkText}
              >
                {copied ? data.copiedConfirmationText : data.copyEmailLinkText}
              </button>
            </div>

            <div className="text-left">
              <p className="text-sm font-serif text-muted-foreground">
                {data.responseTimeNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
