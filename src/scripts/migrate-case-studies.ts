/**
 * Case Study Migration Script
 *
 * Migrates case study content specs from markdown to Sanity CMS
 * Creates new documents (doesn't update existing ones)
 * Uses placeholder images from Unsplash
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

// Initialize Sanity client with write token
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

// Placeholder images by theme
const PLACEHOLDER_IMAGES = {
  'virgin-america': {
    theme: 'airport/aviation',
    urls: [
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05', // Airport terminal
      'https://images.unsplash.com/photo-1488085061387-422e29b40080', // Airplane wing
      'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e', // Airport lounge
      'https://images.unsplash.com/photo-1569043034183-4e10e6cf7f10', // Modern airport
    ],
  },
  'before-launcher': {
    theme: 'mobile/focus',
    urls: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', // Phone in hand
      'https://images.unsplash.com/photo-1551650975-87deedd944c3', // Minimal phone
      'https://images.unsplash.com/photo-1556656793-08538906a9f8', // Smartphone focus
      'https://images.unsplash.com/photo-1563770660941-20978e870e26', // Mobile interface
    ],
  },
  'casa-bonita': {
    theme: 'restaurant/dining',
    urls: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', // Restaurant interior
      'https://images.unsplash.com/photo-1559339352-11d035aa65de', // Dining hall
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5', // Restaurant seating
      'https://images.unsplash.com/photo-1544148103-0773bf10d330', // Mexican food
    ],
  },
  'target': {
    theme: 'retail/shopping',
    urls: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8', // Retail store
      'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d', // Shopping interior
      'https://images.unsplash.com/photo-1573855619003-97b4799dcd8b', // Retail display
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc', // Store aisle
    ],
  },
  'peddle': {
    theme: 'automotive',
    urls: [
      'https://images.unsplash.com/photo-1485291571150-772bcfc10da5', // Car dashboard
      'https://images.unsplash.com/photo-1552519507-d49f768ca5d4', // Modern car
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d', // Car keys
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741', // Car selling
    ],
  },
};

interface CaseStudySpec {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  featured: boolean;
  order: number;
  role: string;
  company: string;
  timeline: string;
  publishedAt: string;
  metrics: Array<{ label: string; value: string; description?: string }>;
  achievements: string[];
  technologies: string[];
  sections: Array<{
    sectionLabel?: string;
    heading: string;
    content: string;
    annotation?: {
      title?: string;
      content?: string;
    };
  }>;
  featuredCategory?: string;
  featuredMetric?: string;
  featuredDescription?: string;
}

/**
 * Parse a content spec markdown file
 */
