/**
 * Sanity Content Fetcher for AI Chatbot
 * Fetches and transforms Sanity CMS content for vector database ingestion
 */

import { client } from '@/lib/sanity/client';
import { PortableTextBlock } from 'sanity';

/**
 * Portable Text to Plain Text Converter
 * Converts Sanity's portable text blocks to plain text for embedding
 */
export function portableTextToPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks
    .map((block: any) => {
      // Handle regular text blocks
      if (block._type === 'block' && block.children) {
        return block.children
          .map((child: any) => child.text)
          .join('');
      }

      // Handle other block types (images, etc.)
      // For now, we'll skip non-text blocks
      return '';
    })
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Content interfaces matching Sanity schemas
 */
interface SanityProject {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  category?: string;
  summary?: string;
  description?: string;
  content?: PortableTextBlock[];
  metrics?: Array<{ label: string; value: string }>;
  achievements?: string[];
  technologies?: string[];
  publishedAt?: string;
}

interface SanityProfile {
  _id: string;
  _updatedAt: string;
  name: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroIntro?: string;
  quickFacts?: Array<{ label: string; value: string }>;
  capabilities?: Array<{ title: string; description: string }>;
  sections?: Array<{
    heading: string;
    content?: PortableTextBlock[];
    subsections?: Array<{
      heading: string;
      content?: PortableTextBlock[];
    }>;
  }>;
  selectedProjects?: Array<{
    title: string;
    metric?: string;
    description?: string;
  }>;
  technologies?: {
    frontend?: string[];
    mobile?: string[];
    backend?: string[];
    cms?: string[];
    data?: string[];
    aiMl?: string[];
    deployment?: string[];
    enterprise?: string[];
  };
  bio?: PortableTextBlock[];
  skills?: Array<{
    category: string;
    skills: string[];
  }>;
  experience?: Array<{
    company: string;
    role: string;
    description?: string;
  }>;
}

interface SanityAIProject {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  description?: string;
  category?: string;
  status?: string;
  overview?: {
    problem?: string;
    solution?: string;
    role?: string;
    timeline?: string;
  };
  metrics?: Array<{ label: string; value: string }>;
  techStack?: string[];
  aiComponents?: Array<{
    name: string;
    description: string;
    technology: string;
  }>;
  developmentProcess?: Array<{
    phase: string;
    description: string;
    outcomes: string[];
  }>;
  learnings?: string[];
  achievements?: string[];
}

/**
 * Content document interface for ingestion
 */
export interface SanityContentDocument {
  content: string;
  metadata: {
    source: 'sanity_project' | 'sanity_profile' | 'sanity_ai_project';
    source_id: string;
    title: string;
    category?: string;
    updated_at: string;
    [key: string]: any;
  };
}

/**
 * Fetch all projects from Sanity
 */
export async function fetchProjects(): Promise<SanityContentDocument[]> {
  const query = `*[_type == "project"] {
    _id,
    _updatedAt,
    title,
    slug,
    category,
    summary,
    description,
    content,
    metrics,
    achievements,
    technologies,
    publishedAt
  }`;

  const projects: SanityProject[] = await client.fetch(query);

  return projects.map((project) => {
    // Build content string from all text fields
    const contentParts: string[] = [];

    // Add title and basic info
    contentParts.push(`# ${project.title}`);
    if (project.category) contentParts.push(`Category: ${project.category}`);
    if (project.summary) contentParts.push(project.summary);
    if (project.description) contentParts.push(project.description);

    // Add main content (portable text)
    if (project.content) {
      const contentText = portableTextToPlainText(project.content);
      if (contentText) contentParts.push(contentText);
    }

    // Add metrics
    if (project.metrics && project.metrics.length > 0) {
      contentParts.push('\n## Key Metrics');
      project.metrics.forEach(metric => {
        contentParts.push(`- ${metric.label}: ${metric.value}`);
      });
    }

    // Add achievements
    if (project.achievements && project.achievements.length > 0) {
      contentParts.push('\n## Key Achievements');
      project.achievements.forEach(achievement => {
        contentParts.push(`- ${achievement}`);
      });
    }

    // Add technologies
    if (project.technologies && project.technologies.length > 0) {
      contentParts.push(`\nTechnologies: ${project.technologies.join(', ')}`);
    }

    return {
      content: contentParts.join('\n\n'),
      metadata: {
        source: 'sanity_project' as const,
        source_id: project._id,
        title: project.title,
        category: project.category,
        slug: project.slug?.current,
        updated_at: project._updatedAt,
        technologies: project.technologies,
      },
    };
  });
}

