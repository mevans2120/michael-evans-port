import { groq } from 'next-sanity';

/**
 * Query to fetch all blog posts for listing page
 * Ordered by publishedAt descending (newest first)
 */
export const allBlogPostsQuery = groq`
  *[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author,
    featuredImage {
      asset,
      crop,
      hotspot,
      alt
    },
    asciiArt,
    featured,
    order
  }
`;

/**
 * Query to fetch a single blog post by slug
 * Includes all fields needed for rendering
 */
export const blogPostBySlugQuery = groq`
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    heroSection {
      badge,
      subtitle
    },
    content[] {
      ...,
      _type == "image" => {
        ...,
        asset->{
          _id,
          url
        },
        crop,
        hotspot,
        alt,
        caption,
        style
      }
    },
    publishedAt,
    updatedAt,
    author,
    featuredImage {
      asset->{
        _id,
        url
      },
      crop,
      hotspot,
      alt,
      caption
    },
    asciiArt,
    seo {
      metaTitle,
      metaDescription,
      ogImage {
        asset,
        alt
      }
    }
  }
`;

/**
 * Query to fetch all blog post slugs
 * Used for static generation (generateStaticParams)
 */
export const allBlogSlugsQuery = groq`
  *[_type == "blog" && defined(slug.current)] {
    "slug": slug.current
  }
`;

/**
 * Query to fetch featured blog posts
 * Useful for homepage or featured sections
 */
export const featuredBlogPostsQuery = groq`
  *[_type == "blog" && featured == true] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author,
    featuredImage {
      asset,
      crop,
      hotspot,
      alt
    }
  }
`;

/**
 * Query to fetch the first featured blog post for homepage
 * Returns a single blog post with all fields needed for display
 */
export const featuredBlogQuery = groq`
  *[_type == "blog" && featured == true] | order(order asc, publishedAt desc)[0] {
    _id,
    title,
    slug,
    excerpt,
    heroSection {
      badge,
      subtitle
    },
    publishedAt,
    author,
    featuredImage {
      asset,
      crop,
      hotspot,
      alt
    },
    asciiArt
  }
`;
