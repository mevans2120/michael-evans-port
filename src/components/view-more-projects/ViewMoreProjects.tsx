import { client } from '@/sanity/lib/client'
import { viewMoreProjectsSettingsQuery } from '@/lib/sanity/queries/viewMoreProjects'
import { getRecommendedProjects, getOtherProjects } from '@/lib/project-selection'
import { ViewMoreProjectsClient } from './ViewMoreProjectsClient'

interface ViewMoreProjectsProps {
  currentSlug: string
}

/**
 * Server component that fetches settings and projects
 * This component runs on the server and passes data to the client component
 */
export async function ViewMoreProjects({ currentSlug }: ViewMoreProjectsProps) {
  try {
    // Fetch the settings from Sanity
    const settings = await client.fetch(viewMoreProjectsSettingsQuery)

    // If the feature is disabled or settings don't exist, don't render anything
    if (!settings?.enabled) {
      return null
    }

    // Determine how many projects to show (default to 3)
    const projectCount = settings.numberOfProjects || 3

    // Get projects based on the selection strategy
    let projects = []

    if (settings.selectionStrategy === 'curated' && settings.curatedProjects?.length > 0) {
      // For curated, use the manually selected projects
      projects = settings.curatedProjects
        .filter((p: any) => p.slug && p.slug.current !== currentSlug)
        .slice(0, projectCount)
    } else {
      // For all other strategies, use the selection logic
      projects = await getRecommendedProjects({
        currentSlug,
        strategy: settings.selectionStrategy || 'random',
        count: projectCount,
        excludeIds: settings.excludeFromRandom?.map((p: any) => p._id) || [],
        curatedProjects: settings.curatedProjects || [],
        priorityBoost: settings.priorityBoost || []
      })
    }

    // If we couldn't get enough projects with the selected strategy,
    // fall back to simple random selection
    if (projects.length === 0) {
      projects = await getOtherProjects(currentSlug, projectCount)
    }

    // If still no projects, don't render
    if (projects.length === 0) {
      return null
    }

    // Normalize project data for the client component
    const normalizedProjects = projects.map((project: any) => ({
      slug: typeof project.slug === 'string' ? project.slug : project.slug?.current,
      title: project.title
    }))

    // Pass the settings and projects to the client component
    return (
      <ViewMoreProjectsClient
        projects={normalizedProjects}
        settings={{
          heading: settings.heading || 'Explore More Work',
          subheading: settings.subheading || 'Each project represents a unique challenge solved through thoughtful design and technical excellence.',
          layoutStyle: settings.layoutStyle || 'grid',
          ctaButton: settings.ctaButton,
          animation: settings.animation
        }}
      />
    )
  } catch (error) {
    console.error('Error rendering ViewMoreProjects:', error)
    // Don't break the page if there's an error
    return null
  }
}