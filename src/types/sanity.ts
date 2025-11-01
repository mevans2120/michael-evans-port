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
 * Homepage Hero from Sanity CMS (Singleton)
 * Used for the main hero section on homepage
 */
export interface SanityHomepageHero {
  _id: string;
  _type: 'homepageHero';
  tagline: string;
  description: string;
}