/**
 * Fetch profile content from Sanity
 */
export async function fetchProfile(): Promise<SanityContentDocument[]> {
  const query = `*[_type == "profile"][0] {
    _id,
    _updatedAt,
    name,
    heroHeadline,
    heroSubheadline,
    heroIntro,
    quickFacts,
    capabilities,
    sections,
    selectedProjects,
    technologies,
    bio,
    skills,
    experience
  }`;

  const profile: SanityProfile | null = await client.fetch(query);

  if (!profile) return [];

  const documents: SanityContentDocument[] = [];

  // Build main profile content
  const mainContentParts: string[] = [];
  mainContentParts.push(`# ${profile.name}`);

  if (profile.heroHeadline) mainContentParts.push(profile.heroHeadline);
  if (profile.heroSubheadline) mainContentParts.push(profile.heroSubheadline);
  if (profile.heroIntro) mainContentParts.push(profile.heroIntro);

  // Add quick facts
  if (profile.quickFacts && profile.quickFacts.length > 0) {
    mainContentParts.push('\n## Quick Facts');
    profile.quickFacts.forEach(fact => {
      mainContentParts.push(`- ${fact.label}: ${fact.value}`);
    });
  }

  // Add capabilities
  if (profile.capabilities && profile.capabilities.length > 0) {
    mainContentParts.push('\n## Capabilities');
    profile.capabilities.forEach(cap => {
      mainContentParts.push(`\n### ${cap.title}`);
      if (cap.description) mainContentParts.push(cap.description);
    });
  }

  // Add bio (portable text)
  if (profile.bio) {
    const bioText = portableTextToPlainText(profile.bio);
    if (bioText) {
      mainContentParts.push('\n## Background');
      mainContentParts.push(bioText);
    }
  }

  // Add skills
  if (profile.skills && profile.skills.length > 0) {
    mainContentParts.push('\n## Skills');
    profile.skills.forEach(skillGroup => {
      mainContentParts.push(`\n### ${skillGroup.category}`);
      mainContentParts.push(skillGroup.skills.join(', '));
    });
  }

  // Add technologies
  if (profile.technologies) {
    mainContentParts.push('\n## Technologies & Tools');
    Object.entries(profile.technologies).forEach(([category, techs]) => {
      if (techs && (techs as string[]).length > 0) {
        mainContentParts.push(`\n### ${category}`);
        mainContentParts.push((techs as string[]).join(', '));
      }
    });
  }

  // Add experience
  if (profile.experience && profile.experience.length > 0) {
    mainContentParts.push('\n## Experience');
    profile.experience.forEach(exp => {
      mainContentParts.push(`\n### ${exp.role} at ${exp.company}`);
      if (exp.description) mainContentParts.push(exp.description);
    });
  }

  documents.push({
    content: mainContentParts.join('\n\n'),
    metadata: {
      source: 'sanity_profile' as const,
      source_id: profile._id,
      title: 'Profile',
      category: 'profile',
      updated_at: profile._updatedAt,
    },
  });

  // Create separate documents for each section
  if (profile.sections && profile.sections.length > 0) {
    profile.sections.forEach((section, index) => {
      const sectionParts: string[] = [];
      sectionParts.push(`# ${section.heading}`);

      if (section.content) {
        const sectionText = portableTextToPlainText(section.content);
        if (sectionText) sectionParts.push(sectionText);
      }

      if (section.subsections && section.subsections.length > 0) {
        section.subsections.forEach(subsection => {
          sectionParts.push(`\n## ${subsection.heading}`);
          if (subsection.content) {
            const subsectionText = portableTextToPlainText(subsection.content);
            if (subsectionText) sectionParts.push(subsectionText);
          }
        });
      }

      documents.push({
        content: sectionParts.join('\n\n'),
        metadata: {
          source: 'sanity_profile' as const,
          source_id: `${profile._id}_section_${index}`,
          title: section.heading,
          category: 'profile_section',
          updated_at: profile._updatedAt,
        },
      });
    });
  }

  return documents;
}