function parseContentSpec(filePath: string): CaseStudySpec | null {
  const content = fs.readFileSync(filePath, 'utf-8');
  const slug = path.basename(filePath, '-case-study.md');

  console.log(`\n📄 Parsing ${slug}...`);

  try {
    // Extract metadata section
    const metadataMatch = content.match(/## Metadata\s+([\s\S]*?)(?=\n##|$)/);
    if (!metadataMatch) {
      console.error('  ❌ No metadata section found');
      return null;
    }

    const metadata = metadataMatch[1];

    // Parse metadata fields
    const getMetadataValue = (field: string): string => {
      const match = metadata.match(new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+)`));
      return match ? match[1].trim() : '';
    };

    const title = getMetadataValue('Title');
    const category = 'case-study';
    const featured = getMetadataValue('Featured')?.toLowerCase() === 'yes';
    const order = parseInt(getMetadataValue('Order')) || 1;
    const role = getMetadataValue('Role');
    const company = getMetadataValue('Company');
    const timeline = getMetadataValue('Timeline');
    const publishedAt = getMetadataValue('Published At');

    // Extract hero section
    const heroMatch = content.match(/## Hero Section\s+([\s\S]*?)(?=\n##)/);
    const heroContent = heroMatch?.[1] || '';

    const getHeroValue = (field: string): string => {
      const match = heroContent.match(new RegExp(`### ${field}\\s+([\\s\\S]*?)(?=\\n###|$)`));
      return match ? match[1].trim() : '';
    };

    const subtitle = getHeroValue('Tagline');
    const description = getHeroValue('Summary \\(2-3 sentences\\)');

    // Extract JSON blocks for metrics, achievements, technologies
    const extractJSON = (section: string): any => {
      const match = content.match(new RegExp(`## ${section}[\\s\\S]*?\`\`\`json\\s+([\\s\\S]*?)\`\`\``));
      if (!match) return section === 'Key Metrics' ? [] : [];
      try {
        const parsed = JSON.parse(match[1]);
        return parsed.metrics || parsed.achievements || parsed.technologies || [];
      } catch (e) {
        console.warn(`  ⚠️  Failed to parse ${section} JSON`);
        return [];
      }
    };

    const metrics = extractJSON('Key Metrics');
    const achievements = extractJSON('Key Achievements');
    const technologies = extractJSON('Technologies Used');

    // Extract content sections
    const sections: any[] = [];
    const sectionMatches = content.matchAll(/### Section \d+:([^\n]+)\s+\*\*Heading:\*\* ([^\n]+)\s+\*\*Content:\*\*\s+([\s\S]*?)(?=\n### Section|---\n\n##)/g);

    for (const match of sectionMatches) {
      const sectionLabel = match[1].trim();
      const heading = match[2].trim();
      const sectionContent = match[3].trim();

      sections.push({
        sectionLabel,
        heading,
        content: sectionContent,
      });
    }

    console.log(`  ✅ Parsed successfully (${sections.length} sections)`);

    return {
      slug,
      title,
      subtitle,
      description,
      category,
      featured,
      order,
      role,
      company,
      timeline,
      publishedAt,
      metrics,
      achievements,
      technologies,
      sections,
    };
  } catch (error) {
    console.error(`  ❌ Error parsing:`, error);
    return null;
  }
}

/**
 * Convert markdown content to Sanity portable text blocks
 */
function markdownToPortableText(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.split('\n');
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim();
      if (text) {
        blocks.push({
          _type: 'block',
          _key: `block-${Date.now()}-${Math.random()}`,
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: `span-${Date.now()}-${Math.random()}`,
              text,
              marks: [],
            },
          ],
          markDefs: [],
        });
      }
      currentParagraph = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line - flush paragraph
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    // Heading
    if (trimmed.startsWith('#')) {
      flushParagraph();
      const level = trimmed.match(/^#+/)?.[0].length || 2;
      const text = trimmed.replace(/^#+\s*/, '');
      const style = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4';

      blocks.push({
        _type: 'block',
        _key: `block-${Date.now()}-${Math.random()}`,
        style,
        children: [
          {
            _type: 'span',
            _key: `span-${Date.now()}-${Math.random()}`,
            text,
            marks: [],
          },
        ],
        markDefs: [],
      });
      continue;
    }

    // List item
    if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
      flushParagraph();
      const text = trimmed.replace(/^[-*]\s*|^\d+\.\s*/, '');
      const listType = /^\d+\./.test(trimmed) ? 'number' : 'bullet';

      blocks.push({
        _type: 'block',
        _key: `block-${Date.now()}-${Math.random()}`,
        style: 'normal',
        listItem: listType,
        children: [
          {
            _type: 'span',
            _key: `span-${Date.now()}-${Math.random()}`,
            text,
            marks: [],
          },
        ],
        markDefs: [],
      });
      continue;
    }

    // Regular text - add to current paragraph
    currentParagraph.push(trimmed);
  }

  // Flush any remaining paragraph
  flushParagraph();

  return blocks;
}

/**
 * Get placeholder image URLs for a case study
 */
function getPlaceholderImages(slug: string): string[] {
  return PLACEHOLDER_IMAGES[slug as keyof typeof PLACEHOLDER_IMAGES]?.urls || PLACEHOLDER_IMAGES['virgin-america'].urls;
}

/**
 * Create a Sanity document for a case study
 */
