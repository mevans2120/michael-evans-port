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

/**
 * Contact Page from Sanity CMS (Singleton)
 * Used for the /contact page
 */
export interface ContactPageData {
  heading: string;
  subheading: string;
  email: string;
  emailSubject: string;
  gmailLinkText: string;
  outlookLinkText: string;
  copyEmailLinkText: string;
  copiedConfirmationText: string;
  responseTimeNote: string;
  form?: {
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    sendButtonText: string;
    sendingButtonText: string;
    successMessage: string;
    errorMessage: string;
  };
  confirmationEmail?: {
    enabled: boolean;
    fromName?: string;
    subject?: string;
    cc?: string;
    body?: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

