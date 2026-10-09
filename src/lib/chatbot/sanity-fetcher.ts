/**
 * Sanity Content Fetcher for AI Chatbot
 * Fetches and transforms Sanity CMS content for vector database ingestion
 */

import { client } from '@/sanity/lib/client';
import { type PortableTextBlock } from 'sanity';


/**
 * Portable Text to Plain Text Converter
 * Converts Sanity's portable text blocks to plain text for embedding
 */
export function portableTextToPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks
    .map((block) => {
      // Handle regular text blocks
      if (block._type === 'block' && 'children' in block && Array.isArray(block.children)) {
        return block.children
          .map((child) => ('text' in child && typeof child.text === 'string' ? child.text : ''))
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
  description?: string;
  featuredDescription?: string;
  featuredMetric?: string;
  overview?: { role?: string; company?: string; timeline?: string };
  metrics?: Array<{ label: string; value: string; description?: string }>;
  technologies?: string[];
  article?: PortableTextBlock[];
  chatbotQuestions?: string[];
  chatbotOnly?: boolean;
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
  title?: string;
  tagline?: string;
  chatbotQuestions?: string[];
  bio?: PortableTextBlock[];
  article?: PortableTextBlock[];
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

interface SanityBlog {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  content?: PortableTextBlock[];
  heroSection?: {
    badge?: string;
    subtitle?: string;
  };
  publishedAt?: string;
  author?: string;
  featured?: boolean;
  chatbotQuestions?: string[];
}

/**
 * Content document interface for ingestion
 */
export interface SanityContentDocument {
  content: string;
  metadata: {
    source: 'sanity_project' | 'sanity_profile' | 'sanity_ai_project' | 'sanity_blog';
    source_id: string;
    title: string;
    category?: string;
    url?: string;
    questions: string[];
    updated_at: string;
    [key: string]: unknown;
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
    description,
    featuredDescription,
    featuredMetric,
    overview,
    metrics,
    technologies,
    article,
    chatbotQuestions,
    chatbotOnly,
    publishedAt
  }`;

  const projects: SanityProject[] = await client.fetch(query);

  return projects.map((project) => {
    const contentParts: string[] = [];
    contentParts.push(`# ${project.title}`);

    if (project.slug?.current) {
      contentParts.push(`Case study URL: /case-studies/${project.slug.current}`);
    }
    if (project.category) contentParts.push(`Category: ${project.category}`);

    const o = project.overview;
    if (o && (o.role || o.company || o.timeline)) {
      const where = o.company ? ` at ${o.company}` : '';
      const when = o.timeline ? ` (${o.timeline})` : '';
      contentParts.push(`Role: ${o.role ?? 'Contributor'}${where}${when}`);
    }

    if (project.featuredDescription) contentParts.push(project.featuredDescription);
    if (project.description) contentParts.push(project.description);
    if (project.featuredMetric) contentParts.push(`Headline result: ${project.featuredMetric}`);

    if (project.article) {
      const articleText = portableTextToPlainText(project.article);
      if (articleText) contentParts.push(articleText);
    }

    if (project.metrics && project.metrics.length > 0) {
      contentParts.push('\n## Key Metrics');
      project.metrics.forEach((m) => {
        const note = m.description ? ` (${m.description})` : '';
        contentParts.push(`- ${m.label}: ${m.value}${note}`);
      });
    }

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
        url: project.slug?.current ? `/case-studies/${project.slug.current}` : undefined,
        updated_at: project._updatedAt,
        technologies: project.technologies,
        questions: project.chatbotQuestions ?? [],
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
    title,
    tagline,
    chatbotQuestions,
    bio,
    article,
    skills,
    experience
  }`;

  const profile: SanityProfile | null = await client.fetch(query);

  if (!profile) return [];

  const documents: SanityContentDocument[] = [];

  // Build main profile content
  const mainContentParts: string[] = [];
  mainContentParts.push(`# ${profile.name}`);

  if (profile.title) mainContentParts.push(profile.title);
  if (profile.tagline) mainContentParts.push(profile.tagline);
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

  // Add bio (portable text)
  if (profile.bio) {
    const bioText = portableTextToPlainText(profile.bio);
    if (bioText) {
      mainContentParts.push('\n## Background');
      mainContentParts.push(bioText);
    }
  }

  // Add article (About page extended content)
  if (profile.article) {
    const articleText = portableTextToPlainText(profile.article);
    if (articleText) {
      mainContentParts.push('\n## About / Background Details');
      mainContentParts.push(articleText);
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
      url: '/about',
      updated_at: profile._updatedAt,
      questions: profile.chatbotQuestions ?? [],
    },
  });

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
        url: undefined,
        status: project.status,
        updated_at: project._updatedAt,
        techStack: project.techStack,
        questions: [],
      },
    };
  });
}

/**
 * Fetch all blog posts from Sanity
 */
export async function fetchBlogPosts(): Promise<SanityContentDocument[]> {
  const query = `*[_type == "blog"] {
    _id,
    _updatedAt,
    title,
    slug,
    excerpt,
    content,
    heroSection,
    publishedAt,
    author,
    featured,
    chatbotQuestions
  }`;

  const blogPosts: SanityBlog[] = await client.fetch(query);

  return blogPosts.map((post) => {
    const contentParts: string[] = [];

    // Add title and hero info
    contentParts.push(`# ${post.title}`);

    // Add URL so chatbot knows which link to use
    if (post.slug?.current) {
      contentParts.push(`Blog post URL: /blog/${post.slug.current}`);
    }

    if (post.heroSection?.badge) {
      contentParts.push(`Category: ${post.heroSection.badge}`);
    }

    if (post.heroSection?.subtitle) {
      contentParts.push(post.heroSection.subtitle);
    }

    if (post.excerpt) {
      contentParts.push(post.excerpt);
    }

    // Add main content (portable text)
    if (post.content) {
      const contentText = portableTextToPlainText(post.content);
      if (contentText) contentParts.push(contentText);
    }

    // Add metadata footer
    if (post.publishedAt) {
      const date = new Date(post.publishedAt).toLocaleDateString();
      contentParts.push(`\nPublished: ${date}`);
    }

    if (post.author) {
      contentParts.push(`Author: ${post.author}`);
    }

    return {
      content: contentParts.join('\n\n'),
      metadata: {
        source: 'sanity_blog' as const,
        source_id: post._id,
        title: post.title,
        category: post.heroSection?.badge || 'blog',
        slug: post.slug?.current,
        url: post.slug?.current ? `/blog/${post.slug.current}` : undefined,
        updated_at: post._updatedAt,
        publishedAt: post.publishedAt,
        author: post.author,
        featured: post.featured,
        questions: post.chatbotQuestions ?? [],
      },
    };
  });
}

/**
 * Fetch all Sanity content for chatbot ingestion
 */
export async function fetchAllSanityContent(): Promise<SanityContentDocument[]> {
  console.log('📦 Fetching Sanity content...');

  const [projects, profile, aiProjects, blogPosts] = await Promise.all([
    fetchProjects(),
    fetchProfile(),
    fetchAIProjects(),
    fetchBlogPosts(),
  ]);

  const allContent = [...projects, ...profile, ...aiProjects, ...blogPosts];

  console.log(`✅ Fetched ${allContent.length} Sanity documents:`);
  console.log(`   - Projects: ${projects.length}`);
  console.log(`   - Profile sections: ${profile.length}`);
  console.log(`   - AI Projects: ${aiProjects.length}`);
  console.log(`   - Blog Posts: ${blogPosts.length}`);

  return allContent;
}
