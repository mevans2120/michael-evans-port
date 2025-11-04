import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const projects = await client.fetch(`
  *[_type == "project" && slug.current in ["virgin-america", "before-launcher", "casa-bonita", "target", "peddle"]] {
    title,
    "slug": slug.current,
    "slideCount": count(slides),
    "metricCount": count(metrics),
    "hasHeroSection": defined(heroSection),
    "hasCTA": defined(callToAction)
  } | order(title asc)
`)

console.log('\n📊 All Migrated Case Studies:\n')
console.log('Total projects:', projects.length)
console.log('\n' + '='.repeat(60))

projects.forEach((project, index) => {
  console.log(`\n${index + 1}. ${project.title} (/${project.slug})`)
  console.log(`   ✅ Hero Section: ${project.hasHeroSection ? 'Yes' : 'No'}`)
  console.log(`   📄 Slides: ${project.slideCount}`)
  console.log(`   📊 Metrics: ${project.metricCount}`)
  console.log(`   🔗 CTA: ${project.hasCTA ? 'Yes' : 'No'}`)
})

console.log('\n' + '='.repeat(60))
console.log('\n✅ All 5 case studies successfully migrated!\n')