async function createCaseStudy(spec: CaseStudySpec) {
  console.log(`\n🚀 Creating case study: ${spec.title}`);

  const placeholderImages = getPlaceholderImages(spec.slug);

  // Build sections with placeholder screenshots
  const sections = spec.sections.map((section, index) => {
    const screenshots: any[] = [];

    // Add 2-3 placeholder screenshots per section
    const numScreenshots = index % 2 === 0 ? 2 : 3;
    for (let i = 0; i < numScreenshots; i++) {
      const imageUrl = placeholderImages[i % placeholderImages.length];
      screenshots.push({
        _type: 'screenshot',
        _key: `screenshot-${index}-${i}`,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: `image-placeholder-${index}-${i}`, // This is a placeholder - will need actual upload
          },
        },
        caption: `Placeholder screenshot ${i + 1}`,
        layout: i === 0 ? 'large' : 'grid',
      });
    }

    return {
      _type: 'caseStudySection',
      _key: `section-${index}`,
      sectionLabel: section.sectionLabel,
      heading: section.heading,
      content: markdownToPortableText(section.content),
      screenshots,
      ...(section.annotation && {
        annotation: {
          _type: 'object',
          title: section.annotation.title,
          content: section.annotation.content,
        },
      }),
    };
  });

  // Build the full document
  const document = {
    _type: 'project',
    title: spec.title,
    slug: {
      _type: 'slug',
      current: spec.slug,
    },
    category: spec.category,
    summary: spec.subtitle,
    description: spec.description,
    featured: spec.featured,
    order: spec.order,
    metrics: spec.metrics.map((m, i) => ({
      _key: `metric-${i}`,
      label: m.label,
      value: m.value,
      description: m.description,
    })),
    achievements: spec.achievements,
    technologies: spec.technologies,
    overview: {
      _type: 'object',
      role: spec.role,
      company: spec.company,
      timeline: spec.timeline,
    },
    sections,
    publishedAt: spec.publishedAt ? new Date(spec.publishedAt).toISOString() : new Date().toISOString(),
  };

  try {
    const result = await client.create(document);
    console.log(`  ✅ Created successfully! Document ID: ${result._id}`);
    return result;
  } catch (error) {
    console.error(`  ❌ Failed to create:`, error);
    throw error;
  }
}

/**
 * Main migration function
 */
async function migrate(caseStudySlugs?: string[]) {
  console.log('🎯 Case Study Migration Script\n');
  console.log('================================\n');

  const contentSpecsDir = path.join(process.cwd(), 'docs', 'content-specs');

  // Define all case studies to migrate
  const allCaseStudies = [
    'virgin-america',
    'before-launcher',
    'casa-bonita',
    'target',
    'peddle',
  ];

  const toMigrate = caseStudySlugs || allCaseStudies;
  const results: any[] = [];

  for (const slug of toMigrate) {
    const specPath = path.join(contentSpecsDir, `${slug}-case-study.md`);

    if (!fs.existsSync(specPath)) {
      console.error(`❌ Content spec not found: ${specPath}`);
      continue;
    }

    const spec = parseContentSpec(specPath);
    if (!spec) {
      console.error(`❌ Failed to parse spec for ${slug}`);
      continue;
    }

    try {
      const result = await createCaseStudy(spec);
      results.push({ slug, success: true, documentId: result._id });
    } catch (error) {
      results.push({ slug, success: false, error });
    }
  }

  // Summary
  console.log('\n================================');
  console.log('📊 Migration Summary\n');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}`);
  successful.forEach(r => {
    console.log(`   - ${r.slug}: ${r.documentId}`);
  });

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}`);
    failed.forEach(r => {
      console.log(`   - ${r.slug}`);
    });
  }

  console.log('\n🎉 Migration complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Open Sanity Studio at http://localhost:3000/studio');
  console.log('   2. Review the created case studies');
  console.log('   3. Replace placeholder images with real images');
  console.log('   4. Delete any duplicate/old case studies if needed');
}

// Run the migration
const args = process.argv.slice(2);
migrate(args.length > 0 ? args : undefined).catch(console.error);
