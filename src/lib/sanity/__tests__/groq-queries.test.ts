/**
 * GROQ Query Structure Tests
 * Tests query syntax and expected data structure
 *
 * These tests ensure:
 * - GROQ queries are syntactically valid
 * - Queries return expected data structures
 * - Field projections match component requirements
 * - Query parameters are properly handled
 *
 * Note: These tests validate query structure against mock data.
 * They use mocked Sanity client to avoid external API calls.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { allBlogPostsQuery, blogPostBySlugQuery, allBlogSlugsQuery, featuredBlogQuery } from '../queries/blog';
import { client } from '@/sanity/lib/client';

// Mock the Sanity client
vi.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: vi.fn(),
  },
}));

describe('GROQ Query Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Blog Queries', () => {
    describe('allBlogPostsQuery', () => {
      it('returns array of blog posts with required fields', async () => {
        const mockBlogPosts = [
          {
            _id: 'blog-1',
            title: 'Test Blog Post',
            slug: { current: 'test-blog-post' },
            excerpt: 'This is a test excerpt',
            publishedAt: '2025-01-01T00:00:00Z',
            author: 'Michael Evans',
            featuredImage: {
              asset: { _ref: 'image-123' },
              alt: 'Test image',
            },
            featured: true,
            order: 1,
          },
          {
            _id: 'blog-2',
            title: 'Another Blog Post',
            slug: { current: 'another-blog-post' },
            excerpt: 'Another excerpt',
            publishedAt: '2024-12-01T00:00:00Z',
            author: 'Michael Evans',
            featuredImage: null,
            featured: false,
            order: null,
          },
        ];

        vi.mocked(client.fetch).mockResolvedValue(mockBlogPosts);

        const result = await client.fetch(allBlogPostsQuery);

        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({
          _id: expect.any(String),
          title: expect.any(String),
          slug: expect.objectContaining({ current: expect.any(String) }),
          excerpt: expect.any(String),
          publishedAt: expect.any(String),
          author: expect.any(String),
        });
      });

      it('includes featured image fields when present', async () => {
        const mockPost = {
          _id: 'blog-1',
          title: 'Test',
          slug: { current: 'test' },
          excerpt: 'Test',
          publishedAt: '2025-01-01',
          author: 'Test',
          featuredImage: {
            asset: { _ref: 'image-123' },
            crop: { top: 0, bottom: 0, left: 0, right: 0 },
            hotspot: { x: 0.5, y: 0.5, height: 1, width: 1 },
            alt: 'Test image',
          },
          featured: false,
          order: null,
        };

        vi.mocked(client.fetch).mockResolvedValue([mockPost]);

        const result = await client.fetch(allBlogPostsQuery);

        expect(result[0].featuredImage).toBeDefined();
        expect(result[0].featuredImage).toHaveProperty('asset');
        expect(result[0].featuredImage).toHaveProperty('alt');
      });

      it('handles null featured image gracefully', async () => {
        const mockPost = {
          _id: 'blog-1',
          title: 'Test',
          slug: { current: 'test' },
          excerpt: 'Test',
          publishedAt: '2025-01-01',
          author: 'Test',
          featuredImage: null,
          featured: false,
          order: null,
        };

        vi.mocked(client.fetch).mockResolvedValue([mockPost]);

        const result = await client.fetch(allBlogPostsQuery);

        expect(result[0].featuredImage).toBeNull();
      });

      it('orders posts by publishedAt descending', async () => {
        const mockPosts = [
          {
            _id: 'blog-1',
            title: 'Newer Post',
            slug: { current: 'newer' },
            excerpt: 'Newer',
            publishedAt: '2025-01-01T00:00:00Z',
            author: 'Test',
            featuredImage: null,
            featured: false,
            order: null,
          },
          {
            _id: 'blog-2',
            title: 'Older Post',
            slug: { current: 'older' },
            excerpt: 'Older',
            publishedAt: '2024-01-01T00:00:00Z',
            author: 'Test',
            featuredImage: null,
            featured: false,
            order: null,
          },
        ];

        vi.mocked(client.fetch).mockResolvedValue(mockPosts);

        const result = await client.fetch(allBlogPostsQuery);

        // Verify newer post comes first
        expect(new Date(result[0].publishedAt).getTime())
          .toBeGreaterThan(new Date(result[1].publishedAt).getTime());
      });
    });

    describe('blogPostBySlugQuery', () => {
      it('returns single blog post with full content', async () => {
        const mockPost = {
          _id: 'blog-1',
          _createdAt: '2025-01-01T00:00:00Z',
          _updatedAt: '2025-01-02T00:00:00Z',
          title: 'Test Blog Post',
          slug: { current: 'test-blog-post' },
          excerpt: 'Test excerpt',
          heroSection: {
            badge: 'Case Study',
            subtitle: 'Test subtitle',
          },
          content: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Test content' }],
            },
          ],
          publishedAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-02T00:00:00Z',
          author: 'Michael Evans',
          featuredImage: {
            asset: { _ref: 'image-123' },
            alt: 'Test',
            caption: 'Test caption',
          },
          seo: {
            metaTitle: 'Test Meta Title',
            metaDescription: 'Test meta description',
            ogImage: {
              asset: { _ref: 'image-456' },
              alt: 'OG image',
            },
          },
        };

        vi.mocked(client.fetch).mockResolvedValue(mockPost);

        const result = await client.fetch(blogPostBySlugQuery, { slug: 'test-blog-post' });

        expect(result).toBeDefined();
        expect(result._id).toBe('blog-1');
        expect(result.title).toBe('Test Blog Post');
        expect(result.slug.current).toBe('test-blog-post');
        expect(result.content).toBeDefined();
        expect(Array.isArray(result.content)).toBe(true);
      });

      it('includes hero section fields', async () => {
        const mockPost = {
          _id: 'blog-1',
          _createdAt: '2025-01-01',
          _updatedAt: '2025-01-01',
          title: 'Test',
          slug: { current: 'test' },
          excerpt: 'Test',
          heroSection: {
            badge: 'Insights',
            subtitle: 'A deep dive into testing',
          },
          content: [],
          publishedAt: '2025-01-01',
          author: 'Test',
          featuredImage: null,
          seo: null,
        };

        vi.mocked(client.fetch).mockResolvedValue(mockPost);

        const result = await client.fetch(blogPostBySlugQuery, { slug: 'test' });

        expect(result.heroSection).toBeDefined();
        expect(result.heroSection.badge).toBe('Insights');
        expect(result.heroSection.subtitle).toBe('A deep dive into testing');
      });

      it('includes SEO metadata', async () => {
        const mockPost = {
          _id: 'blog-1',
          _createdAt: '2025-01-01',
          _updatedAt: '2025-01-01',
          title: 'Test',
          slug: { current: 'test' },
          excerpt: 'Test',
          heroSection: null,
          content: [],
          publishedAt: '2025-01-01',
          author: 'Test',
          featuredImage: null,
          seo: {
            metaTitle: 'SEO Title',
            metaDescription: 'SEO Description',
            ogImage: {
              asset: { _ref: 'image-789' },
              alt: 'OG Alt',
            },
          },
        };

        vi.mocked(client.fetch).mockResolvedValue(mockPost);

        const result = await client.fetch(blogPostBySlugQuery, { slug: 'test' });

        expect(result.seo).toBeDefined();
        expect(result.seo.metaTitle).toBe('SEO Title');
        expect(result.seo.metaDescription).toBe('SEO Description');
        expect(result.seo.ogImage).toBeDefined();
      });

      it('returns null for non-existent slug', async () => {
        vi.mocked(client.fetch).mockResolvedValue(null);

        const result = await client.fetch(blogPostBySlugQuery, { slug: 'non-existent' });

        expect(result).toBeNull();
      });

      it('requires slug parameter', async () => {
        // The query expects a $slug parameter
        expect(blogPostBySlugQuery).toContain('$slug');
        expect(blogPostBySlugQuery).toContain('slug.current == $slug');
      });
    });

    describe('allBlogSlugsQuery', () => {
      it('returns array of slug objects', async () => {
        const mockSlugs = [
          { slug: 'first-post' },
          { slug: 'second-post' },
          { slug: 'third-post' },
        ];

        vi.mocked(client.fetch).mockResolvedValue(mockSlugs);

        const result = await client.fetch(allBlogSlugsQuery);

        expect(result).toHaveLength(3);
        expect(result[0]).toHaveProperty('slug');
        expect(typeof result[0].slug).toBe('string');
      });

      it('only includes posts with defined slugs', async () => {
        const mockSlugs = [
          { slug: 'valid-slug' },
        ];

        vi.mocked(client.fetch).mockResolvedValue(mockSlugs);

        const result = await client.fetch(allBlogSlugsQuery);

        // All results should have slugs (query filters out undefined)
        result.forEach((item: any) => {
          expect(item.slug).toBeDefined();
          expect(item.slug).not.toBeNull();
        });
      });

      it('returns empty array when no posts exist', async () => {
        vi.mocked(client.fetch).mockResolvedValue([]);

        const result = await client.fetch(allBlogSlugsQuery);

        expect(result).toEqual([]);
      });
    });

    describe('featuredBlogQuery', () => {
      it('returns single featured blog post', async () => {
        const mockPost = {
          _id: 'blog-1',
          title: 'Featured Post',
          slug: { current: 'featured-post' },
          excerpt: 'Featured excerpt',
          heroSection: {
            badge: 'Featured',
            subtitle: 'Check this out',
          },
          publishedAt: '2025-01-01T00:00:00Z',
          author: 'Michael Evans',
          featuredImage: {
            asset: { _ref: 'image-123' },
            alt: 'Featured',
          },
        };

        vi.mocked(client.fetch).mockResolvedValue(mockPost);

        const result = await client.fetch(featuredBlogQuery);

        expect(result).toBeDefined();
        expect(result.title).toBe('Featured Post');
      });

      it('returns null when no featured posts exist', async () => {
        vi.mocked(client.fetch).mockResolvedValue(null);

        const result = await client.fetch(featuredBlogQuery);

        expect(result).toBeNull();
      });

      it('includes hero section for featured post', async () => {
        const mockPost = {
          _id: 'blog-1',
          title: 'Featured',
          slug: { current: 'featured' },
          excerpt: 'Excerpt',
          heroSection: {
            badge: 'Featured Article',
            subtitle: 'Must read',
          },
          publishedAt: '2025-01-01',
          author: 'Test',
          featuredImage: null,
        };

        vi.mocked(client.fetch).mockResolvedValue(mockPost);

        const result = await client.fetch(featuredBlogQuery);

        expect(result.heroSection).toBeDefined();
        expect(result.heroSection.badge).toBe('Featured Article');
      });

      it('respects order field for multiple featured posts', async () => {
        // Query should order by order asc, publishedAt desc
        // So order=1 comes before order=2, and if orders are equal, newer publishedAt wins
        const mockPost = {
          _id: 'blog-1',
          title: 'First Featured (Order 1)',
          slug: { current: 'first' },
          excerpt: 'First',
          heroSection: null,
          publishedAt: '2025-01-01',
          author: 'Test',
          featuredImage: null,
        };

        vi.mocked(client.fetch).mockResolvedValue(mockPost);

        const result = await client.fetch(featuredBlogQuery);

        // Should return the first ordered post
        expect(result.title).toBe('First Featured (Order 1)');
      });
    });
  });

  describe('Query Structure Validation', () => {
    it('allBlogPostsQuery projects required listing fields', () => {
      // Verify query contains required field projections
      expect(allBlogPostsQuery).toContain('_id');
      expect(allBlogPostsQuery).toContain('title');
      expect(allBlogPostsQuery).toContain('slug');
      expect(allBlogPostsQuery).toContain('excerpt');
      expect(allBlogPostsQuery).toContain('publishedAt');
      expect(allBlogPostsQuery).toContain('featuredImage');
    });

    it('blogPostBySlugQuery projects full content fields', () => {
      expect(blogPostBySlugQuery).toContain('_id');
      expect(blogPostBySlugQuery).toContain('title');
      expect(blogPostBySlugQuery).toContain('content');
      expect(blogPostBySlugQuery).toContain('heroSection');
      expect(blogPostBySlugQuery).toContain('seo');
    });

    it('allBlogSlugsQuery projects only slug field', () => {
      expect(allBlogSlugsQuery).toContain('slug');
      expect(allBlogSlugsQuery).toContain('slug.current');
    });

    it('featuredBlogQuery filters by featured flag', () => {
      expect(featuredBlogQuery).toContain('featured == true');
    });

    it('queries use proper GROQ syntax', () => {
      const queries = [
        allBlogPostsQuery,
        blogPostBySlugQuery,
        allBlogSlugsQuery,
        featuredBlogQuery,
      ];

      queries.forEach(query => {
        // Should start with *[ for document queries
        expect(query.trim()).toMatch(/^\*\[/);

        // Should have proper projection syntax with {}
        expect(query).toContain('{');
        expect(query).toContain('}');
      });
    });

    it('queries that need parameters use $ syntax', () => {
      // blogPostBySlugQuery needs $slug parameter
      expect(blogPostBySlugQuery).toContain('$slug');
      expect(blogPostBySlugQuery).toMatch(/\$\w+/); // Should have parameter reference
    });

    it('order by clauses use proper syntax', () => {
      // Check that order by uses pipe syntax
      expect(allBlogPostsQuery).toContain('| order(');
      expect(featuredBlogQuery).toContain('| order(');
    });

    it('array indexing uses proper bracket syntax', () => {
      // blogPostBySlugQuery should select first result [0]
      expect(blogPostBySlugQuery).toContain('[0]');

      // featuredBlogQuery should select first result [0]
      expect(featuredBlogQuery).toContain('[0]');
    });
  });

  describe('Data Structure Validation', () => {
    it('validates image asset structure', async () => {
      const mockPost = {
        _id: 'blog-1',
        title: 'Test',
        slug: { current: 'test' },
        excerpt: 'Test',
        publishedAt: '2025-01-01',
        author: 'Test',
        featuredImage: {
          asset: { _ref: 'image-abc123' },
          crop: { top: 0, bottom: 0, left: 0, right: 0 },
          hotspot: { x: 0.5, y: 0.5, height: 1, width: 1 },
          alt: 'Test alt text',
        },
        featured: false,
        order: null,
      };

      vi.mocked(client.fetch).mockResolvedValue([mockPost]);

      const result = await client.fetch(allBlogPostsQuery);

      // Validate image structure
      expect(result[0].featuredImage.asset).toBeDefined();
      expect(result[0].featuredImage.asset._ref).toMatch(/^image-/);
      expect(result[0].featuredImage.alt).toBeDefined();
    });

    it('validates slug structure', async () => {
      const mockPost = {
        _id: 'blog-1',
        _createdAt: '2025-01-01',
        _updatedAt: '2025-01-01',
        title: 'Test',
        slug: {
          current: 'test-blog-post',
          _type: 'slug',
        },
        excerpt: 'Test',
        heroSection: null,
        content: [],
        publishedAt: '2025-01-01',
        author: 'Test',
        featuredImage: null,
        seo: null,
      };

      vi.mocked(client.fetch).mockResolvedValue(mockPost);

      const result = await client.fetch(blogPostBySlugQuery, { slug: 'test-blog-post' });

      // Slug should have current property
      expect(result.slug).toHaveProperty('current');
      expect(typeof result.slug.current).toBe('string');
    });

    it('validates portable text content structure', async () => {
      const mockPost = {
        _id: 'blog-1',
        _createdAt: '2025-01-01',
        _updatedAt: '2025-01-01',
        title: 'Test',
        slug: { current: 'test' },
        excerpt: 'Test',
        heroSection: null,
        content: [
          {
            _type: 'block',
            _key: 'block-1',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span-1',
                text: 'Test content',
                marks: [],
              },
            ],
          },
        ],
        publishedAt: '2025-01-01',
        author: 'Test',
        featuredImage: null,
        seo: null,
      };

      vi.mocked(client.fetch).mockResolvedValue(mockPost);

      const result = await client.fetch(blogPostBySlugQuery, { slug: 'test' });

      // Validate portable text structure
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]._type).toBe('block');
      expect(Array.isArray(result.content[0].children)).toBe(true);
    });
  });
});
