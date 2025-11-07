import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/sanity/lib/client'

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    token: process.env.SANITY_AUTH_TOKEN,
    useCdn: false, // Must be false for draft mode to work without delays
    perspective: 'previewDrafts', // See both published and draft documents
  }),
})
