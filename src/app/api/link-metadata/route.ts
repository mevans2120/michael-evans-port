import { type NextRequest, NextResponse } from 'next/server';
import { client, urlFor } from '@/sanity/lib/client';

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

interface SanityBlog {
  title: string;
  excerpt?: string;
  heroSection?: {
    badge?: string;
    title?: string;
    subtitle?: string;
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
 * Fetches metadata for case studies and blog posts to display
 * rich link previews in the chatbot.
 *
 * Query Parameters:
 * - type: 'project' | 'blog' (required)
 * - slug: string (required) - The URL slug of the project/blog
 *
 * Returns:
 * - 200: LinkMetadata object with title, category, description, imageUrl
 * - 400: Missing or invalid parameters
 * - 404: Project/blog not found
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
    if (type !== 'project' && type !== 'blog') {
      return NextResponse.json(
        { error: 'Invalid type parameter. Must be "project" or "blog"' },
        { status: 400 }
      );
    }

    // Fetch data based on type
    let data: SanityProject | SanityBlog | null;

    if (type === 'project') {
      const query = `*[_type == "project" && slug.current == $slug][0] {
        title,
        category,
        featuredDescription,
        heroSection {
          subtitle
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
      // type === 'blog'
      const query = `*[_type == "blog" && slug.current == $slug][0] {
        title,
        excerpt,
        heroSection {
          badge,
          title,
          subtitle
        },
        featuredImage {
          asset->{
            _id,
            url
          }
        }
      }`;

      data = await client.fetch<SanityBlog>(query, { slug });
    }

    // Check if data was found
    if (!data) {
      return NextResponse.json(
        { error: `${type} with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    // Extract description based on type
    let description = '';
    if (type === 'blog' && 'excerpt' in data) {
      description = data.excerpt || data.heroSection?.subtitle || '';
    } else if ('heroSection' in data && data.heroSection) {
      // Use subtitle first, then featuredDescription for projects
      description = (data.heroSection.subtitle ||
        ('featuredDescription' in data ? data.featuredDescription : '') || '') as string;
    }

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
    let category = '';
    if (type === 'blog' && 'heroSection' in data && data.heroSection) {
      // Blog heroSection has badge field
      category = ('badge' in data.heroSection && data.heroSection.badge) ? data.heroSection.badge : 'Post';
    } else if ('category' in data && data.category) {
      category = data.category;
    } else if (type === 'project') {
      category = 'Case Study';
    } else {
      category = 'Post';
    }

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
