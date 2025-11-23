import React from 'react'
import { type Metadata } from 'next'
import ContactSection from '@/components/ContactSection'
import { sanityFetch } from '@/sanity/lib/live'
import { contactPageQuery } from '@/lib/sanity/queries'
import type { ContactPageData } from '@/types/sanity'

export async function generateMetadata(): Promise<Metadata> {
  const { data }: { data: ContactPageData | null } = await sanityFetch({ query: contactPageQuery })

  if (!data) {
    return {
      title: 'Contact',
      description: 'Get in touch'
    }
  }

  return {
    title: data.seo.title,
    description: data.seo.description,
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      type: 'website'
    }
  }
}

export default async function ContactPage() {
  const { data }: { data: ContactPageData | null } = await sanityFetch({ query: contactPageQuery })

  if (!data) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Contact page content not found.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <ContactSection data={data} />
    </main>
  )
}
