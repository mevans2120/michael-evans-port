import { type PortableTextBlock } from 'sanity';

export interface BlogHero {
  badge?: string;
  subtitle?: string;
}

export interface BlogImage {
  asset?: {
    _id: string;
    url: string;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  alt?: string;
  caption?: string;
}

export interface BlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: BlogImage;
}

export interface Blog {
  _id: string;
  _type: 'blog';
  _createdAt: string;
  _updatedAt: string;

  // Core
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;

  // Hero
  heroSection?: BlogHero;

  // Content
  content: PortableTextBlock[];

  // Metadata
  publishedAt: string;
  updatedAt?: string;
  author?: string;

  // Organization
  featured?: boolean;
  order?: number;

  // Media
  featuredImage?: BlogImage;

  // SEO
  seo?: BlogSEO;
}

export interface BlogListItem {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  publishedAt: string;
  author?: string;
  featuredImage?: BlogImage;
}
