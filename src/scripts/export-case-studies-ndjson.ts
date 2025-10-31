/**
 * Export Case Studies to NDJSON for Sanity CLI Import
 *
 * Generates NDJSON file that can be imported via:
 * sanity dataset import case-studies.ndjson production
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

    // Extract JSON blocks
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
          _key: uuidv4(),
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: uuidv4(),
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
        _key: uuidv4(),
        style,
        children: [
          {
            _type: 'span',
            _key: uuidv4(),
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
        _key: uuidv4(),
        style: 'normal',
        listItem: listType,
        children: [
          {
            _type: 'span',
            _key: uuidv4(),
            text,
            marks: [],
          },
        ],
        markDefs: [],
      });
      continue;
    }

    currentParagraph.push(trimmed);
  }

  flushParagraph();
  return blocks;
}

/**
 * Convert case study to NDJSON document
 */
function caseStudyToNDJSON(spec: CaseStudySpec): string {
  const docId = spec.slug;

  // Build sections
  const sections = spec.sections.map((section, index) => ({
    _type: 'caseStudySection',
    _key: uuidv4(),
    sectionLabel: section.sectionLabel,
    heading: section.heading,
    content: markdownToPortableText(section.content),
    ...(section.annotation && {
      annotation: {
        _type: 'object',
        title: section.annotation.title,
        content: section.annotation.content,
      },
    }),
  }));

  // Build the document
  const document = {
    _id: docId,
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
    metrics: spec.metrics.map((m) => ({
      _key: uuidv4(),
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

  return JSON.stringify(document);
}

/**
 * Main export function
 */
async function exportToNDJSON(caseStudySlugs?: string[]) {
  console.log('🎯 Case Study NDJSON Export\n');
  console.log('================================\n');

  const contentSpecsDir = path.join(process.cwd(), 'docs', 'content-specs');

  const allCaseStudies = [
    'before-launcher',
    'casa-bonita',
    'target',
    'peddle',
  ];

  const toExport = caseStudySlugs || allCaseStudies;
  const ndjsonLines: string[] = [];

  for (const slug of toExport) {
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

    const ndjsonLine = caseStudyToNDJSON(spec);
    ndjsonLines.push(ndjsonLine);
    console.log(`  ✅ Converted ${slug} to NDJSON`);
  }

  // Write to file
  const outputPath = path.join(process.cwd(), 'case-studies.ndjson');
  fs.writeFileSync(outputPath, ndjsonLines.join('\n'));

  console.log('\n================================');
  console.log('📊 Export Summary\n');
  console.log(`✅ Exported ${ndjsonLines.length} case studies`);
  console.log(`📁 Output file: ${outputPath}`);
  console.log('\n📝 Next steps:');
  console.log('   Run this command to import:');
  console.log(`   sanity dataset import case-studies.ndjson production --replace`);
  console.log('\n   Or without --replace to append:');
  console.log(`   sanity dataset import case-studies.ndjson production`);
}

// Run the export
const args = process.argv.slice(2);
exportToNDJSON(args.length > 0 ? args : undefined).catch(console.error);
