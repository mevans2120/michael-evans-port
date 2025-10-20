/**
 * Feature Flags for Sanity CMS Migration
 *
 * These flags allow us to gradually migrate content to Sanity CMS
 * while maintaining the ability to roll back instantly if needed.
 */

export const FEATURE_FLAGS = {
  // AI Projects
  USE_SANITY_FOR_AI_PROJECTS: false, // Master toggle for all AI projects
  USE_SANITY_FOR_POST_PAL: false,
  USE_SANITY_FOR_KARUNA_GATTON: false,
  USE_SANITY_FOR_AI_RESEARCH_AGENT: false,
  USE_SANITY_FOR_DEPARTMENT_OF_ART: false,

  // Case Studies (for future migration)
  USE_SANITY_FOR_CASE_STUDIES: false,
  USE_SANITY_FOR_CASA_BONITA: false,
  USE_SANITY_FOR_BEFORE_LAUNCHER: false,
  USE_SANITY_FOR_VIRGIN_AMERICA: false,
  USE_SANITY_FOR_PEDDLE: false,
} as const;

/**
 * Check if Sanity should be used for a specific AI project
 */
export function useSanityForAIProject(slug: string): boolean {
  // Master toggle - if false, always use hardcoded data
  if (!FEATURE_FLAGS.USE_SANITY_FOR_AI_PROJECTS) {
    return false;
  }

  // Check project-specific flags
  switch (slug) {
    case 'post-pal':
      return FEATURE_FLAGS.USE_SANITY_FOR_POST_PAL;
    case 'karuna-gatton':
      return FEATURE_FLAGS.USE_SANITY_FOR_KARUNA_GATTON;
    case 'ai-research-agent':
      return FEATURE_FLAGS.USE_SANITY_FOR_AI_RESEARCH_AGENT;
    case 'department-of-art':
      return FEATURE_FLAGS.USE_SANITY_FOR_DEPARTMENT_OF_ART;
    default:
      return false;
  }
}

/**
 * Check if Sanity should be used for a specific case study
 */
export function useSanityForCaseStudy(slug: string): boolean {
  // Master toggle - if false, always use hardcoded data
  if (!FEATURE_FLAGS.USE_SANITY_FOR_CASE_STUDIES) {
    return false;
  }

  // Check project-specific flags
  switch (slug) {
    case 'casa-bonita':
      return FEATURE_FLAGS.USE_SANITY_FOR_CASA_BONITA;
    case 'before-launcher':
      return FEATURE_FLAGS.USE_SANITY_FOR_BEFORE_LAUNCHER;
    case 'virgin-america':
      return FEATURE_FLAGS.USE_SANITY_FOR_VIRGIN_AMERICA;
    case 'peddle':
      return FEATURE_FLAGS.USE_SANITY_FOR_PEDDLE;
    default:
      return false;
  }
}

/**
 * Get all AI projects that should use Sanity
 */
export function getAIProjectsUsingSanity(): string[] {
  if (!FEATURE_FLAGS.USE_SANITY_FOR_AI_PROJECTS) {
    return [];
  }

  const projects: string[] = [];
  if (FEATURE_FLAGS.USE_SANITY_FOR_POST_PAL) projects.push('post-pal');
  if (FEATURE_FLAGS.USE_SANITY_FOR_KARUNA_GATTON) projects.push('karuna-gatton');
  if (FEATURE_FLAGS.USE_SANITY_FOR_AI_RESEARCH_AGENT) projects.push('ai-research-agent');
  if (FEATURE_FLAGS.USE_SANITY_FOR_DEPARTMENT_OF_ART) projects.push('department-of-art');

  return projects;
}

/**
 * Enable Sanity for all AI projects
 * (For testing/development - call from browser console)
 */
export function enableSanityForAllAIProjects() {
  console.warn('⚠️ Enabling Sanity for all AI projects - this requires page reload');
  console.warn('To revert, set FEATURE_FLAGS.USE_SANITY_FOR_AI_PROJECTS = false');
  // This only affects the current session - flags are hardcoded in the file
  (FEATURE_FLAGS as any).USE_SANITY_FOR_AI_PROJECTS = true;
  (FEATURE_FLAGS as any).USE_SANITY_FOR_POST_PAL = true;
  (FEATURE_FLAGS as any).USE_SANITY_FOR_KARUNA_GATTON = true;
  (FEATURE_FLAGS as any).USE_SANITY_FOR_AI_RESEARCH_AGENT = true;
  (FEATURE_FLAGS as any).USE_SANITY_FOR_DEPARTMENT_OF_ART = true;
}

/**
 * Disable Sanity for all content (rollback)
 * (For emergency rollback - call from browser console)
 */
export function disableAllSanity() {
  console.warn('⚠️ Disabling all Sanity feature flags - reverting to hardcoded data');
  (FEATURE_FLAGS as any).USE_SANITY_FOR_AI_PROJECTS = false;
  (FEATURE_FLAGS as any).USE_SANITY_FOR_CASE_STUDIES = false;
}

// Export for browser console access in development
if (import.meta.env.DEV) {
  (window as any).featureFlags = {
    current: FEATURE_FLAGS,
    enableAIProjects: enableSanityForAllAIProjects,
    disableAll: disableAllSanity,
    useSanityForAIProject,
    useSanityForCaseStudy,
  };
  console.log('🚩 Feature flags available via window.featureFlags');
}
