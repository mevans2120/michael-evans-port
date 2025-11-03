// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    useCdn: false,
    stega: {
      enabled: true,
      studioUrl: process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/studio`
        : '/studio',
    },
  }),
  serverToken: process.env.SANITY_AUTH_TOKEN,
  browserToken: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
