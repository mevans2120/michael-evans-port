#!/usr/bin/env tsx
/**
 * Debug script to check Sanity image data and URLs
 *
 * Usage:
 *   npm run debug:images
 *
 * This script will:
 * - Fetch all projects with images from Sanity
 * - Show which images are present/missing
 * - Generate and test image URLs
 * - Check if images are published or draft
 */

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity configuration
const projectId = '5n331bys'
const dataset = 'production'
const apiVersion = '2025-01-10'

// Create clients for both draft and published content
const publishedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published', // Only published content
  token: process.env.SANITY_API_READ_TOKEN, // Optional: add token for private datasets
})

const draftClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts', // Include drafts
  token: process.env.SANITY_API_READ_TOKEN,
})

const builder = imageUrlBuilder(publishedClient)

// Query to get all projects with their images
const QUERY = `*[_type == "project"] {
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  "featuredImage": featuredImage {
    asset,
    alt,
    "assetId": asset->_id,
    "url": asset->url,
    "uploadStatus": asset->uploadStatus
  },
  "articleImages": article[_type == "image"] {
    asset,
    alt,
    "assetId": asset->_id,
    "url": asset->url
  }
}`

interface ImageInfo {
  asset?: any
  alt?: string
  assetId?: string
  url?: string
  uploadStatus?: string
}

interface ProjectResult {
  _id: string
  _updatedAt: string
  title: string
  slug: string
  featuredImage?: ImageInfo
  articleImages?: ImageInfo[]
}

function generateImageUrl(imageRef: any): string | null {
  if (!imageRef?.asset) return null
  try {
    return builder.image(imageRef).width(800).url()
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
  }
}

async function checkImageAccessibility(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

async function debugImages() {
  console.log('🔍 Debugging Sanity Images\n')
  console.log('Project ID:', projectId)
  console.log('Dataset:', dataset)
  console.log('API Version:', apiVersion)
  console.log('\n' + '='.repeat(80) + '\n')

  try {
    // Fetch published content
    console.log('📚 Fetching PUBLISHED content...\n')
    const publishedProjects: ProjectResult[] = await publishedClient.fetch(QUERY)

    // Fetch draft content
    console.log('📝 Fetching DRAFT content...\n')
    const draftProjects: ProjectResult[] = await draftClient.fetch(QUERY)

    console.log(`Found ${publishedProjects.length} published projects`)
    console.log(`Found ${draftProjects.length} projects (including drafts)\n`)
    console.log('='.repeat(80) + '\n')

    // Compare and report
    for (const project of draftProjects) {
      const publishedVersion = publishedProjects.find(p => p._id === project._id)
      const isPublished = !!publishedVersion
      const isDraft = project._id.startsWith('drafts.')

      console.log(`\n📄 ${project.title} (${project.slug})`)
      console.log(`   Status: ${isDraft ? '🟡 DRAFT' : isPublished ? '✅ PUBLISHED' : '❌ UNPUBLISHED'}`)
      console.log(`   ID: ${project._id}`)
      console.log(`   Last updated: ${new Date(project._updatedAt).toLocaleString()}`)

      // Check featured image
      if (project.featuredImage?.asset) {
        const imageUrl = generateImageUrl(project.featuredImage)
        console.log('\n   🖼️  Featured Image:')
        console.log(`      Asset ID: ${project.featuredImage.assetId || 'N/A'}`)
        console.log(`      Alt text: ${project.featuredImage.alt || '(none)'}`)
        console.log(`      Upload status: ${project.featuredImage.uploadStatus || 'unknown'}`)

        if (imageUrl) {
          console.log(`      Generated URL: ${imageUrl}`)

          // Check if accessible
          const isAccessible = await checkImageAccessibility(imageUrl)
          console.log(`      Accessibility: ${isAccessible ? '✅ ACCESSIBLE' : '❌ NOT ACCESSIBLE'}`)
        } else {
          console.log('      ⚠️  Could not generate URL')
        }

        // Check if published version has same image
        if (publishedVersion?.featuredImage?.assetId !== project.featuredImage.assetId) {
          console.log('      ⚠️  WARNING: Published version has different image or no image!')
        }
      } else {
        console.log('\n   ℹ️  No featured image')
      }

      // Check article images
      if (project.articleImages && project.articleImages.length > 0) {
        console.log(`\n   📸 Article Images: ${project.articleImages.length} found`)

        for (let i = 0; i < Math.min(project.articleImages.length, 5); i++) {
          const img = project.articleImages[i]
          if (img.asset) {
            const imageUrl = generateImageUrl(img)
            console.log(`      ${i + 1}. Asset ID: ${img.assetId}`)
            console.log(`         URL: ${imageUrl || 'Could not generate'}`)

            if (imageUrl && typeof imageUrl === 'string') {
              const isAccessible = await checkImageAccessibility(imageUrl)
              console.log(`         Accessibility: ${isAccessible ? '✅ ACCESSIBLE' : '❌ NOT ACCESSIBLE'}`)
            }
          }
        }

        if (project.articleImages.length > 5) {
          console.log(`      ... and ${project.articleImages.length - 5} more`)
        }
      }

      console.log('\n' + '-'.repeat(80))
    }

    // Summary
    console.log('\n\n' + '='.repeat(80))
    console.log('📊 SUMMARY')
    console.log('='.repeat(80))

    const unpublishedProjects = draftProjects.filter(p =>
      !publishedProjects.find(pub => pub._id === p._id)
    )

    const projectsWithImages = draftProjects.filter(p => p.featuredImage?.asset)
    const publishedWithImages = publishedProjects.filter(p => p.featuredImage?.asset)

    console.log(`\nTotal projects (including drafts): ${draftProjects.length}`)
    console.log(`Published projects: ${publishedProjects.length}`)
    console.log(`Unpublished/draft projects: ${unpublishedProjects.length}`)
    console.log(`\nProjects with featured images (all): ${projectsWithImages.length}`)
    console.log(`Projects with featured images (published): ${publishedWithImages.length}`)

    if (unpublishedProjects.length > 0) {
      console.log('\n⚠️  UNPUBLISHED PROJECTS:')
      unpublishedProjects.forEach(p => {
        console.log(`   - ${p.title} (${p._id})`)
      })
      console.log('\n💡 TIP: Go to Sanity Studio and click "Publish" to make these visible in production')
    }

    console.log('\n✅ Debug complete!\n')

  } catch (error) {
    console.error('❌ Error fetching data from Sanity:')
    console.error(error)
    process.exit(1)
  }
}

// Run the debug script
debugImages()
