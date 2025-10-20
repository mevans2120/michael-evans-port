import { useEffect, useState } from 'react';
import { client } from '@/lib/sanity/client';
import { aiProjectQuery, allAIProjectsQuery } from '@/lib/sanity/queries';
import { AIProjectData } from '@/data/aiProjects';
import { logger } from '@/lib/logger';

/**
 * Placeholder image for missing hero images
 */
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop';

/**
 * Convert Sanity AI project data to AIProjectData format
 */
function convertSanityToAIProjectData(sanityData: any): AIProjectData {
  return {
    slug: sanityData.slug?.current || '',
    title: sanityData.title || '',
    subtitle: sanityData.subtitle || '',
    description: sanityData.description || '',
    heroImage: sanityData.heroImage?.asset?._ref
      ? `https://cdn.sanity.io/images/${import.meta.env.VITE_SANITY_PROJECT_ID}/production/${sanityData.heroImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`
      : PLACEHOLDER_IMAGE,
    category: sanityData.category || '',
    status: sanityData.status || 'In Progress',
    links: {
      live: sanityData.liveUrl,
      github: sanityData.githubUrl,
    },
    overview: sanityData.overview || {
      problem: '',
      solution: '',
      role: '',
      timeline: '',
    },
    metrics: sanityData.metrics || [],
    techStack: sanityData.techStack || [],
    aiComponents: sanityData.aiComponents || [],
    developmentProcess: sanityData.developmentProcess || [],
    learnings: sanityData.learnings || [],
    achievements: sanityData.achievements || [],
    images: (sanityData.images || []).map((img: any) => ({
      url: img.image?.asset?._ref
        ? `https://cdn.sanity.io/images/${import.meta.env.VITE_SANITY_PROJECT_ID}/production/${img.image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`
        : PLACEHOLDER_IMAGE,
      caption: img.caption || '',
    })),
  };
}

/**
 * Hook to fetch AI project data from Sanity CMS
 *
 * @param slug - The project slug (e.g., "post-pal")
 * @returns AI project data, loading state, and error state
 *
 * @example
 * ```tsx
 * const { data, loading, error } = useAIProject('post-pal');
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * if (!data) return <div>Project not found</div>;
 *
 * return <div>{data.title}</div>;
 * ```
 */
export function useAIProject(slug: string) {
  const [data, setData] = useState<AIProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      setError(null);

      try {
        logger.log(`📡 Fetching ${slug} from Sanity CMS`);

        const sanityData = await client.fetch(aiProjectQuery, { slug });

        if (!sanityData) {
          const errorMsg = `Project "${slug}" not found in Sanity CMS`;
          logger.error(`❌ ${errorMsg}`);
          setError(errorMsg);
          setData(null);
        } else {
          const convertedData = convertSanityToAIProjectData(sanityData);
          setData(convertedData);
          logger.log(`✅ Successfully loaded ${slug} from Sanity`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch project';
        logger.error(`❌ Error fetching project "${slug}":`, err);
        setError(errorMessage);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProject();
    } else {
      setLoading(false);
      setError('No slug provided');
    }
  }, [slug]);

  return { data, loading, error };
}

/**
 * Hook to fetch all AI projects from Sanity CMS
 *
 * @returns Array of all AI projects, loading state, and error state
 *
 * @example
 * ```tsx
 * const { data, loading, error } = useAllAIProjects();
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 *
 * return (
 *   <div>
 *     {data.map(project => (
 *       <div key={project.slug}>{project.title}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useAllAIProjects() {
  const [data, setData] = useState<AIProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllProjects() {
      setLoading(true);
      setError(null);

      try {
        logger.log('📡 Fetching all AI projects from Sanity CMS');

        const sanityProjects = await client.fetch(allAIProjectsQuery);

        if (!sanityProjects || sanityProjects.length === 0) {
          logger.warn('⚠️ No AI projects found in Sanity CMS');
          setData([]);
        } else {
          const convertedProjects = sanityProjects.map((project: any) => convertSanityToAIProjectData(project));
          setData(convertedProjects);
          logger.log(`✅ Successfully loaded ${convertedProjects.length} AI projects from Sanity`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
        logger.error('❌ Error fetching projects:', err);
        setError(errorMessage);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAllProjects();
  }, []);

  return { data, loading, error };
}
