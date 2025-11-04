import { NextRequest, NextResponse } from 'next/server';
import { client, urlFor } from '@/lib/sanity/client';

/**
 * TypeScript types for link metadata
 */
export interface LinkMetadata {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
}

interface SanityProject {
  title: string;
  category?: string;
  heroSection?: {
    subtitle?: string;
    summary?: string;
  };
  featuredImage?: {
    asset: {
      _ref: string;
    };
  };
}

interface SanityAIShowcase {
  title: string;
  category?: string;
  heroSection: {
    subtitle?: string;
    summary?: string;
  };
  featuredImage?: {
    asset: {
      _ref: string;
    };
  };
}

/**
 * GET /api/link-metadata
 *
 * Fetches metadata for case studies and AI showcase projects to display
 * rich link previews in the chatbot.
 *
 * Query Parameters:
 * - type: 'project' | 'aiShowcase' (required)
 * - slug: string (required) - The URL slug of the project/showcase
 *
 * Returns:
 * - 200: LinkMetadata object with title, category, description, imageUrl
 * - 400: Missing or invalid parameters
 * - 404: Project/showcase not found
 * - 500: Internal server error
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const slug = searchParams.get('slug');

    // Validate required parameters
    if (!type || !slug) {
      return NextResponse.json(
        { error: 'Missing required parameters: type and slug' },
        { status: 400 }
      );
    }

    // Validate type parameter
    if (type !== 'project' && type !== 'aiShowcase') {
      return NextResponse.json(
        { error: 'Invalid type parameter. Must be "project" or "aiShowcase"' },
        { status: 400 }
      );
    }

    // Fetch data based on type
    let data: SanityProject | SanityAIShowcase | null;

    if (type === 'project') {
      const query = `*[_type == "project" && slug.current == $slug][0] {
        title,
        category,
        heroSection {
          subtitle,
          summary
        },
        featuredImage {
          asset->{
            _id,
            url
          }
        }
      }`;

      data = await client.fetch<SanityProject>(query, { slug });
    } else {
      const query = `*[_type == "aiShowcase" && slug.current == $slug][0] {
        title,
        category,
        heroSection {
          subtitle,
          summary
        },
        featuredImage {
          asset->{
            _id,
            url
          }
        }
      }`;

      data = await client.fetch<SanityAIShowcase>(query, { slug });
    }

    // Check if data was found
    if (!data) {
      return NextResponse.json(
        { error: `${type} with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    // Extract description from heroSection (prioritize summary, fallback to subtitle)
    const description = data.heroSection?.summary || data.heroSection?.subtitle || '';

    // Generate optimized image URL
    let imageUrl = '';
    if (data.featuredImage?.asset) {
      imageUrl = urlFor(data.featuredImage)
        .width(400)
        .height(300)
        .fit('crop')
        .quality(85)
        .auto('format')
        .url();
    }

    // Format category for display
    const category = data.category || (type === 'project' ? 'Case Study' : 'AI Showcase');

    // Build response
    const metadata: LinkMetadata = {
      title: data.title,
      category,
      description,
      imageUrl,
    };

    // Return with cache headers (5 minutes)
    return NextResponse.json(metadata, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });

  } catch (error) {
    console.error('Error fetching link metadata:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
