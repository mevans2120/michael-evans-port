/**
 * Export Profile Content to NDJSON for Sanity CLI Import
 *
 * Generates NDJSON file that can be imported via:
 * sanity dataset import profile-content.ndjson production --replace
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface QuickFact {
  label: string;
  value: string;
}

interface Capability {
  title: string;
  description: string;
  isNew: boolean;
}

interface Subsection {
  heading: string;
  content: string;
}

interface Section {
  heading: string;
  content: string;
  subsections?: Subsection[];
  visible: boolean;
}

interface SelectedProject {
  title: string;
  metric: string;
  description: string;
  order: number;
}

interface ProfileSpec {
  name: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroIntro: string;
  quickFacts: QuickFact[];
  capabilities: Capability[];
  sections: Section[];
  selectedProjects: SelectedProject[];
  availability: boolean;
  availabilityText: string;
  ctaText: string;
  ctaButtonText: string;
}

/**
 * Parse the profile content spec markdown file
 */
function parseContentSpec(filePath: string): ProfileSpec {
  const content = fs.readFileSync(filePath, 'utf-8');

  console.log('\n📄 Parsing profile content spec...\n');

  // Helper to extract content from start marker to next horizontal rule (---)
  const extractSectionToRule = (startMarker: string): string => {
    const regex = new RegExp(`${startMarker}[\\s\\S]*?\\n---`, 'i');
    const match = content.match(regex);
    if (!match) return '';
    // Remove the start marker and the ending ---
    const fullMatch = match[0];
    const withoutStart = fullMatch.replace(new RegExp(startMarker, 'i'), '');
    const withoutEnd = withoutStart.replace(/\n---$/, '');
    return withoutEnd.trim();
  };

  // Helper to extract content between two headings (for sections without ---)
  const extractSection = (startMarker: string, endMarker?: string): string => {
    const startRegex = new RegExp(`${startMarker}\\s*\\n+([\\s\\S]*?)(?=${endMarker || '\\n##'})`, 'i');
    const match = content.match(startRegex);
    return match ? match[1].trim() : '';
  };

  // Extract hero content
  const heroSection = extractSection('## Hero Section', '## Quick Facts');
  const headline = heroSection.match(/### Headline\s+([^\n]+)/)?.[1]?.trim() || 'Product Manager • UX Designer • AI Builder';
  const subheadline = heroSection.match(/### Subheadline\s+([^\n]+)/)?.[1]?.trim() || '20 years solving complex problems. Now building with AI.';
  const introMatch = heroSection.match(/### Brief Introduction.*?\n+([\s\S]*?)(?=\n---|$)/i);
  const intro = introMatch ? introMatch[1].trim() : '';

  console.log('✅ Extracted hero section');

  // Extract Quick Facts
  const quickFactsSection = extractSection('## Quick Facts', '## Core Sections');
  const quickFactsJSON = quickFactsSection.match(/```json\s+([\s\S]*?)\s+```/);
  const quickFacts: QuickFact[] = quickFactsJSON
    ? JSON.parse(quickFactsJSON[1]).facts
    : [];

  console.log(`✅ Extracted ${quickFacts.length} quick facts`);

  // Extract Capabilities (flatten from category structure)
  const capabilitiesSection = extractSection('## Capabilities Array', '## Technologies');
  const capabilitiesJSON = capabilitiesSection.match(/```json\s+([\s\S]*?)\s+```/);
  const capabilities: Capability[] = [];

  if (capabilitiesJSON) {
    const parsed = JSON.parse(capabilitiesJSON[1]);
    const capabilitiesData = parsed.capabilities || [];

    // Flatten category structure into individual capabilities
    capabilitiesData.forEach((cat: any) => {
      cat.skills.forEach((skill: string) => {
        capabilities.push({
          title: skill,
          description: `Part of ${cat.category}`,
          isNew: skill.toLowerCase().includes('ai') ||
                 skill.toLowerCase().includes('claude') ||
                 skill.toLowerCase().includes('llm') ||
                 skill.toLowerCase().includes('agentic')
        });
      });
    });
  }

  console.log(`✅ Extracted ${capabilities.length} capabilities`);

  // Extract Sections 1-10
  const sections: Section[] = [];

  // Section 1: Who I Am
  const section1Content = extractSection('### Section 1: Who I Am', '### Section 2');
  const section1Heading = section1Content.match(/\*\*Heading:\*\*\s*([^\n]+)/)?.[1]?.trim() || 'The 50,000-Foot View';
  const section1Text = section1Content.match(/\*\*Content:\*\*\s*([\s\S]*?)(?=\*\*What makes|---)/)?.[1]?.trim() || '';
  const section1WhatMakes = section1Content.match(/\*\*What makes me different:\*\*([\s\S]*)/)?.[1]?.trim() || '';

  sections.push({
    heading: section1Heading,
    content: section1Text + '\n\n' + section1WhatMakes,
    visible: true
  });

  // Section 2: Background
  const section2Content = extractSectionToRule('### Section 2: Background');
  const section2Heading = section2Content.match(/\*\*Heading:\*\*\s*([^\n]+)/)?.[1]?.trim() || 'From Yurts to Gigahertz';
  const section2Text = section2Content.match(/\*\*Content:\*\*\s*\n+([\s\S]*?)(?=\n\*\*20 Years)/)?.[1]?.trim() || '';

  // Extract subsections for section 2
  const section2Years = section2Content.match(/\*\*20 Years in Software:\*\*\s*\n+([\s\S]*?)(?=\n\*\*Career Highlights)/)?.[1]?.trim() || '';
  const section2Highlights = section2Content.match(/\*\*Career Highlights:\*\*\s*\n+([\s\S]*?)(?=\n\*\*The Thread)/)?.[1]?.trim() || '';
  const section2Thread = section2Content.match(/\*\*The Thread:\*\*\s*\n+([\s\S]*?)$/)?.[1]?.trim() || '';

  sections.push({
    heading: section2Heading,
    content: section2Text,
    subsections: [
      { heading: '20 Years in Software', content: section2Years },
      { heading: 'Career Highlights', content: section2Highlights },
      { heading: 'The Thread', content: section2Thread }
    ],
    visible: true
  });

  // Section 3: Three Things
  const section3Content = extractSectionToRule('### Section 3: Three Things');
  const section3Heading = section3Content.match(/\*\*Heading:\*\*\s*([^\n]+)/)?.[1]?.trim() || 'What I Bring';
  const section3Text = section3Content.match(/\*\*Content:\*\*\s*\n+([\s\S]*?)(?=\n\*\*1\.)/)?.[1]?.trim() || '';

  // Extract three subsections
  const thing1 = section3Content.match(/\*\*1\. Deep Technical Knowledge\*\*\s*\n+([\s\S]*?)(?=\n\*\*2\.)/)?.[1]?.trim() || '';
  const thing2 = section3Content.match(/\*\*2\. Big Picture Business View\*\*\s*\n+([\s\S]*?)(?=\n\*\*3\.)/)?.[1]?.trim() || '';
  const thing3All = section3Content.match(/\*\*3\. Range\*\*\s*\n+([\s\S]*?)$/)?.[1]?.trim() || '';

  sections.push({
    heading: section3Heading,
    content: section3Text,
    subsections: [
      { heading: 'Deep Technical Knowledge', content: thing1 },
      { heading: 'Big Picture Business View', content: thing2 },
      { heading: 'Range', content: thing3All }
    ],
    visible: true
  });

  // Section 4: AI & The New Way
  const section4Content = extractSectionToRule('### Section 4: AI');
  const section4Heading = section4Content.match(/\*\*Heading:\*\*\s*([^\n]+)/)?.[1]?.trim() || 'Why AI Changes Everything';
  const section4Text = section4Content.match(/\*\*Content:\*\*\s*\n+([\s\S]*?)$/)?.[1]?.trim() || '';

  sections.push({
    heading: section4Heading,
    content: section4Text,
    visible: true
  });

  // Section 5: What Interests Me
  const section5Content = extractSectionToRule('### Section 5: What Interests');
  const section5Heading = section5Content.match(/\*\*Heading:\*\*\s*([^\n]+)/)?.[1]?.trim() || 'The Work I Want';
  const section5Text = section5Content.match(/\*\*Content:\*\*\s*\n+([\s\S]*?)$/)?.[1]?.trim() || '';

  sections.push({
    heading: section5Heading,
    content: section5Text,
    visible: true
  });

  // Section 6: How I Work
  const section6Content = extractSectionToRule('### Section 6: How I Work');
  const section6Heading = section6Content.match(/\*\*Heading:\*\*\s*([^\n]+)/)?.[1]?.trim() || 'The Process';
  const section6Text = section6Content.match(/\*\*Content:\*\*\s*\n+([\s\S]*?)$/)?.[1]?.trim() || '';

  sections.push({
    heading: section6Heading,
    content: section6Text,
    visible: true
  });

  // Section 7: Philosophy
  const section7Content = extractSectionToRule('### Section 7: Philosophy');
  const section7Heading = section7Content.match(/\*\*Heading:\*\*\s*([^\n]+)/)?.[1]?.trim() || 'How I Think About Products';
  const section7Text = section7Content.match(/\*\*Content:\*\*\s*\n+([\s\S]*?)$/)?.[1]?.trim() || '';

  sections.push({
    heading: section7Heading,
    content: section7Text,
    visible: true
  });

  // Section 8: Selected Work (will use selectedProjects array, so minimal content)
  sections.push({
    heading: 'Projects I\'m Proud Of',
    content: 'These are some of the projects that define my career and showcase the range of problems I\'ve solved.',
    visible: true
  });

  // Section 9: Availability (will use CTA fields, so minimal content)
  sections.push({
    heading: 'Let\'s Work Together',
    content: 'I\'m available for consulting and new projects. Let\'s discuss how I can help solve your challenging problems.',
    visible: true
  });

  // Section 10: Personal
  const section10Content = extractSection('### Section 10: Personal', '## Key Achievements');
  const section10Heading = section10Content.match(/\*\*Heading:\*\*\s*([^\n]+)/)?.[1]?.trim() || 'Beyond Work';
  const section10Text = section10Content.match(/\*\*Content:\*\*([\s\S]*?)(?=---|$)/)?.[1]?.trim() || '';

  sections.push({
    heading: section10Heading,
    content: section10Text,
    visible: true
  });

  console.log(`✅ Extracted ${sections.length} sections`);

  // Extract Selected Projects
  const projectsContent = extractSection('### Section 8: Selected Work', '### Section 9');
  const selectedProjects: SelectedProject[] = [
    {
      title: 'Virgin America',
      metric: '15-20% conversion improvement',
      description: 'First responsive airline website. Webbies, UX Awards, Cannes Lions. Pioneered decision-based booking flows.',
      order: 1
    },
    {
      title: 'Before Launcher',
      metric: '30-40% reduction in phone opens',
      description: 'Fast Company\'s Best App of 2019. Helped thousands focus by filtering notifications intelligently.',
      order: 2
    },
    {
      title: 'Casa Bonita',
      metric: '40,000-person queue management',
      description: '25% increase in covers. 100% capacity consistently. Built custom queue management system.',
      order: 3
    },
    {
      title: 'Target',
      metric: '20+ work streams managed',
      description: 'Amazon → proprietary e-commerce migration. Future of retail conceptual work. Largest client engagement.',
      order: 4
    },
    {
      title: 'Pedal',
      metric: '15% more cars purchased',
      description: '5% homepage conversion lift. First Sanity CMS project. Complete site redesign and optimization.',
      order: 5
    },
    {
      title: 'PostPal',
      metric: 'AI-powered medical recovery app',
      description: 'React Native + Next.js full-stack application. Built entirely with Claude Code. Helping patients manage post-operative care.',
      order: 6
    }
  ];

  console.log(`✅ Created ${selectedProjects.length} selected projects`);

  // CTA fields
  const ctaContent = extractSection('### Section 9: Current Work', '### Section 10');
  const availabilityText = 'Am I available for consulting? Yes. Projects that help my clients and solve challenging problems. I\'m especially interested in 0-to-1 product development, AI/ML integration, conversion optimization, and complex user flows.';
  const ctaText = 'The rates for an AI builder are much lower than you might find for a bigger team, and I think the quality is as high or higher. Let\'s talk about your project.';

  return {
    name: 'Michael Evans',
    heroHeadline: headline,
    heroSubheadline: subheadline,
    heroIntro: intro,
    quickFacts,
    capabilities,
    sections,
    selectedProjects,
    availability: true,
    availabilityText,
    ctaText,
    ctaButtonText: 'Let\'s Work Together'
  };
}

/**
 * Convert markdown content to Sanity portable text blocks
 * (Reused from case studies export script)
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
 * Generate slug from heading
 */
function generateSlug(heading: string): { _type: 'slug'; current: string } {
  const slug = heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    _type: 'slug',
    current: slug
  };
}

/**
 * Convert profile spec to NDJSON document
 */
function profileToNDJSON(spec: ProfileSpec): string {
  const docId = 'profile-main'; // Singleton document

  // Build sections with portable text
  const sections = spec.sections.map((section) => ({
    _key: uuidv4(),
    heading: section.heading,
    slug: generateSlug(section.heading),
    content: markdownToPortableText(section.content),
    ...(section.subsections && {
      subsections: section.subsections.map((sub) => ({
        _key: uuidv4(),
        heading: sub.heading,
        content: markdownToPortableText(sub.content),
      })),
    }),
    visible: section.visible,
  }));

  // Build capabilities
  const capabilities = spec.capabilities.map((cap) => ({
    _key: uuidv4(),
    title: cap.title,
    description: cap.description,
    isNew: cap.isNew,
  }));

  // Build selected projects
  const selectedProjects = spec.selectedProjects.map((proj) => ({
    _key: uuidv4(),
    title: proj.title,
    metric: proj.metric,
    description: proj.description,
    order: proj.order,
  }));

  // Build quick facts
  const quickFacts = spec.quickFacts.map((fact) => ({
    _key: uuidv4(),
    label: fact.label,
    value: fact.value,
  }));

  // Build the document
  const document = {
    _id: docId,
    _type: 'profile',
    name: spec.name,
    heroHeadline: spec.heroHeadline,
    heroSubheadline: spec.heroSubheadline,
    heroIntro: spec.heroIntro,
    quickFacts,
    capabilities,
    sections,
    selectedProjects,
    availability: spec.availability,
    availabilityText: spec.availabilityText,
    ctaText: spec.ctaText,
    ctaButtonText: spec.ctaButtonText,
  };

  return JSON.stringify(document);
}

/**
 * Main export function
 */
async function exportToNDJSON() {
  console.log('🎯 Profile Content NDJSON Export\n');
  console.log('================================\n');

  const contentSpecPath = path.join(
    process.cwd(),
    'docs',
    'content-specs',
    'detailed-specs',
    'profile-about-content-spec.md'
  );

  if (!fs.existsSync(contentSpecPath)) {
    console.error(`❌ Content spec not found: ${contentSpecPath}`);
    process.exit(1);
  }

  // Parse the content spec
  const spec = parseContentSpec(contentSpecPath);

  // Convert to NDJSON
  const ndjsonLine = profileToNDJSON(spec);

  // Write to file
  const outputPath = path.join(process.cwd(), 'profile-content.ndjson');
  fs.writeFileSync(outputPath, ndjsonLine);

  console.log('\n================================');
  console.log('📊 Export Summary\n');
  console.log(`✅ Exported profile document`);
  console.log(`   - ${spec.sections.length} sections`);
  console.log(`   - ${spec.capabilities.length} capabilities`);
  console.log(`   - ${spec.selectedProjects.length} selected projects`);
  console.log(`   - ${spec.quickFacts.length} quick facts`);
  console.log(`📁 Output file: ${outputPath}`);
  console.log('\n📝 Next steps:');
  console.log('   Run this command to import:');
  console.log(`   sanity dataset import profile-content.ndjson production --replace`);
  console.log('\n   ⚠️  Note: --replace will update the existing profile document');
}

// Run the export
exportToNDJSON().catch(console.error);
