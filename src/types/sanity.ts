/**
 * Sanity CMS Type Definitions
 *
 * These types represent data structures from Sanity CMS.
 * They are kept separate from component types to maintain clear boundaries
 * between CMS data and application data.
 */

export interface SanityImage {
  asset: {
    _id: string;
    url: string;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SanityReference {
  _type: string;
  _ref: string;
}

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

/**
 * Hero Option from Sanity CMS
 * Used for rotating hero text options on homepage
 */
export interface SanityHeroOption {
  _id: string;
  _type: 'heroOption';
  prefix: string;
  dropdown: string;
  linkType: 'internal' | 'external';
  internalLink?: {
    _type: string;
    slug: SanitySlug;
  };
  externalLink?: string;
  label: string;
  description: string;
  image: SanityImage;
  tags: string[];
  colorGradient?: string;
  active: boolean;
  order: number;
  publishedAt?: string;
}

/**
 * Transformed Hero Option Query Result
 * This is what we get back from the GROQ query
 */
export interface SanityHeroOptionQueryResult {
  _id: string;
  prefix: string;
  dropdown: string;
  linkType: 'internal' | 'external';
  internalSlug?: string;
  internalType?: string;
  externalLink?: string;
  label: string;
  description: string;
  imageUrl: string;
  tags: string[];
  colorGradient?: string;
  order: number;
}

/**
 * Hero Option for Component Use
 * Matches the structure expected by HomeMinimal component
 */
export interface HeroOption {
  prefix: string;
  dropdown: string;
  link: string;
  label: string;
  description: string;
  image: string;
  tags: string[];
  color: string;
}

/**
 * AI Project Data
 * Structure for AI project data from Sanity CMS
 */
export interface AIProjectData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  category: string;
  status: 'Live' | 'In Progress' | 'Coming Soon';
  links: {
    live?: string;
    github?: string;
  };
  overview: {
    problem: string;
    solution: string;
    role: string;
    timeline: string;
  };
  metrics: {
    label: string;
    value: string;
  }[];
  techStack: string[];
  aiComponents: {
    name: string;
    description: string;
    technology: string;
  }[];
  developmentProcess: {
    phase: string;
    description: string;
    outcomes: string[];
  }[];
  learnings: string[];
  achievements: string[];
  images: {
    url: string;
    caption: string;
  }[];
}
