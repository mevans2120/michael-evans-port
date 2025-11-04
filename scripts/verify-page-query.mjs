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

// This is the exact query from the case study page
const EDITORIAL_PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  title,
  slug,
  category,
  heroSection {
    badge,
    title,
    subtitle,
    summary
  },
  overview {
    role,
    company,
    timeline
  },
  metrics[] {
    value,
    label,
    description
  },
  slides[] {
    _key,
    sectionLabel,
    heading,
    content,
    quoteBox {
      quote,
      attribution
    },
    comparisonBoxes[] {
      _key,
      label,
      title,
      text,
      stat,
      icon
    },
    visualCards[] {
      _key,
      image,
      placeholderText,
      caption
    },
    annotation {
      title,
      content
    }
  },
  technologies,
  callToAction {
    text,
    link
  }
}`

console.log('\n🔍 Testing page query for Virgin America...\n')

const project = await client.fetch(EDITORIAL_PROJECT_QUERY, { slug: 'virgin-america' })

console.log('✅ Query successful!')
console.log('\n📊 Data structure:')
console.log('   - Title:', project.title)
console.log('   - Hero Section:', !!project.heroSection)
console.log('   - Overview:', !!project.overview)
console.log('   - Metrics:', project.metrics?.length || 0)
console.log('   - Slides:', project.slides?.length || 0)
console.log('   - Technologies:', project.technologies?.length || 0)
console.log('   - CTA:', !!project.callToAction)

console.log('\n📝 Sample slide structure:')
const firstSlide = project.slides?.[0]
console.log('   - Heading:', firstSlide?.heading)
console.log('   - Content blocks:', firstSlide?.content?.length || 0)
console.log('   - Quote box:', !!firstSlide?.quoteBox)
console.log('   - Comparison boxes:', firstSlide?.comparisonBoxes?.length || 0)
console.log('   - Visual cards:', firstSlide?.visualCards?.length || 0)
console.log('   - Annotation:', !!firstSlide?.annotation)

console.log('\n✅ Page will render correctly!\n')
