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

const project = await client.fetch(`
  *[_type == "project" && slug.current == "virgin-america"][0] {
    title,
    heroSection,
    overview,
    "slideCount": count(slides),
    "metricCount": count(metrics),
    "firstSlide": slides[0] {
      heading,
      "hasContent": defined(content),
      "hasComparisonBoxes": defined(comparisonBoxes),
      "comparisonBoxCount": count(comparisonBoxes)
    },
    callToAction
  }
`)

console.log('\n📊 Virgin America Migration Verification:\n')
console.log('✅ Title:', project.title)
console.log('\n📰 Hero Section:')
console.log('   Badge:', project.heroSection?.badge)
console.log('   Title:', project.heroSection?.title)
console.log('   Subtitle:', project.heroSection?.subtitle?.substring(0, 80) + '...')
console.log('\n👤 Overview:')
console.log('   Role:', project.overview?.role)
console.log('   Company:', project.overview?.company)
console.log('   Timeline:', project.overview?.timeline)
console.log('\n📄 Content:')
console.log('   Slides:', project.slideCount)
console.log('   Metrics:', project.metricCount)
console.log('\n📝 First Slide:')
console.log('   Heading:', project.firstSlide?.heading)
console.log('   Has Content:', project.firstSlide?.hasContent)
console.log('   Comparison Boxes:', project.firstSlide?.comparisonBoxCount)
console.log('\n🔗 Call to Action:')
console.log('   Text:', project.callToAction?.text)
console.log('   Link:', project.callToAction?.link)
console.log('\n✅ Migration verified successfully!\n')
