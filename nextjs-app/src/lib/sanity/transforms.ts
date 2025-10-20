/**
 * Sanity Data Transformations
 *
 * Utilities for transforming Sanity CMS data into component-ready formats.
 * Keeps transformation logic centralized and testable.
 */

import type { SanityHeroOptionQueryResult, HeroOption } from '@/types/sanity';

/**
 * Transform a Sanity hero option query result into component-ready format
 *
 * @param sanityOption - Raw data from Sanity GROQ query
 * @returns Transformed hero option ready for use in HomeMinimal component
 */
export function transformHeroOption(sanityOption: SanityHeroOptionQueryResult): HeroOption {
  // Generate link based on linkType
  let link = '#';

  if (sanityOption.linkType === 'internal' && sanityOption.internalSlug) {
    // Determine route prefix based on document type
    const routePrefix = getRoutePrefix(sanityOption.internalType);
    link = `${routePrefix}/${sanityOption.internalSlug}`;
  } else if (sanityOption.linkType === 'external' && sanityOption.externalLink) {
    link = sanityOption.externalLink;
  }

  return {
    prefix: sanityOption.prefix,
    dropdown: sanityOption.dropdown,
    link,
    label: sanityOption.label,
    description: sanityOption.description,
    image: sanityOption.imageUrl || '',
    tags: sanityOption.tags || [],
    color: sanityOption.colorGradient || 'from-purple-500 to-indigo-600',
  };
}

/**
 * Get route prefix based on Sanity document type
 *
 * @param docType - Sanity document type (e.g., 'project', 'aiProject')
 * @returns Route prefix for that document type
 */
function getRoutePrefix(docType?: string): string {
  switch (docType) {
    case 'project':
      return '/case-studies';
    case 'aiProject':
      return '/ai-projects';
    default:
      return '';
  }
}

/**
 * Transform array of Sanity hero options
 *
 * @param options - Array of Sanity hero option query results
 * @returns Array of transformed hero options
 */
export function transformHeroOptions(
  options: SanityHeroOptionQueryResult[]
): HeroOption[] {
  return options.map(transformHeroOption);
}
