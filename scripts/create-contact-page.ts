/**
 * Script to create the Contact Page document in Sanity CMS
 *
 * Usage:
 *   npx tsx scripts/create-contact-page.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
})

const contactPageData = {
  _id: 'contactPage',
  _type: 'contactPage',
  heading: 'Get in touch',
  subheading: 'I\'d love to hear about your project or opportunity. Whether you\'re looking for product leadership, UX strategy, or AI/ML expertise, let\'s start a conversation.',
  email: 'michael@m-evans.com',
  emailSubject: 'Project Inquiry',
  gmailLinkText: 'Email via Gmail',
  outlookLinkText: 'Email via Outlook',
  copyEmailLinkText: 'Copy email address',
  copiedConfirmationText: 'Email copied!',
  responseTimeNote: 'I typically respond within 24-48 hours',
  seo: {
    title: 'Contact | Michael Evans',
    description: 'Get in touch with Michael Evans for product management, UX strategy, and AI/ML expertise. Let\'s discuss your next project or opportunity.',
  },
}

async function createContactPage() {
  try {
    console.log('Creating Contact Page document in Sanity...')

    // Check if document already exists
    const existing = await client.fetch(`*[_id == "contactPage"][0]`)

    if (existing) {
      console.log('Contact Page document already exists. Updating...')
      const result = await client
        .patch('contactPage')
        .set(contactPageData)
        .commit()

      console.log('✓ Contact Page updated successfully!')
      console.log('Document ID:', result._id)
    } else {
      console.log('Creating new Contact Page document...')
      const result = await client.create(contactPageData)

      console.log('✓ Contact Page created successfully!')
      console.log('Document ID:', result._id)
    }

    console.log('\nYou can now:')
    console.log('1. View it in Sanity Studio: http://localhost:3000/studio/structure/contactPage')
    console.log('2. See it live on the site: http://localhost:3000/contact')

  } catch (error) {
    console.error('Error creating Contact Page:', error)
    process.exit(1)
  }
}

// Run the script
createContactPage()