/**
 * Fetch all AI projects from Sanity
 */
export async function fetchAIProjects(): Promise<SanityContentDocument[]> {
  const query = `*[_type == "aiProject"] {
    _id,
    _updatedAt,
    title,
    slug,
    subtitle,
    description,
    category,
    status,
    overview,
    metrics,
    techStack,
    aiComponents,
    developmentProcess,
    learnings,
    achievements
  }`;

  const aiProjects: SanityAIProject[] = await client.fetch(query);

  return aiProjects.map((project) => {
    const contentParts: string[] = [];

    // Add title and basic info
    contentParts.push(`# ${project.title}`);
    if (project.subtitle) contentParts.push(project.subtitle);
    if (project.status) contentParts.push(`Status: ${project.status}`);
    if (project.category) contentParts.push(`Category: ${project.category}`);
    if (project.description) contentParts.push(project.description);

    // Add overview
    if (project.overview) {
      if (project.overview.problem) {
        contentParts.push('\n## Problem');
        contentParts.push(project.overview.problem);
      }
      if (project.overview.solution) {
        contentParts.push('\n## Solution');
        contentParts.push(project.overview.solution);
      }
      if (project.overview.role) {
        contentParts.push(`\n**Role:** ${project.overview.role}`);
      }
      if (project.overview.timeline) {
        contentParts.push(`**Timeline:** ${project.overview.timeline}`);
      }
    }

    // Add metrics
    if (project.metrics && project.metrics.length > 0) {
      contentParts.push('\n## Key Metrics');
      project.metrics.forEach(metric => {
        contentParts.push(`- ${metric.label}: ${metric.value}`);
      });
    }

    // Add tech stack
    if (project.techStack && project.techStack.length > 0) {
      contentParts.push(`\nTech Stack: ${project.techStack.join(', ')}`);
    }

    // Add AI components
    if (project.aiComponents && project.aiComponents.length > 0) {
      contentParts.push('\n## AI Components');
      project.aiComponents.forEach(component => {
        contentParts.push(`\n### ${component.name} (${component.technology})`);
        contentParts.push(component.description);
      });
    }

    // Add development process
    if (project.developmentProcess && project.developmentProcess.length > 0) {
      contentParts.push('\n## Development Process');
      project.developmentProcess.forEach(phase => {
        contentParts.push(`\n### ${phase.phase}`);
        contentParts.push(phase.description);
        if (phase.outcomes && phase.outcomes.length > 0) {
          contentParts.push('**Outcomes:**');
          phase.outcomes.forEach(outcome => {
            contentParts.push(`- ${outcome}`);
          });
        }
      });
    }

    // Add learnings
    if (project.learnings && project.learnings.length > 0) {
      contentParts.push('\n## Key Learnings');
      project.learnings.forEach(learning => {
        contentParts.push(`- ${learning}`);
      });
    }

    // Add achievements
    if (project.achievements && project.achievements.length > 0) {
      contentParts.push('\n## Achievements');
      project.achievements.forEach(achievement => {
        contentParts.push(`- ${achievement}`);
      });
    }

    return {
      content: contentParts.join('\n\n'),
      metadata: {
        source: 'sanity_ai_project' as const,
        source_id: project._id,
        title: project.title,
        category: project.category,
        slug: project.slug?.current,
        status: project.status,
        updated_at: project._updatedAt,
        techStack: project.techStack,
      },
    };
  });
}

/**
 * Fetch all Sanity content for chatbot ingestion
 */
export async function fetchAllSanityContent(): Promise<SanityContentDocument[]> {
  console.log('📦 Fetching Sanity content...');

  const [projects, profile, aiProjects] = await Promise.all([
    fetchProjects(),
    fetchProfile(),
    fetchAIProjects(),
  ]);

  const allContent = [...projects, ...profile, ...aiProjects];

  console.log(`✅ Fetched ${allContent.length} Sanity documents:`);
  console.log(`   - Projects: ${projects.length}`);
  console.log(`   - Profile sections: ${profile.length}`);
  console.log(`   - AI Projects: ${aiProjects.length}`);

  return allContent;
}
