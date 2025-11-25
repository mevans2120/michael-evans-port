import type { WithContext, Person, WebSite, ProfilePage, BlogPosting, Article, BreadcrumbList } from 'schema-dts';

/**
 * Structured Data (JSON-LD) generators for SEO
 *
 * These functions generate schema.org structured data from Sanity CMS content
 * for improved search engine visibility and rich results.
 */

// ============================================
// Type Definitions (matching Sanity schema)
// ============================================

export interface StructuredDataProfile {
  name: string;
  profileImageUrl?: string;
  heroHeadline?: string;
  title?: string;
  heroSubheadline?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    bluesky?: string;
    email?: string;
  };
  skills?: Array<{ category: string; skills: string[] }>;
  experience?: Array<{
    company: string;
    role: string;
    current?: boolean;
  }>;
}

export interface StructuredDataSeoSettings {
  siteName: string;
  siteUrl: string;
  defaultMetaDescription?: string;
  author?: string;
}

export interface StructuredDataBlogPost {
  title: string;
  slug: { current: string };
  excerpt?: string;
  featuredImage?: {
    asset?: { url?: string };
    alt?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  author?: string;
}

export interface StructuredDataCaseStudy {
  title: string;
  slug: { current: string };
  featuredDescription?: string;
  featuredImage?: {
    asset?: { url?: string };
    alt?: string;
  };
  publishedAt?: string;
  updatedAt?: string;
  category?: string;
}

export interface BreadcrumbItem {
  name: string;
  url?: string; // undefined for current page (last item)
}

// ============================================
// Utilities
// ============================================

/**
 * Remove undefined and null values from an object
 * This ensures clean JSON-LD output without null fields
 */
function cleanObject<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  ) as T;
}

// ============================================
// Schema Generators
// ============================================

/**
 * Generate Person schema for site-wide identity
 * Used in root layout for brand identity and potential Knowledge Panel
 */
export function generatePersonSchema(
  profile: StructuredDataProfile,
  siteUrl: string
): WithContext<Person> {
  const sameAs: string[] = [];
  if (profile.social?.github) sameAs.push(profile.social.github);
  if (profile.social?.linkedin) sameAs.push(profile.social.linkedin);
  if (profile.social?.twitter) sameAs.push(profile.social.twitter);
  if (profile.social?.bluesky) sameAs.push(profile.social.bluesky);

  // Extract skills as knowsAbout topics
  const knowsAbout = profile.skills?.flatMap(s => s.skills) || [];

  // Find current employer
  const currentJob = profile.experience?.find(e => e.current);

  return cleanObject({
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.heroHeadline || profile.title || undefined,
    description: profile.heroSubheadline || undefined,
    url: siteUrl,
    image: profile.profileImageUrl || undefined,
    email: profile.social?.email ? `mailto:${profile.social.email}` : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    knowsAbout: knowsAbout.length > 0 ? knowsAbout : undefined,
    worksFor: currentJob ? {
      "@type": "Organization",
      name: currentJob.company,
    } : undefined,
  }) as WithContext<Person>;
}

/**
 * Generate WebSite schema for site identity
 * Used in root layout alongside Person schema
 */
export function generateWebSiteSchema(
  seoSettings: StructuredDataSeoSettings,
  personName: string
): WithContext<WebSite> {
  return cleanObject({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoSettings.siteName,
    url: seoSettings.siteUrl,
    description: seoSettings.defaultMetaDescription || undefined,
    author: {
      "@type": "Person",
      name: personName,
    },
  }) as WithContext<WebSite>;
}

/**
 * Generate ProfilePage schema for about page
 * Wraps Person schema with page-level metadata
 */
export function generateProfilePageSchema(
  profile: StructuredDataProfile,
  siteUrl: string,
  dateModified?: string
): WithContext<ProfilePage> {
  // Build Person object directly without @context (nested entities don't need it)
  const sameAs: string[] = [];
  if (profile.social?.github) sameAs.push(profile.social.github);
  if (profile.social?.linkedin) sameAs.push(profile.social.linkedin);
  if (profile.social?.twitter) sameAs.push(profile.social.twitter);
  if (profile.social?.bluesky) sameAs.push(profile.social.bluesky);

  const knowsAbout = profile.skills?.flatMap(s => s.skills) || [];
  const currentJob = profile.experience?.find(e => e.current);

  const personEntity: Person = {
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.heroHeadline || profile.title,
    description: profile.heroSubheadline,
    url: siteUrl,
    image: profile.profileImageUrl,
    email: profile.social?.email ? `mailto:${profile.social.email}` : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    knowsAbout: knowsAbout.length > 0 ? knowsAbout : undefined,
    worksFor: currentJob ? {
      "@type": "Organization",
      name: currentJob.company,
    } : undefined,
  };

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateModified: dateModified,
    mainEntity: personEntity,
  };
}

/**
 * Generate BlogPosting schema for blog post pages
 */
export function generateBlogPostingSchema(
  post: StructuredDataBlogPost,
  siteUrl: string,
  authorProfile: StructuredDataProfile
): WithContext<BlogPosting> {
  return cleanObject({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.featuredImage?.asset?.url || undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    url: `${siteUrl}/blog/${post.slug.current}`,
    author: {
      "@type": "Person",
      name: post.author || authorProfile.name,
      url: `${siteUrl}/about`,
    },
    publisher: {
      "@type": "Person",
      name: authorProfile.name,
      url: siteUrl,
    },
  }) as WithContext<BlogPosting>;
}

/**
 * Generate Article schema for case study pages
 */
export function generateArticleSchema(
  caseStudy: StructuredDataCaseStudy,
  siteUrl: string,
  authorProfile: StructuredDataProfile
): WithContext<Article> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: caseStudy.title,
    description: caseStudy.featuredDescription,
    image: caseStudy.featuredImage?.asset?.url,
    datePublished: caseStudy.publishedAt,
    dateModified: caseStudy.updatedAt || caseStudy.publishedAt,
    url: `${siteUrl}/case-studies/${caseStudy.slug.current}`,
    author: {
      "@type": "Person",
      name: authorProfile.name,
      url: `${siteUrl}/about`,
    },
    about: caseStudy.category ? {
      "@type": "Thing",
      name: caseStudy.category,
    } : undefined,
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  siteUrl: string
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: `${siteUrl}${item.url}` } : {}),
    })),
  };
}
